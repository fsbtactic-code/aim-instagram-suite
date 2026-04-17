/**
 * AIM VideoLens — Core: Image Grid Builder
 * Склеивает несколько кадров в одну сетку-коллаж через Sharp.
 * Добавляет таймкод в угол каждого кадра.
 * Результат: 1 JPEG 768px, quality 70% — минимум токенов для Claude.
 */

import sharp from 'sharp';
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
    cols = Math.max(3, Math.ceil(Math.sqrt(imagePaths.length))),
    cellWidth = 256,
    outputQuality = 70,
    maxWidth = 768,
  } = options;

  if (imagePaths.length === 0) {
    // Возвращаем пустую серую картинку если нет кадров
    return await sharp({
      create: { width: cellWidth, height: cellWidth, channels: 3, background: { r: 50, g: 50, b: 50 } },
    })
      .jpeg({ quality: outputQuality })
      .toBuffer();
  }

  const actualCols = Math.min(cols, imagePaths.length);
  const rows = Math.ceil(imagePaths.length / actualCols);
  const finalCellWidth = Math.floor(cellWidth);
  const finalCellHeight = finalCellWidth;

  // Обрабатываем каждый кадр: resize + добавить таймкод overlay
  const processedCells: Buffer[] = [];

  for (let i = 0; i < imagePaths.length; i++) {
    const imgPath = imagePaths[i];
    const timecode = timecodes[i] ?? '';

    if (!fs.existsSync(imgPath)) continue;

    try {
      // Подготавливаем оверлей
      const overlayWidth = Math.max(50, Math.floor(finalCellWidth * 0.8));
      const overlayBuffer = Buffer.from(buildTimecodeOverlay(timecode, overlayWidth));

      // Цепочка обработки: rotate -> resize -> composite (timecode) -> buffer
      // Форсируем точные целочисленные размеры ячейки
      const cellWithTimecode = await sharp(imgPath)
        .rotate()
        .resize(finalCellWidth, finalCellHeight, { 
          fit: 'contain', 
          background: { r: 20, g: 20, b: 20 } 
        })
        .composite([{
          input: overlayBuffer,
          gravity: 'southwest',
        }])
        .jpeg({ quality: 85 })
        .toBuffer();

      processedCells.push(cellWithTimecode);
    } catch {
      // Если кадр битый — добавляем серый placeholder
      const placeholder = await sharp({
        create: { width: finalCellWidth, height: finalCellHeight, channels: 3, background: { r: 40, g: 40, b: 40 } },
      })
        .jpeg({ quality: 85 })
        .toBuffer();
      processedCells.push(placeholder);
    }
  }

  // Склеиваем в сетку: создаём итоговый canvas
  const gridWidthReal = actualCols * finalCellWidth;
  const gridHeightReal = rows * finalCellHeight;

  const composites: sharp.OverlayOptions[] = [];
  for (let i = 0; i < processedCells.length; i++) {
    const cellBuf = processedCells[i];
    const col = i % actualCols;
    const row = Math.floor(i / actualCols);
    
    // Получаем RAW данные для исключения любых ошибок с размерами при склейке
    const { data, info } = await sharp(cellBuf)
      .raw()
      .toBuffer({ resolveWithObject: true });

    composites.push({
      input: data,
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels as 3 | 4,
      },
      left: col * finalCellWidth,
      top: row * finalCellHeight,
    });
  }

  // Склеиваем в сетку: сначала создаём большой холст (без ресайза в той же цепочке)
  // Это решает проблему VIPS "Image to composite must have same dimensions or smaller" на Windows
  const gridBuffer = await sharp({
    create: {
      width: gridWidthReal,
      height: gridHeightReal,
      channels: 3,
      background: { r: 15, g: 15, b: 15 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toBuffer();

  // Итоговый ресайз под лимиты Claude (max maxWidth)
  const grid = await sharp(gridBuffer)
    .resize(Math.min(gridWidthReal, maxWidth), null, { withoutEnlargement: true })
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

  return `<svg width="${Math.ceil(bgWidth + padding)}" height="${Math.ceil(bgHeight + padding)}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${padding}" y="${padding}" width="${bgWidth}" height="${bgHeight}" 
          rx="3" fill="rgba(0,0,0,0.75)"/>
    <text x="${padding * 2}" y="${padding + fontSize}" 
          font-family="monospace" font-size="${fontSize}" fill="#00ff88" font-weight="bold">
      ${timecode}
    </text>
  </svg>`;
}
