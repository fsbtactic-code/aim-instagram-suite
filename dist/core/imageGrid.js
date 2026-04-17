"use strict";
/**
 * AIM VideoLens — Core: Image Grid Builder
 * Склеивает несколько кадров в одну сетку-коллаж через Sharp.
 * Добавляет таймкод в угол каждого кадра.
 * Результат: 1 JPEG 768px, quality 70% — минимум токенов для Claude.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGrid = buildGrid;
exports.gridToBase64 = gridToBase64;
const sharp_1 = __importDefault(require("sharp"));
const fs = __importStar(require("fs"));
/**
 * Строит сетку кадров из массива путей к изображениям.
 * @param imagePaths — пути к кадрам (JPG/PNG)
 * @param timecodes — таймкоды для каждого кадра ["00:00:02.3", ...]
 * @param options — параметры сетки
 * @returns Buffer — JPEG-изображение готовое для base64
 */
async function buildGrid(imagePaths, timecodes, options = {}) {
    const { cols = Math.max(3, Math.ceil(Math.sqrt(imagePaths.length))), cellWidth = 256, outputQuality = 70, maxWidth = 768, } = options;
    if (imagePaths.length === 0) {
        // Возвращаем пустую серую картинку если нет кадров
        return await (0, sharp_1.default)({
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
    const processedCells = [];
    for (let i = 0; i < imagePaths.length; i++) {
        const imgPath = imagePaths[i];
        const timecode = timecodes[i] ?? '';
        if (!fs.existsSync(imgPath))
            continue;
        try {
            // Подготавливаем оверлей
            const overlayWidth = Math.max(50, Math.floor(finalCellWidth * 0.8));
            const overlayBuffer = Buffer.from(buildTimecodeOverlay(timecode, overlayWidth));
            // Цепочка обработки: rotate -> resize -> composite (timecode) -> buffer
            // Форсируем точные целочисленные размеры ячейки
            const cellWithTimecode = await (0, sharp_1.default)(imgPath)
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
        }
        catch {
            // Если кадр битый — добавляем серый placeholder
            const placeholder = await (0, sharp_1.default)({
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
    const composites = [];
    for (let i = 0; i < processedCells.length; i++) {
        const cellBuf = processedCells[i];
        const col = i % actualCols;
        const row = Math.floor(i / actualCols);
        // Получаем RAW данные для исключения любых ошибок с размерами при склейке
        const { data, info } = await (0, sharp_1.default)(cellBuf)
            .raw()
            .toBuffer({ resolveWithObject: true });
        composites.push({
            input: data,
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels,
            },
            left: col * finalCellWidth,
            top: row * finalCellHeight,
        });
    }
    // Склеиваем в сетку: сначала создаём большой холст (без ресайза в той же цепочке)
    // Это решает проблему VIPS "Image to composite must have same dimensions or smaller" на Windows
    const gridBuffer = await (0, sharp_1.default)({
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
    const grid = await (0, sharp_1.default)(gridBuffer)
        .resize(Math.min(gridWidthReal, maxWidth), null, { withoutEnlargement: true })
        .jpeg({ quality: outputQuality })
        .toBuffer();
    return grid;
}
/**
 * Конвертирует Grid-буфер в base64 строку для передачи в Claude.
 */
function gridToBase64(buf) {
    return buf.toString('base64');
}
/**
 * Генерирует SVG с таймкодом для наложения на кадр.
 */
function buildTimecodeOverlay(timecode, width) {
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
//# sourceMappingURL=imageGrid.js.map