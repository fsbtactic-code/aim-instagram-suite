export interface InstagramMedia {
    url: string;
    isVideo: boolean;
}
/**
 * Загрузка медиа по прямой ссылке с сохранением во временный файл
 */
export declare function downloadFileFast(url: string, destDir: string, extension: string): Promise<string>;
/**
 * Главный фасад для парсинга инстаграма через сторонние сервисы с жестким анти-провалом
 */
export declare function scrapeInstagramMedia(url: string): Promise<InstagramMedia[]>;
//# sourceMappingURL=instagramScraper.d.ts.map