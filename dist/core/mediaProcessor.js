"use strict";
/**
 * AIM VideoLens — Core: Media Processor
 * Главный координирующий пайплайн.
 * Реализует все 4 механики экономии токенов:
 *   1. Text-First: транскрибация перед визуальным анализом
 *   2. Adaptive Scene Detection: кадры только при смене сцены
 *   3. Image Gridding: все кадры → одна сетка 3x3
 *   4. Aggressive Downscale: 768px JPEG 70%
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
exports.processVideo = processVideo;
exports.extractPacingData = extractPacingData;
exports.cleanupVideoTemp = cleanupVideoTemp;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const crypto_1 = require("crypto");
const ffmpeg_js_1 = require("./ffmpeg.js");
const whisper_js_1 = require("./whisper.js");
const imageGrid_js_1 = require("./imageGrid.js");
const ytdlp_js_1 = require("./ytdlp.js");
/**
 * Полный медиа-пайплайн (Text-First + Scene Grid).
 * Используется в aim_evaluate_video и aim_analyze_viral_reels.
 */
async function processVideo(videoPathOrUrl, options = {}) {
    const tmpBase = path.join(os.tmpdir(), `aim_${(0, crypto_1.randomUUID)()}`);
    fs.mkdirSync(tmpBase, { recursive: true });
    let localVideoPath = videoPathOrUrl;
    let wasDownloaded = false;
    let downloadInfo;
    // === Шаг 0: Скачать если URL ===
    if ((0, ytdlp_js_1.isUrl)(videoPathOrUrl)) {
        console.error('[AIM] Скачиваем видео...', videoPathOrUrl);
        downloadInfo = await (0, ytdlp_js_1.downloadVideo)(videoPathOrUrl, path.join(tmpBase, 'dl'));
        localVideoPath = downloadInfo.filePath;
        wasDownloaded = true;
        console.error('[AIM] Скачано:', localVideoPath);
    }
    // === Шаг 1: Обрезка если hookOnly ===
    let processPath = localVideoPath;
    if (options.hookOnly) {
        const hookSec = options.hooksSeconds ?? 5;
        const trimmedPath = path.join(tmpBase, 'hook.mp4');
        await (0, ffmpeg_js_1.trimVideo)(localVideoPath, hookSec, trimmedPath);
        processPath = trimmedPath;
        console.error(`[AIM] Обрезано до ${hookSec} секунд для анализа хука`);
    }
    // === Шаг 1: TEXT-FIRST — Транскрибация ===
    console.error('[AIM] Транскрибируем аудио через Whisper...');
    const wavPath = path.join(tmpBase, 'audio.wav');
    await (0, ffmpeg_js_1.extractAudio)(processPath, wavPath);
    const transcript = await (0, whisper_js_1.transcribe)(wavPath, 'tiny');
    const transcriptText = (0, whisper_js_1.formatTranscriptForLLM)(transcript);
    console.error(`[AIM] Транскрипт: ${transcript.segments.length} сегментов, язык: ${transcript.language}`);
    // === Шаг 2: Adaptive Scene Detection — умное извлечение кадров ===
    console.error('[AIM] Извлекаем ключевые кадры (Scene Detection)...');
    const framesDir = path.join(tmpBase, 'frames');
    const { framePaths, timecodes } = await (0, ffmpeg_js_1.extractSceneFrames)(processPath, framesDir);
    console.error(`[AIM] Найдено ${framePaths.length} ключевых кадров`);
    // === Шаг 3: Image Gridding — склейка в несколько сеток (до 10 штук по 9 кадров) ===
    console.error('[AIM] Создаём сетки кадров (Image Grids)...');
    const gridImages = [];
    const chunkSize = 9; // Сетка 3x3
    for (let i = 0; i < framePaths.length; i += chunkSize) {
        const chunkPaths = framePaths.slice(i, i + chunkSize);
        const chunkTimes = timecodes.slice(i, i + chunkSize);
        const gridBuffer = await (0, imageGrid_js_1.buildGrid)(chunkPaths, chunkTimes, { cols: 3 });
        gridImages.push((0, imageGrid_js_1.gridToBase64)(gridBuffer));
    }
    console.error(`[AIM] Создано сеток: ${gridImages.length} шт.`);
    // Cleanup временных кадров (но не видео — оно нужно вызывающему)
    cleanup(framesDir);
    cleanup(wavPath);
    return {
        transcript,
        transcriptText,
        gridImages,
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
async function extractPacingData(videoPathOrUrl, slowThresholdSec = 4) {
    const tmpBase = path.join(os.tmpdir(), `aim_pacing_${(0, crypto_1.randomUUID)()}`);
    fs.mkdirSync(tmpBase, { recursive: true });
    let localVideoPath = videoPathOrUrl;
    let wasDownloaded = false;
    let downloadInfo;
    if ((0, ytdlp_js_1.isUrl)(videoPathOrUrl)) {
        downloadInfo = await (0, ytdlp_js_1.downloadVideo)(videoPathOrUrl, path.join(tmpBase, 'dl'));
        localVideoPath = downloadInfo.filePath;
        wasDownloaded = true;
    }
    // Только таймкоды — без сохранения кадров
    const timecodes = await (0, ffmpeg_js_1.detectSceneTimecodes)(localVideoPath);
    // Вычисляем pacing
    const intervals = [];
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
    await (0, ffmpeg_js_1.extractAudio)(localVideoPath, wavPath);
    const transcript = await (0, whisper_js_1.transcribe)(wavPath, 'tiny');
    const transcriptText = (0, whisper_js_1.formatTranscriptForLLM)(transcript);
    cleanup(wavPath);
    // Минимальная сетка для контекста (только 4 кадра)
    const framesDir = path.join(tmpBase, 'frames');
    const { framePaths, timecodes: frameTimes } = await (0, ffmpeg_js_1.extractSceneFrames)(localVideoPath, framesDir, 0.4, 6);
    const gridBuffer = await (0, imageGrid_js_1.buildGrid)(framePaths, frameTimes, { cols: 3 });
    const gridImages = [(0, imageGrid_js_1.gridToBase64)(gridBuffer)];
    cleanup(framesDir);
    return {
        media: {
            transcript,
            transcriptText,
            gridImages,
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
function cleanup(target) {
    try {
        if (fs.existsSync(target)) {
            const stat = fs.statSync(target);
            if (stat.isDirectory()) {
                fs.rmSync(target, { recursive: true, force: true });
            }
            else {
                fs.unlinkSync(target);
            }
        }
    }
    catch {
        // Игнорируем ошибки cleanup
    }
}
/** Полная очистка временной папки видео (вызывать после завершения работы) */
function cleanupVideoTemp(media) {
    if (media.wasDownloaded && media.localVideoPath) {
        cleanup(path.dirname(media.localVideoPath));
    }
}
//# sourceMappingURL=mediaProcessor.js.map