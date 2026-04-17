"use strict";
/**
 * AIM Instagram Suite — Tool: aim_analyze_carousel
 * Разбор Instagram-карусели: скачать → коллаж-лента → анализ воронки и триггеров.
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
exports.analyzeCarousel = analyzeCarousel;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const crypto_1 = require("crypto");
const ytdlp_js_1 = require("../core/ytdlp.js");
const imageGrid_js_1 = require("../core/imageGrid.js");
async function analyzeCarousel(input) {
    const { url, outputMdPath } = input;
    const platform = (0, ytdlp_js_1.detectPlatform)(url);
    const tmpBase = path.join(os.tmpdir(), `aim_carousel_${(0, crypto_1.randomUUID)()}`);
    fs.mkdirSync(tmpBase, { recursive: true });
    // ── Шаг 1: Скачиваем все медиа из поста ─────────────────────────────────
    const { execFile } = await import('child_process');
    const { promisify } = await import('util');
    const execFileAsync = promisify(execFile);
    // Путь к yt-dlp бинарнику
    const BIN_DIR = path.join(path.resolve(), 'bin');
    const isWindows = os.platform() === 'win32';
    const YTDLP_BINARY = path.join(BIN_DIR, isWindows ? 'yt-dlp.exe' : 'yt-dlp');
    const ytdlpBin = fs.existsSync(YTDLP_BINARY) ? YTDLP_BINARY : (isWindows ? 'yt-dlp.exe' : 'yt-dlp');
    console.error('[AIM] Скачиваем карусель:', url);
    let downloadedFiles = [];
    // -- ИНТЕГРАЦИЯ НОВОГО SCRAPER'A ДЛЯ INSTAGRAM --
    if (platform === 'Instagram') {
        console.error('[AIM] Instagram detected, delegating to external scraping APIs...');
        try {
            const { scrapeInstagramMedia, downloadFileFast } = await import('../core/instagramScraper.js');
            const mediaList = await scrapeInstagramMedia(url);
            if (mediaList.length > 0) {
                let i = 1;
                for (const item of mediaList) {
                    const ext = item.isVideo ? 'mp4' : 'jpg';
                    const savedPath = await downloadFileFast(item.url, tmpBase, ext);
                    // Rename to keep strict slide order for the grid
                    const orderedPath = path.join(tmpBase, `slide_${String(i).padStart(2, '0')}.${ext}`);
                    fs.renameSync(savedPath, orderedPath);
                    downloadedFiles.push(orderedPath);
                    i++;
                }
                console.error(`[AIM] External API скачал файлов: ${downloadedFiles.length}`);
            }
        }
        catch (e) {
            console.error('[AIM] External API failed, falling back to local yt-dlp:', e.message);
        }
    }
    // Fallback to yt-dlp if not instagram or external scraper failed
    if (downloadedFiles.length === 0) {
        try {
            await execFileAsync(ytdlpBin, [
                url,
                '-o', path.join(tmpBase, 'slide_%(playlist_index)s.%(ext)s'),
                '--no-playlist',
                '--write-thumbnail',
                '--convert-thumbnails', 'jpg',
                '--quiet',
            ], { maxBuffer: 20 * 1024 * 1024 });
            downloadedFiles = fs.readdirSync(tmpBase)
                .filter(f => /\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(f))
                .sort()
                .map(f => path.join(tmpBase, f));
            console.error(`[AIM] Скачано файлов (yt-dlp): ${downloadedFiles.length}`);
        }
        catch (e) {
            console.error('[AIM] Ошибка скачивания (yt-dlp):', e.message);
            try {
                await execFileAsync(ytdlpBin, [
                    url,
                    '-o', path.join(tmpBase, 'media.%(ext)s'),
                    '--quiet',
                ], { maxBuffer: 20 * 1024 * 1024 });
                downloadedFiles = fs.readdirSync(tmpBase)
                    .filter(f => /\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(f))
                    .map(f => path.join(tmpBase, f));
            }
            catch {
                return JSON.stringify({
                    error: 'Не удалось скачать карусель. Возможные причины: приватный аккаунт, требуется авторизация или yt-dlp не поддерживает этот тип поста.',
                    hint: 'Попробуйте скопировать ссылку на конкретный слайд или использовать публичный аккаунт.',
                    url,
                });
            }
        }
    }
    if (downloadedFiles.length === 0) {
        return JSON.stringify({
            error: 'Файлы карусели не были скачаны. Проверьте что аккаунт публичный.',
            url,
        });
    }
    // ── Шаг 2: Фильтруем только изображения для коллажа ────────────────────
    const imageFiles = downloadedFiles.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    // Для видео-файлов извлекаем первый кадр как JPG
    const videoFiles = downloadedFiles.filter(f => /\.(mp4|webm)$/i.test(f));
    for (const videoFile of videoFiles) {
        const thumbPath = videoFile.replace(/\.\w+$/, '_thumb.jpg');
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const ffmpegPath = require('ffmpeg-static');
            await execFileAsync(ffmpegPath, [
                '-y', '-i', videoFile,
                '-vframes', '1',
                '-vf', 'scale=768:-1',
                thumbPath,
            ]);
            imageFiles.push(thumbPath);
        }
        catch { /* skip */ }
    }
    const sortedImages = imageFiles.sort();
    console.error(`[AIM] Изображений для коллажа: ${sortedImages.length}`);
    // ── Шаг 3: Склейка в горизонтальную ленту ───────────────────────────────
    const cols = Math.min(sortedImages.length, 10);
    const timecodes = sortedImages.map((_, i) => `#${i + 1}`);
    const cellWidth = Math.min(400, Math.floor(3840 / cols));
    const gridBuffer = await (0, imageGrid_js_1.buildGrid)(sortedImages, timecodes, {
        cols,
        cellWidth,
        outputQuality: 75,
        maxWidth: 2400,
    });
    const collageSuffix = (0, crypto_1.randomUUID)().slice(0, 5);
    const collagePath = outputMdPath
        ? path.join(path.dirname(outputMdPath), `collage_${collageSuffix}.jpg`)
        : path.join(os.tmpdir(), `aim_collage_${collageSuffix}.jpg`);
    fs.writeFileSync(collagePath, gridBuffer);
    console.error(`[AIM] Коллаж сохранен: ${collagePath}`);
    // ── Шаг 4: Формируем ответ ───────────────────────────────────────────────
    const analysisResult = {
        tool: 'aim_analyze_carousel',
        url,
        platform,
        slidesDownloaded: sortedImages.length,
        outputMdPath: outputMdPath ?? null,
        analysisRequest: buildCarouselAnalysisPrompt(url, platform, sortedImages.length, collagePath, outputMdPath),
    };
    // Cleanup временных файлов, оставляем только коллаж
    try {
        fs.rmSync(tmpBase, { recursive: true, force: true });
    }
    catch { /* ignore */ }
    return JSON.stringify(analysisResult, null, 2);
}
function buildCarouselAnalysisPrompt(url, platform, slideCount, collagePath, outputMdPath) {
    return `
Ты — эксперт по контент-маркетингу и психологии продаж в Instagram. Проанализируй карусель.

## ИСХОДНЫЕ ДАННЫЕ:
- Платформа: ${platform}
- Ссылка: ${url}
- Слайдов: ${slideCount}

[ВНИМАНИЕ: Коллаж всех слайдов сохранен локально по пути: ${collagePath}]
Используй инструмент \`view_file\` чтобы прочитать файл \`${collagePath}\`, затем приступай к анализу.

---

Напиши ПОЛНЫЙ аналитический отчёт${outputMdPath ? ` и сохрани его в файл: ${outputMdPath}` : ''}.

## СТРУКТУРА ОТЧЁТА:

---

# 🎠 Разбор карусели: ${platform}

**Источник:** ${url}
**Слайдов:** ${slideCount}
**Дата анализа:** [сегодняшняя дата]

---

## 🪝 СЛАЙД 1 — ХУК

### Что изображено:
[Точное описание первого слайда: текст, визуал, фон, цвета]

### Тип хука:
☐ Вопрос  ☐ Шок/Провокация  ☐ Обещание результата  ☐ Боль/Проблема  ☐ Цифра/Факт  ☐ История

### Почему работает (или почему нет):
[Анализ психологического механизма хука]

### Сила хука: X/10
[Обоснование]

---

## 📊 ПОСЛОВНЫЙ РАЗБОР КАЖДОГО СЛАЙДА

| № | Содержимое | Роль в воронке | Психологический триггер | Эффективность |
|---|-----------|----------------|------------------------|---------------|
| 1 | [текст/визуал] | Хук | [триггер] | ⭐⭐⭐⭐⭐ |
| 2 | [текст/визуал] | [роль] | [триггер] | ⭐⭐⭐⭐ |
[заполни для всех ${slideCount} слайдов]

---

## 🧠 ОБНАРУЖЕННЫЕ ПСИХОЛОГИЧЕСКИЕ ТРИГГЕРЫ

### ✅ Активные триггеры:
- **[Триггер 1]** — Слайд #X: "[точная цитата]" → [как работает]
- **[Триггер 2]** — Слайд #X: [описание] → [механика]

### ❌ Недостающие триггеры (потерянный потенциал):
- **[Триггер]** — куда вставить и как усилит карусель

---

## 💰 АНАЛИЗ ВОРОНКИ ПРОДАЖ/ПОДПИСКИ

**Этап 1 — Внимание (Слайды 1-X):**
[Как захватывает внимание]

**Этап 2 — Интерес (Слайды X-X):**
[Как формируется доверие]

**Этап 3 — Желание (Слайды X-X):**
[Как создаётся желание]

**Этап 4 — Действие (Слайд ${slideCount}):**
[Анализ финального CTA]

**Конверсионный потенциал: X/10**

---

## 📐 СТРУКТУРНЫЙ АРХЕТИП

☐ Открытая петля  ☐ Список-гид  ☐ До/После  ☐ Мифы vs Реальность  ☐ Пошаговый гайд  ☐ Кейс

---

## ⚡ ТОП-5 СЕКРЕТОВ УСПЕХА

1. **[Секрет 1]:** [объяснение]
2. **[Секрет 2]:** [объяснение]
3. **[Секрет 3]:** [объяснение]
4. **[Секрет 4]:** [объяснение]
5. **[Секрет 5]:** [объяснение]

---

## 📈 ОЦЕНКА ВИРАЛЬНОСТИ

| Критерий | Оценка |
|----------|--------|
| Хук | X/10 |
| Визуал | X/10 |
| Ценность | X/10 |
| Триггеры | X/10 |
| CTA | X/10 |
| **ИТОГО** | **XX/50** |
  `.trim();
}
//# sourceMappingURL=analyzeCarousel.js.map