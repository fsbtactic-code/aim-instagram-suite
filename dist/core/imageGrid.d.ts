/**
 * AIM VideoLens — Core: Image Grid Builder
 * Склеивает несколько кадров в одну сетку-коллаж через Sharp.
 * Добавляет таймкод в угол каждого кадра.
 * Результат: 1 JPEG 768px, quality 70% — минимум токенов для Claude.
 */
export interface GridOptions {
    cols?: number;
    cellWidth?: number;
    outputQuality?: number;
    maxWidth?: number;
}
/**
 * Строит сетку кадров из массива путей к изображениям.
 * @param imagePaths — пути к кадрам (JPG/PNG)
 * @param timecodes — таймкоды для каждого кадра ["00:00:02.3", ...]
 * @param options — параметры сетки
 * @returns Buffer — JPEG-изображение готовое для base64
 */
export declare function buildGrid(imagePaths: string[], timecodes: string[], options?: GridOptions): Promise<Buffer>;
/**
 * Конвертирует Grid-буфер в base64 строку для передачи в Claude.
 */
export declare function gridToBase64(buf: Buffer): string;
//# sourceMappingURL=imageGrid.d.ts.map