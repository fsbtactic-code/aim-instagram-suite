/**
 * AIM VideoLens — Core: FFmpeg wrapper
 * Все операции с видео через локальный ffmpeg-static бинарник.
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

// ffmpeg-static provides the path to the bundled binary
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegPath: string = require('ffmpeg-static');

const execFileAsync = promisify(execFile);

export interface SceneTimecode {
  timecode: number;   // seconds
  ptsTime: string;    // human label e.g. "00:00:04.200"
}

function formatTimecode(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = (seconds % 60).toFixed(1);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Number(s).toFixed(1)).padStart(4, '0')}`;
}

/**
 * Извлекает аудиодорожку из видео в WAV формат для Whisper.
 */
export async function extractAudio(videoPath: string, outWavPath: string): Promise<void> {
  await execFileAsync(ffmpegPath, [
    '-y',
    '-i', videoPath,
    '-vn',                    // без видео
    '-acodec', 'pcm_s16le',   // 16-bit PCM — требование Whisper
    '-ar', '16000',           // 16kHz sample rate — требование Whisper
    '-ac', '1',               // моно
    outWavPath,
  ]);
}

/**
 * Умное извлечение кадров только при смене сцены (Adaptive Scene Detection).
 * Возвращает пути к сохранённым кадрам и их таймкоды.
 */
export async function extractSceneFrames(
  videoPath: string,
  outDir: string,
  threshold = 0.3,
  maxFrames = 90,
): Promise<{ framePaths: string[]; timecodes: string[] }> {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPattern = path.join(outDir, 'frame_%04d.jpg');

  // FFmpeg scene detection filter + save ALL scenes
  await execFileAsync(ffmpegPath, [
    '-y',
    '-i', videoPath,
    '-vf', `select='gt(scene,${threshold})',scale=768:-1`,
    '-vsync', 'vfr',
    '-q:v', '5',              // JPEG quality ~70%
    outPattern,
  ]);

  const allFrames = fs.readdirSync(outDir)
    .filter(f => f.startsWith('frame_') && f.endsWith('.jpg'))
    .sort()
    .map(f => path.join(outDir, f));

  // Get actual scene change timestamps for ALL scenes
  const { stdout } = await execFileAsync(ffmpegPath, [
    '-i', videoPath,
    '-vf', `select='gt(scene,${threshold})',showinfo`,
    '-vsync', 'vfr',
    '-f', 'null',
    '-',
  ], { maxBuffer: 10 * 1024 * 1024 }).catch(() => ({ stdout: '' }));

  // Parse pts_time from showinfo output (comes to stderr actually)
  const timeMatches = stdout.matchAll(/pts_time:([\d.]+)/g);
  const allTimes = Array.from(timeMatches).map(m => parseFloat(m[1]));

  // Re-build full timecodes
  const allTimecodes = allFrames.map((_, i) =>
    allTimes[i] !== undefined ? formatTimecode(allTimes[i]) : formatTimecode(i * 2),
  );

  // Сэмплируем (равномерно выбираем maxFrames)
  let framePaths = allFrames;
  let timecodes = allTimecodes;

  if (allFrames.length > maxFrames) {
    const step = allFrames.length / maxFrames;
    const indices = Array.from({ length: maxFrames }).map((_, i) => Math.floor(i * step));
    framePaths = indices.map(i => allFrames[i]);
    timecodes = indices.map(i => allTimecodes[i]);
  }

  return { framePaths, timecodes };
}

/**
 * Обрезает видео до указанного количества секунд (для анализа хука).
 */
export async function trimVideo(
  videoPath: string,
  durationSec: number,
  outPath: string,
): Promise<void> {
  await execFileAsync(ffmpegPath, [
    '-y',
    '-i', videoPath,
    '-t', String(durationSec),
    '-c', 'copy',
    outPath,
  ]);
}

/**
 * Детектирует таймкоды смены сцен БЕЗ сохранения кадров (для aim_extract_pacing).
 * Возвращает только массив временных меток в секундах.
 */
export async function detectSceneTimecodes(
  videoPath: string,
  threshold = 0.3,
): Promise<SceneTimecode[]> {
  // Use ffmpeg with scene filter + showinfo to stderr, parse timestamps
  return new Promise((resolve, reject) => {
    const args = [
      '-i', videoPath,
      '-vf', `select='gt(scene,${threshold})',showinfo`,
      '-vsync', 'vfr',
      '-f', 'null',
      '-',
    ];

    const proc = require('child_process').spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });

    proc.on('close', () => {
      const timecodes: SceneTimecode[] = [];
      const regex = /pts_time:([\d.]+)/g;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(stderr)) !== null) {
        const sec = parseFloat(match[1]);
        timecodes.push({ timecode: sec, ptsTime: formatTimecode(sec) });
      }

      // Always include t=0 as baseline
      if (timecodes.length === 0 || timecodes[0].timecode > 0.5) {
        timecodes.unshift({ timecode: 0, ptsTime: '00:00:00.0' });
      }

      resolve(timecodes);
    });

    proc.on('error', reject);
  });
}

/**
 * Возвращает длительность видео в секундах.
 */
export async function getVideoDuration(videoPath: string): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ffprobePath = require('ffmpeg-static').replace('ffmpeg', 'ffprobe');
  const probe = ffprobePath && fs.existsSync(ffprobePath) ? ffprobePath : ffmpegPath;

  const { stdout } = await execFileAsync(ffmpegPath, [
    '-i', videoPath,
    '-f', 'null',
    '-',
  ], { maxBuffer: 5 * 1024 * 1024 }).catch(e => ({ stdout: e.stderr ?? '' }));

  const match = /Duration:\s*([\d:]+\.[\d]+)/.exec(stdout + '');
  if (!match) return 0;

  const parts = match[1].split(':');
  return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
}
