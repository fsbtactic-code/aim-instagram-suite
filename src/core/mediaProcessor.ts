/**
 * AIM VideoLens — Core: Media Processor
 * Главный координирующий пайплайн.
 * Реализует все 4 механики экономии токенов:
 *   1. Text-First: транскрибация перед визуальным анализом
 *   2. Adaptive Scene Detection: кадры только при смене сцены
 *   3. Image Gridding: все кадры → одна сетка 3x3
 *   4. Aggressive Downscale: 768px JPEG 70%
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { randomUUID } from 'crypto';

import { extractAudio, extractSceneFrames, trimVideo, detectSceneTimecodes, SceneTimecode } from './ffmpeg.js';
import { transcribe, formatTranscriptForLLM, TranscriptResult } from './whisper.js';
import { buildGrid, gridToBase64 } from './imageGrid.js';
import { downloadVideo, isUrl, DownloadResult } from './ytdlp.js';

export interface ProcessedMedia {
  /** Транскрипт с таймкодами (text-first) */
  transcript: TranscriptResult;
  /** Форматированный текст транскрипта для LLM */
  transcriptText: string;
  /** Base64 JPEG сетки кадров (один запрос к Vision) */
  gridBase64: string;
  /** Таймкоды смены сцен */
  sceneTimecodes: string[];
  /** Путь к видеофайлу (локальный, может быть скачанным) */
  localVideoPath: string;
  /** Был ли файл скачан (нужно для cleanup) */
  wasDownloaded: boolean;
  /** Метаданные если скачивали */
  downloadInfo?: DownloadResult;
}

export interface PacingData {
  /** Таймкоды смены сцен */
  timecodes: SceneTimecode[];
  /** Средний интервал между склейками (секунды) */
  avgCutInterval: number;
  /** Провисания: интервалы > threshold секунд */
  slowSpots: Array<{ from: string; to: string; durationSec: number }>;
}

/**
 * Полный медиа-пайплайн (Text-First + Scene Grid).
 * Используется в aim_evaluate_video и aim_analyze_viral_reels.
 */
export async function processVideo(
  videoPathOrUrl: string,
  options: { hookOnly?: boolean; hooksSeconds?: number } = {},
): Promise<ProcessedMedia> {
  const tmpBase = path.join(os.tmpdir(), `aim_${randomUUID()}`);
  fs.mkdirSync(tmpBase, { recursive: true });

  let localVideoPath = videoPathOrUrl;
  let wasDownloaded = false;
  let downloadInfo: DownloadResult | undefined;

  // === Шаг 0: Скачать если URL ===
  if (isUrl(videoPathOrUrl)) {
    console.error('[AIM] Скачиваем видео...', videoPathOrUrl);
    downloadInfo = await downloadVideo(videoPathOrUrl, path.join(tmpBase, 'dl'));
    localVideoPath = downloadInfo.filePath;
    wasDownloaded = true;
    console.error('[AIM] Скачано:', localVideoPath);
  }

  // === Шаг 1: Обрезка если hookOnly ===
  let processPath = localVideoPath;
  if (options.hookOnly) {
    const hookSec = options.hooksSeconds ?? 5;
    const trimmedPath = path.join(tmpBase, 'hook.mp4');
    await trimVideo(localVideoPath, hookSec, trimmedPath);
    processPath = trimmedPath;
    console.error(`[AIM] Обрезано до ${hookSec} секунд для анализа хука`);
  }

  // === Шаг 1: TEXT-FIRST — Транскрибация ===
  console.error('[AIM] Транскрибируем аудио через Whisper...');
  const wavPath = path.join(tmpBase, 'audio.wav');
  await extractAudio(processPath, wavPath);
  const transcript = await transcribe(wavPath);
  const transcriptText = formatTranscriptForLLM(transcript);
  console.error(`[AIM] Транскрипт: ${transcript.segments.length} сегментов, язык: ${transcript.language}`);

  // === Шаг 2: Adaptive Scene Detection — умное извлечение кадров ===
  console.error('[AIM] Извлекаем ключевые кадры (Scene Detection)...');
  const framesDir = path.join(tmpBase, 'frames');
  const { framePaths, timecodes } = await extractSceneFrames(processPath, framesDir);
  console.error(`[AIM] Найдено ${framePaths.length} ключевых кадров`);

  // === Шаг 3: Image Gridding — склейка в одну сетку ===
  console.error('[AIM] Создаём сетку кадров (Image Grid)...');
  const gridBuffer = await buildGrid(framePaths, timecodes);
  const gridBase64 = gridToBase64(gridBuffer);
  console.error(`[AIM] Сетка создана: ${Math.round(gridBase64.length / 1024)}KB base64`);

  // Cleanup временных кадров (но не видео — оно нужно вызывающему)
  cleanup(framesDir);
  cleanup(wavPath);

  return {
    transcript,
    transcriptText,
    gridBase64,
    sceneTimecodes: timecodes,
    localVideoPath,
    wasDownloaded,
    downloadInfo,
  };
}

