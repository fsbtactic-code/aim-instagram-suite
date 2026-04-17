/**
 * AIM VideoLens — Core: Media Processor
 * Главный координирующий пайплайн.
 * Реализует все 4 механики экономии токенов:
 *   1. Text-First: транскрибация перед визуальным анализом
 *   2. Adaptive Scene Detection: кадры только при смене сцены
 *   3. Image Gridding: все кадры → одна сетка 3x3
 *   4. Aggressive Downscale: 768px JPEG 70%
 */
import { SceneTimecode } from './ffmpeg.js';
import { TranscriptResult } from './whisper.js';
import { DownloadResult } from './ytdlp.js';
export interface ProcessedMedia {
    /** Транскрипт с таймкодами (text-first) */
    transcript: TranscriptResult;
    /** Форматированный текст транскрипта для LLM */
    transcriptText: string;
    /** Массив Base64 JPEG сеток кадров (до 10 сеток по 9 кадров) */
    gridImages: string[];
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
    slowSpots: Array<{
        from: string;
        to: string;
        durationSec: number;
    }>;
}
/**
 * Полный медиа-пайплайн (Text-First + Scene Grid).
 * Используется в aim_evaluate_video и aim_analyze_viral_reels.
 */
export declare function processVideo(videoPathOrUrl: string, options?: {
    hookOnly?: boolean;
    hooksSeconds?: number;
}): Promise<ProcessedMedia>;
/**
 * Пайплайн только для pacing-анализа (без сохранения кадров, только таймкоды).
 * Используется в aim_extract_pacing.
 */
export declare function extractPacingData(videoPathOrUrl: string, slowThresholdSec?: number): Promise<{
    media: ProcessedMedia;
    pacing: PacingData;
}>;
/** Полная очистка временной папки видео (вызывать после завершения работы) */
export declare function cleanupVideoTemp(media: ProcessedMedia): void;
//# sourceMappingURL=mediaProcessor.d.ts.map