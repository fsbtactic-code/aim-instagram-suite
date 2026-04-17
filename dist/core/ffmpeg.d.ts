/**
 * AIM VideoLens — Core: FFmpeg wrapper
 * Все операции с видео через локальный ffmpeg-static бинарник.
 */
export interface SceneTimecode {
    timecode: number;
    ptsTime: string;
}
/**
 * Извлекает аудиодорожку из видео в WAV формат для Whisper.
 * Если видео без аудио (video-only DASH stream) — создаёт тихий WAV-файл,
 * чтобы Whisper вернул пустой транскрипт вместо аварийного завершения.
 */
export declare function extractAudio(videoPath: string, outWavPath: string): Promise<void>;
/**
 * Умное извлечение кадров только при смене сцены (Adaptive Scene Detection).
 * Возвращает пути к сохранённым кадрам и их таймкоды.
 */
export declare function extractSceneFrames(videoPath: string, outDir: string, threshold?: number, maxFrames?: number): Promise<{
    framePaths: string[];
    timecodes: string[];
}>;
/**
 * Обрезает видео до указанного количества секунд (для анализа хука).
 */
export declare function trimVideo(videoPath: string, durationSec: number, outPath: string): Promise<void>;
/**
 * Детектирует таймкоды смены сцен БЕЗ сохранения кадров (для aim_extract_pacing).
 * Возвращает только массив временных меток в секундах.
 */
export declare function detectSceneTimecodes(videoPath: string, threshold?: number): Promise<SceneTimecode[]>;
/**
 * Возвращает длительность видео в секундах.
 */
export declare function getVideoDuration(videoPath: string): Promise<number>;
//# sourceMappingURL=ffmpeg.d.ts.map