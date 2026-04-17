"use strict";
/**
 * AIM VideoLens — Core: FFmpeg wrapper
 * Все операции с видео через локальный ffmpeg-static бинарник.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAudio = extractAudio;
exports.extractSceneFrames = extractSceneFrames;
exports.trimVideo = trimVideo;
exports.detectSceneTimecodes = detectSceneTimecodes;
exports.getVideoDuration = getVideoDuration;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// ffmpeg-static provides the path to the bundled binary
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegPath = require('ffmpeg-static');
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
function formatTimecode(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = (seconds % 60).toFixed(1);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Number(s).toFixed(1)).padStart(4, '0')}`;
}
/**
 * Проверяет, есть ли в видео аудиодорожка.
 */
async function hasAudioStream(videoPath) {
    try {
        const { stderr } = await execFileAsync(ffmpegPath, [
            '-i', videoPath,
            '-f', 'null', '-',
        ], { maxBuffer: 5 * 1024 * 1024 }).catch((e) => ({ stderr: e.stderr ?? '' }));
        return /Stream.*Audio:/i.test(stderr);
    }
    catch {
        return false;
    }
}
/**
 * Создаёт тихий WAV файл (1 секунда, 16kHz, моно).
 * Используется как fallback когда у видео нет аудиодорожки.
 */
async function createSilentWav(outWavPath) {
    await execFileAsync(ffmpegPath, [
        '-y',
        '-f', 'lavfi',
        '-i', 'anullsrc=r=16000:cl=mono',
        '-t', '1',
        '-acodec', 'pcm_s16le',
        '-ar', '16000',
        '-ac', '1',
        outWavPath,
    ]);
}
/**
 * Извлекает аудиодорожку из видео в WAV формат для Whisper.
 * Если видео без аудио (video-only DASH stream) — создаёт тихий WAV-файл,
 * чтобы Whisper вернул пустой транскрипт вместо аварийного завершения.
 */
async function extractAudio(videoPath, outWavPath) {
    const audioExists = await hasAudioStream(videoPath);
    if (!audioExists) {
        console.error('[AIM] Аудиодорожка не найдена (video-only stream). Создаём тихий WAV для Whisper...');
        await createSilentWav(outWavPath);
        return;
    }
    await execFileAsync(ffmpegPath, [
        '-y',
        '-i', videoPath,
        '-vn', // без видео
        '-acodec', 'pcm_s16le', // 16-bit PCM — требование Whisper
        '-ar', '16000', // 16kHz sample rate — требование Whisper
        '-ac', '1', // моно
        outWavPath,
    ]);
}
/**
 * Умное извлечение кадров только при смене сцены (Adaptive Scene Detection).
 * Возвращает пути к сохранённым кадрам и их таймкоды.
 */
async function extractSceneFrames(videoPath, outDir, threshold = 0.3, maxFrames = 90) {
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
        '-q:v', '5', // JPEG quality ~70%
        outPattern,
    ]);
    const allFrames = fs.readdirSync(outDir)
        .filter(f => f.startsWith('frame_') && f.endsWith('.jpg'))
        .sort()
        .map(f => path.join(outDir, f));
    // Get actual scene change timestamps for ALL scenes
    // NOTE: ffmpeg showinfo outputs to stderr, not stdout
    let showInfoOutput = '';
    try {
        await execFileAsync(ffmpegPath, [
            '-i', videoPath,
            '-vf', `select='gt(scene,${threshold})',showinfo`,
            '-vsync', 'vfr',
            '-f', 'null',
            '-',
        ], { maxBuffer: 10 * 1024 * 1024 });
    }
    catch (e) {
        // ffmpeg always "fails" when writing to null — stderr has the data we need
        showInfoOutput = e.stderr ?? '';
    }
    // Parse pts_time from showinfo output (comes in stderr)
    const timeMatches = showInfoOutput.matchAll(/pts_time:([\d.]+)/g);
    const allTimes = Array.from(timeMatches).map(m => parseFloat(m[1]));
    // Re-build full timecodes
    const allTimecodes = allFrames.map((_, i) => allTimes[i] !== undefined ? formatTimecode(allTimes[i]) : formatTimecode(i * 2));
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
async function trimVideo(videoPath, durationSec, outPath) {
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
async function detectSceneTimecodes(videoPath, threshold = 0.3) {
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
        proc.stderr.on('data', (d) => { stderr += d.toString(); });
        proc.on('close', () => {
            const timecodes = [];
            const regex = /pts_time:([\d.]+)/g;
            let match;
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
async function getVideoDuration(videoPath) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ffprobePath = require('ffmpeg-static').replace('ffmpeg', 'ffprobe');
    const probe = ffprobePath && fs.existsSync(ffprobePath) ? ffprobePath : ffmpegPath;
    const { stdout } = await execFileAsync(ffmpegPath, [
        '-i', videoPath,
        '-f', 'null',
        '-',
    ], { maxBuffer: 5 * 1024 * 1024 }).catch(e => ({ stdout: e.stderr ?? '' }));
    const match = /Duration:\s*([\d:]+\.[\d]+)/.exec(stdout + '');
    if (!match)
        return 0;
    const parts = match[1].split(':');
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
}
//# sourceMappingURL=ffmpeg.js.map