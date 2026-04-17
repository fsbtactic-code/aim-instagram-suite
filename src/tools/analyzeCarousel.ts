/**
 * AIM Instagram Suite — Tool: aim_analyze_carousel
 * Разбор Instagram-карусели: скачать → коллаж-лента → анализ воронки и триггеров.
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { randomUUID } from 'crypto';
import { downloadVideo, detectPlatform } from '../core/ytdlp.js';
import { buildGrid, gridToBase64 } from '../core/imageGrid.js';

export interface AnalyzeCarouselInput {
  url: string;
  outputMdPath?: string;
}

export async function analyzeCarousel(input: AnalyzeCarouselInput): Promise<string> {
  const { url, outputMdPath } = input;

  if (!url.startsWith('http')) {
    return JSON.stringify({ error: 'Укажите корректный URL поста-карусели' });
  }

  const platform = detectPlatform(url);
  const tmpBase = path.join(os.tmpdir(), `aim_carousel_${randomUUID()}`);
  fs.mkdirSync(tmpBase, { recursive: true });

  // ── Шаг 1: Скачиваем все медиа из поста ─────────────────────────────────
  // yt-dlp скачивает карусель как отдельные файлы с суффиксом _1, _2, ...
  const { execFile } = await import('child_process');
  const { promisify } = await import('util');
  const execFileAsync = promisify(execFile);

  // Путь к yt-dlp бинарнику
  const BIN_DIR = path.join(path.resolve(), 'bin');
  const isWindows = os.platform() === 'win32';
  const YTDLP_BINARY = path.join(BIN_DIR, isWindows ? 'yt-dlp.exe' : 'yt-dlp');
  const ytdlpBin = fs.existsSync(YTDLP_BINARY) ? YTDLP_BINARY : (isWindows ? 'yt-dlp.exe' : 'yt-dlp');

  console.error('[AIM] Скачиваем карусель:', url);

  let downloadedFiles: string[] = [];

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
    } catch (e) {
      console.warn('[AIM] External API failed, falling back to local yt-dlp:', e.message);
    }
  }

  // Fallback to yt-dlp if it's not instagram or external scraper failed
  if (downloadedFiles.length === 0) {
    try {
      // Скачиваем все слайды карусели
      await execFileAsync(ytdlpBin, [
        url,
        '-o', path.join(tmpBase, 'slide_%(playlist_index)s.%(ext)s'),
        '--no-playlist',
        '--write-thumbnail',
        '--convert-thumbnails', 'jpg',
        '--quiet',
      ], { maxBuffer: 20 * 1024 * 1024 });

      // Собираем все скачанные файлы (изображения и видео)
      downloadedFiles = fs.readdirSync(tmpBase)
        .filter(f => /\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(f))
        .sort()
        .map(f => path.join(tmpBase, f));

      console.error(`[AIM] Скачано файлов (yt-dlp): ${downloadedFiles.length}`);
    } catch (e) {
      console.error('[AIM] Ошибка скачивания (yt-dlp):', e.message);

    // Fallback: пробуем просто скачать как видео/фото
    try {
      await execFileAsync(ytdlpBin, [
        url,
        '-o', path.join(tmpBase, 'media.%(ext)s'),
        '--quiet',
      ], { maxBuffer: 20 * 1024 * 1024 });

      downloadedFiles = fs.readdirSync(tmpBase)
        .filter(f => /\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(f))
        .map(f => path.join(tmpBase, f));
    } catch {
      return JSON.stringify({
        error: 'Не удалось скачать карусель. Возможные причины: приватный аккаунт, требуется авторизация или yt-dlp не поддерживает этот тип поста.',
        hint: 'Попробуйте скопировать ссылку на конкретный слайд или использовать публичный аккаунт.',
        url,
      });
    }
  }

  if (downloadedFiles.length === 0) {
    return JSON.stringify({
      error: 'Файлы карусели не были скачаны. Проверьте что аккаунт публичный.',
      url,
    });
  }

  // ── Шаг 2: Фильтруем только изображения для коллажа ────────────────────
  // Для видео-слайдов берём первый кадр через FFmpeg (если есть)
  const imageFiles: string[] = downloadedFiles.filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  // Для видео-файлов извлекаем первый кадр как JPG
  const videoFiles = downloadedFiles.filter(f => /\.(mp4|webm)$/i.test(f));
  for (const videoFile of videoFiles) {
    const thumbPath = videoFile.replace(/\.\w+$/, '_thumb.jpg');
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpegPath: string = require('ffmpeg-static');
      await execFileAsync(ffmpegPath, [
        '-y', '-i', videoFile,
        '-vframes', '1',
        '-vf', 'scale=768:-1',
        thumbPath,
      ]);
      imageFiles.push(thumbPath);
    } catch { /* skip */ }
  }

  const sortedImages = imageFiles.sort();
  console.error(`[AIM] Изображений для коллажа: ${sortedImages.length}`);

  // ── Шаг 3: Склейка в горизонтальную ленту (все слайды в одной картинке) ─
  // Используем cols=slideCount чтобы все слайды были в одну строку (полоса)
  const cols = Math.min(sortedImages.length, 10); // максимум 10 в ряд
  const timecodes = sortedImages.map((_, i) => `#${i + 1}`);

  const gridBuffer = await buildGrid(sortedImages, timecodes, {
    cols,
    cellWidth: Math.min(400, Math.floor(3840 / cols)), // адаптивная ширина ячейки
    outputQuality: 75,
    maxWidth: 2400, // широкий коллаж для каруселей
  });
  const gridBase64 = gridToBase64(gridBuffer);

  console.error(`[AIM] Коллаж создан: ${Math.round(gridBase64.length / 1024)}KB`);

  // ── Шаг 4: Формируем запрос к Claude ────────────────────────────────────
  const result = {
    tool: 'aim_analyze_carousel',
    url,
    platform,
    slidesDownloaded: sortedImages.length,
    outputMdPath: outputMdPath ?? null,

    collage: {
      mimeType: 'image/jpeg',
      base64: gridBase64,
      description: `Коллаж всех ${sortedImages.length} слайдов карусели из ${platform}`,
    },

    analysisRequest: buildCarouselAnalysisPrompt(url, platform, sortedImages.length, outputMdPath),
  };

  // Cleanup
  try { fs.rmSync(tmpBase, { recursive: true, force: true }); } catch { /* ignore */ }

  return JSON.stringify(result, null, 2);
}

