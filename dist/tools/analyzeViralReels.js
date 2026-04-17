"use strict";
/**
 * AIM VideoLens — Tool: aim_analyze_viral_reels
 * Реверс-инжиниринг вирального контента конкурентов.
 * Пайплайн: yt-dlp → Whisper → Grid → Структурированный .md отчет
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeViralReels = analyzeViralReels;
const mediaProcessor_js_1 = require("../core/mediaProcessor.js");
const ytdlp_js_1 = require("../core/ytdlp.js");
async function analyzeViralReels(input) {
    const { url, outputMdPath } = input;
    // Валидация URL
    if (!url.startsWith('http')) {
        return JSON.stringify({ error: 'Укажите корректный URL (начинается с https://)' });
    }
    const platform = (0, ytdlp_js_1.detectPlatform)(url);
    const media = await (0, mediaProcessor_js_1.processVideo)(url);
    // Формируем данные для Claude с задачей записи отчета
    const result = {
        tool: 'aim_analyze_viral_reels',
        url,
        platform,
        outputMdPath,
        videoTitle: media.downloadInfo?.title ?? 'Без названия',
        videoDuration: media.downloadInfo?.duration ?? 0,
        // TEXT-FIRST
        transcript: {
            language: media.transcript.language,
            segmentCount: media.transcript.segments.length,
            fullText: media.transcriptText,
        },
        // GRID
        visualAnalysis: {
            sceneCount: media.sceneTimecodes.length,
            visualContext: {
                timecodes: media.sceneTimecodes,
                gridImages: media.gridImages.map((base64, index) => ({
                    mimeType: 'image/jpeg',
                    base64,
                    description: `Сетка ключевых кадров видео (часть ${index + 1})`,
                })),
            },
        },
        analysisRequest: `
Ты — аналитик вирального контента. Получи данные о видео с ${platform} и напиши ПОЛНЫЙ структурированный отчёт.

## ТРАНСКРИПТ ВИДЕО:
${media.transcriptText}

## КЛЮЧЕВЫЕ КАДРЫ:
[Смотри прикреплённую сетку кадров]

---

Напиши отчёт в формате Markdown и СОХРАНИ его в файл: ${outputMdPath}

Используй ТОЧНО следующую структуру:

\`\`\`markdown
# 🔥 Отчёт: Разбор вирального ${platform} контента

**Источник:** ${url}
**Платформа:** ${platform}
**Дата анализа:** [дата]

---

## 🪝 1. ХУК (первые 3 секунды)

### Первая фраза:
> [точная цитата первых слов]

### Почему работает:
[2-3 предложения — механика захвата внимания]

### Визуальный крючок:
[описание первого кадра — что бросается в глаза]

---

## ⏱️ 2. РИТМ И ТЕМП МОНТАЖА

| Таймкод | Событие | Почему смена |
|---------|---------|--------------|
| 00:00:00 | Начало | Стартовый кадр |
[заполни таблицу по таймкодам из транскрипта]

**Средний интервал между склейками:** ~X сек  
**Оценка темпа:** Быстрый / Нормальный / Медленный

---

## 📐 3. СТРУКТУРА КОНТЕНТА

| Блок | Таймкод | Функция | Описание |
|------|---------|---------|---------|
| Хук | 00:00-00:03 | Захват | [что происходит] |
| Тело | 00:03-XX:XX | Ценность | [что даёт видео] |
| CTA | XX:XX-конец | Действие | [что просят сделать] |

---

## 💉 4. ЭМОЦИОНАЛЬНЫЕ ТРИГГЕРЫ

- [ ] **Surprise** (удивление): [есть/нет, пример]
- [ ] **FOMO** (страх упустить): [есть/нет, пример]
- [ ] **Социальное доказательство**: [есть/нет, пример]
- [ ] **Юмор**: [есть/нет, пример]
- [ ] **Боль/Проблема**: [есть/нет, пример]
- [ ] **Transformation** (до/после): [есть/нет, пример]

---

## 💡 5. СЕКРЕТ УСПЕХА (1 абзац)
[Главный вывод: ПОЧЕМУ этот контент вирусится. Конкретно и применимо.]

---

## 🎯 6. КАК УКРАСТЬ СТРУКТУРУ

Шаблон для адаптации под любую нишу:

1. **Хук:** [универсальная формула первых слов]
2. **Тело:** [структура основной части]
3. **Развязка:** [формула финала/CTA]
\`\`\`

После того как напишешь отчёт — сохрани его в файл ${outputMdPath} и подтверди сохранение.
`.trim(),
    };
    // Cleanup скачанного видео
    (0, mediaProcessor_js_1.cleanupVideoTemp)(media);
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=analyzeViralReels.js.map