/**
 * Пайплайн только для pacing-анализа (без сохранения кадров, только таймкоды).
 * Используется в aim_extract_pacing.
 */
export async function extractPacingData(
  videoPathOrUrl: string,
  slowThresholdSec = 4,
): Promise<{ media: ProcessedMedia; pacing: PacingData }> {
  const tmpBase = path.join(os.tmpdir(), `aim_pacing_${randomUUID()}`);
  fs.mkdirSync(tmpBase, { recursive: true });

  let localVideoPath = videoPathOrUrl;
  let wasDownloaded = false;
  let downloadInfo: DownloadResult | undefined;

  if (isUrl(videoPathOrUrl)) {
    downloadInfo = await downloadVideo(videoPathOrUrl, path.join(tmpBase, 'dl'));
    localVideoPath = downloadInfo.filePath;
    wasDownloaded = true;
  }

  // Только таймкоды — без сохранения кадров
  const timecodes = await detectSceneTimecodes(localVideoPath);

  // Вычисляем pacing
  const intervals: number[] = [];
  for (let i = 1; i < timecodes.length; i++) {
    intervals.push(timecodes[i].timecode - timecodes[i - 1].timecode);
  }
  const avgCutInterval = intervals.length > 0
    ? intervals.reduce((a, b) => a + b, 0) / intervals.length
    : 0;

  // Провисания
  const slowSpots = intervals
    .map((dur, i) => ({
      from: timecodes[i].ptsTime,
      to: timecodes[i + 1]?.ptsTime ?? 'конец',
      durationSec: dur,
    }))
    .filter(s => s.durationSec > slowThresholdSec);

  // Для pacing нужна транскрипция тоже (text-first подход)
  const wavPath = path.join(tmpBase, 'audio.wav');
  await extractAudio(localVideoPath, wavPath);
  const transcript = await transcribe(wavPath);
  const transcriptText = formatTranscriptForLLM(transcript);

  cleanup(wavPath);

  // Минимальная сетка для контекста (только 4 кадра)
  const framesDir = path.join(tmpBase, 'frames');
  const { framePaths, timecodes: frameTimes } = await extractSceneFrames(localVideoPath, framesDir, 0.4, 4);
  const gridBuffer = await buildGrid(framePaths, frameTimes, { cols: 2 });
  const gridBase64 = gridToBase64(gridBuffer);
  cleanup(framesDir);

  return {
    media: {
      transcript,
      transcriptText,
      gridBase64,
      sceneTimecodes: timecodes.map(t => t.ptsTime),
      localVideoPath,
      wasDownloaded,
      downloadInfo,
    },
    pacing: {
      timecodes,
      avgCutInterval,
      slowSpots,
    },
  };
}

/** Удаляет файл или директорию */
function cleanup(target: string): void {
  try {
    if (fs.existsSync(target)) {
      const stat = fs.statSync(target);
      if (stat.isDirectory()) {
        fs.rmSync(target, { recursive: true, force: true });
      } else {
        fs.unlinkSync(target);
      }
    }
  } catch {
    // Игнорируем ошибки cleanup
  }
}

/** Полная очистка временной папки видео (вызывать после завершения работы) */
export function cleanupVideoTemp(media: ProcessedMedia): void {
  if (media.wasDownloaded && media.localVideoPath) {
    cleanup(path.dirname(media.localVideoPath));
  }
}