function buildCarouselAnalysisPrompt(
  url: string,
  platform: string,
  slideCount: number,
  outputMdPath?: string,
): string {
  return `
Ты — эксперт по контент-маркетингу и психологии продаж в Instagram. Проанализируй карусель.

## ИСХОДНЫЕ ДАННЫЕ:
- Платформа: ${platform}
- Ссылка: ${url}
- Слайдов: ${slideCount}

[Смотри прикреплённый коллаж — все ${slideCount} слайдов в одном изображении, слева направо]

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

Для каждого триггера укажи на каком слайде он используется:

### ✅ Активные триггеры:
- **[Триггер 1]** — Слайд #X: "[точная цитата или описание]" → [как работает]
- **[Триггер 2]** — Слайд #X: [описание] → [механика]
[...]

### ❌ Недостающие триггеры (потерянный потенциал):
- **[Триггер который мог бы быть]** — куда вставить и как это усилило бы карусель

---

## 💰 АНАЛИЗ ВОРОНКИ ПРОДАЖ/ПОДПИСКИ

Как карусель ведёт пользователя:

**Этап 1 — Внимание (Слайды 1-X):**
[Как контент захватывает внимание и удерживает на первых слайдах]

**Этап 2 — Интерес (Слайды X-X):**
[Как формируется доверие и интерес]

**Этап 3 — Желание (Слайды X-X):**
[Как создаётся желание получить результат]

**Этап 4 — Действие (Слайд ${slideCount}):**
[Анализ финального CTA — что просят сделать и насколько это конвертирует]

**Конверсионный потенциал воронки: X/10**

---

## 🎨 ДИЗАЙН И ВИЗУАЛЬНЫЙ СТИЛЬ

### Единый стиль:
- Цветовая палитра: [основные цвета]
- Шрифты: [название/стиль]
- Компоновка текста: [как расположен текст]
- Брендинг: [есть ли логотип/фирменный стиль]

### Читаемость и UX:
- Размер шрифта: [достаточный / слишком мелкий / слишком крупный]
- Контраст: [хороший / нужно улучшить]
- Перегруженность: [есть ли слайды с избытком элементов]

### Оценка дизайна: X/10

---

## 📐 СТРУКТУРНЫЙ АРХЕТИП

Эта карусель соответствует архетипу:
☐ Открытая петля (Open Loop)
☐ Список-гид (Listicle)
☐ До/После (Before/After)
☐ Развенчание мифов (Myth Busting)
☐ Пошаговый гайд (Tutorial)
☐ Кейс/История (Case Study)
☐ Воронка продаж (Sales Funnel)
☐ Другой: [описание]

**Почему этот архетип работает для данной ниши:** [объяснение]

---

## ⚡ ТОП-5 СЕКРЕТОВ УСПЕХА

(Что конкретно делает эту карусель эффективной)

1. **[Секрет 1]:** [детальное объяснение]
2. **[Секрет 2]:** [детальное объяснение]
3. **[Секрет 3]:** [детальное объяснение]
4. **[Секрет 4]:** [детальное объяснение]
5. **[Секрет 5]:** [детальное объяснение]

---

## 🎯 ШАБЛОН ДЛЯ КРАЖИ СТРУКТУРЫ

Универсальная формула этой карусели, применимая к ЛЮБОЙ нише:

| Слайд | Формула | Психологический механизм |
|-------|---------|--------------------------|
| 1 | [формула хука] | [механизм] |
| 2-X | [формула тела] | [механизм] |
| ${slideCount} | [формула CTA] | [механизм] |

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

**Вирусный потенциал: [Высокий / Средний / Низкий]**
**Причина:** [главный фактор]
  `.trim();
}
