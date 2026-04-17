/**
 * AIM VideoLens — Core: yt-dlp wrapper
 * Скачивание видео с YouTube, Instagram, TikTok через локальный yt-dlp бинарник.
 * Прямой вызов бинарника без deprecated npm-обёрток.
 */
export interface DownloadResult {
    filePath: string;
    title: string;
    duration: number;
    platform: string;
}
/**
 * Скачивает видео по URL во временную директорию.
 * @param url — ссылка на YouTube/Instagram/TikTok/VK
 * @param outDir — куда сохранять (по умолчанию os.tmpdir())
 * @returns путь к скачанному файлу
 */
export declare function downloadVideo(url: string, outDir?: string): Promise<DownloadResult>;
/**
 * Определяет платформу по URL
 */
export declare function detectPlatform(url: string): string;
/**
 * Проверяет, является ли строка URL-ом
 */
export declare function isUrl(input: string): boolean;
//# sourceMappingURL=ytdlp.d.ts.map