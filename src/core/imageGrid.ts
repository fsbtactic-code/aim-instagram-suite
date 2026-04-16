/**
 * AIM VideoLens — Core: Image Grid Builder
 * Склеивает несколько кадров в одну сетку-коллаж через Sharp.
 * Добавляет таймкод в угол каждого кадра.
 * Результат: 1 JPEG 768px, quality 70% — минимум токенов для Claude.
 */

import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

export interface GridOptions {
  cols?: number;          // колонок в сетке (default: 3)
  cellWidth?: number;     // ширина одного кадра (default: 256)
  outputQuality?: number; // JPEG quality (default: 70)
  maxWidth?: number;      // максимальная ширина итоговой картинки (default: 768)
}

/**
 * Строит сетку кадров из массива путей к изображениям.
 * @param imagePaths — пути к кадрам (JPG/PNG)
 * @param timecodes — таймкоды для каждого кадра ["00:00:02.3", ...]
 * @param options — параметры сетки
 * @returns Buffer — JPEG-изображение готовое для base64
 */
export async function buildGrid(
  imagePaths: string[],
  timecodes: string[],
  options: GridOptions = {},
): Promise<Buffer> {
  const {
    cols = 3,
    cellWidth = 256,
    outputQuality = 70,
    maxWidth = 768,
  } = options;

  if (imagePaths.length === 0) {
    // Возвращаем пустую серую картинку если нет кадров
    return await (sharp as unknown as typeof import('sharp'))({
      create: { width: cellWidth, height: cellWidth, channels: 3, background: { r: 50, g: 50, b: 50 } },
    })
      .jpeg({ quality: outputQuality })
      .toBuffer();
  }

  const actualCols = Math.min(cols, imagePaths.length);
  const rows = Math.ceil(imagePaths.length / actualCols);
  const cellHeight = cellWidth; // Квадратные ячейки (видео 9:16 будет letterboxed)

  // Обрабатываем каждый кадр: resize + добавить таймкод overlay
  const processedCells: Buffer[] = [];

  for (let i = 0; i < imagePaths.length; i++) {
    const imgPath = imagePaths[i];
    const timecode = timecodes[i] ?? '';

    if (!fs.existsSync(imgPath)) continue;

    try {
      // Resize кадр до размера ячейки
      const cell = await (sharp as unknown as typeof import('sharp'))(imgPath)
        .resize(cellWidth, cellHeight, { fit: 'contain', background: { r: 20, g: 20, b: 20 } })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Добавляем SVG-оверлей с таймкодом
      const cellWithTimecode = await (sharp as unknown as typeof import('sharp'))(cell)
        .composite([{
          input: Buffer.from(buildTimecodeOverlay(timecode, cellWidth)),
          gravity: 'southwest',
        }])
        .jpeg({ quality: 85 })
        .toBuffer();

      processedCells.push(cellWithTimecode);
    } catch {
      // Если кадр битый — добавляем серый placeholder
      const placeholder = await (sharp as unknown as typeof import('sharp'))({
        create: { width: cellWidth, height: cellHeight, channels: 3, background: { r: 40, g: 40, b: 40 } },
      })
        .jpeg({ quality: 85 })
        .toBuffer();
      processedCells.push(placeholder);
    }
  }

  // Склеиваем в сетку: создаём итоговый canvas
  const gridWidth = actualCols * cellWidth;
  const gridHeight = rows * cellHeight;

  // Создаём пустой тёмный фон
  const composites: sharp.OverlayOptions[] = processedCells.map((cellBuf, i) => {
    const col = i % actualCols;
    const row = Math.floor(i / actualCols);
    return {
      input: cellBuf,
      left: col * cellWidth,
      top: row * cellHeight,
    };
  });

  const grid = await (sharp as unknown as typeof import('sharp'))({
    create: {
      width: gridWidth,
      height: gridHeight,
      channels: 3,
      background: { r: 15, g: 15, b: 15 },
    },
  })
    .composite(composites)
    .resize(Math.min(gridWidth, maxWidth), null, { withoutEnlargement: true })
    .jpeg({ quality: outputQuality })
    .toBuffer();

  return grid;
}

/**
 * Конвертирует Grid-буфер в base64 строку для передачи в Claude.
 */
export function gridToBase64(buf: Buffer): string {
  return buf.toString('base64');
}

/**
 * Генерирует SVG с таймкодом для наложения на кадр.
 */
function buildTimecodeOverlay(timecode: string, width: number): string {
  const fontSize = Math.max(10, Math.floor(width / 16));
  const padding = 4;
  const textWidth = timecode.length * (fontSize * 0.6);
  const bgWidth = textWidth + padding * 2;
  const bgHeight = fontSize + padding * 2;

  return `<svg width="${width}" height="${bgHeight + padding}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${padding}" y="${padding}" width="${bgWidth}" height="${bgHeight}" 
          rx="3" fill="rgba(0,0,0,0.75)"/>
    <text x="${padding * 2}" y="${padding + fontSize}" 
          font-family="monospace" font-size="${fontSize}" fill="#00ff88" font-weight="bold">
      ${timecode}
    </text>
  </svg>`;
}
