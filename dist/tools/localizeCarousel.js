"use strict";
/**
 * AIM Instagram Suite — Tool: aim_localize_carousel
 * Скачивает чужую карусель → анализирует → помогает создать свою версию.
 * Поддерживает: прямое копирование, локализацию на RU, адаптацию под свою тему.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.localizeCarousel = localizeCarousel;
const analyzeCarousel_js_1 = require("./analyzeCarousel.js");
async function localizeCarousel(input) {
    const { url, mode, targetTopic, slideCount, designTheme, outputDir } = input;
    if (!url.startsWith('http')) {
        return JSON.stringify({ error: 'Укажите корректный URL карусели' });
    }
    // Сначала скачиваем и анализируем оригинал
    const analysisResult = await (0, analyzeCarousel_js_1.analyzeCarousel)({ url });
    const analysis = JSON.parse(analysisResult);
    if (analysis.error) {
        return JSON.stringify(analysis);
    }
    const modeDescriptions = {
        copy: 'Скопировать структуру 1-в-1 (рерайт того же текста с сохранением структуры)',
        localize: 'Локализовать на русский язык (перевод + адаптация под RU менталитет)',
        adapt: `Адаптировать под новую тему: "${targetTopic ?? 'не указана'}"`,
    };
    const result = {
        tool: 'aim_localize_carousel',
        url,
        mode,
        modeDescription: modeDescriptions[mode],
        targetTopic: targetTopic ?? null,
        originalSlides: analysis.slidesDownloaded,
        requestedSlides: slideCount ?? analysis.slidesDownloaded,
        designTheme: designTheme ?? 1,
        outputDir: outputDir ?? null,
        // Передаём коллаж оригинала для Claude
        originalCollage: analysis.collage,
        analysisRequest: buildLocalizePrompt(mode, targetTopic, slideCount ?? analysis.slidesDownloaded, designTheme, outputDir, analysis),
    };
    return JSON.stringify(result, null, 2);
}
function buildLocalizePrompt(mode, targetTopic, slideCount, designTheme, outputDir, originalAnalysis) {
    const modeInstructions = {
        copy: `
## РЕЖИМ: КОПИРОВАНИЕ СТРУКТУРЫ (Рерайт)

Твоя задача — создать JSON со структурой новой карусели, которая:
1. Полностью копирует СТРУКТУРУ оригинала (тот же порядок слайдов, те же триггеры)
2. Содержит ДРУГОЙ текст (рерайт, не копипаст)
3. Сохраняет тот же тон и стиль подачи
4. НЕ изменяет тему — просто перефразирует

Это законно и этично — структура не охраняется авторским правом.
    `,
        localize: `
## РЕЖИМ: ЛОКАЛИЗАЦИЯ НА РУССКИЙ ЯЗЫК

Твоя задача — адаптировать карусель под русскоязычную аудиторию:
1. Переведи весь текст на живой русский язык (не гугл-переводчик)
2. Адаптируй культурные отсылки и примеры под РФ/СНГ
3. Сохрани структуру и психологические триггеры
4. При необходимости — адаптируй цифры/примеры под российские реалии
5. Тон сохрани максимально близко к оригиналу
    `,
        adapt: `
## РЕЖИМ: АДАПТАЦИЯ ПОД НОВУЮ ТЕМУ

Новая тема: **"${targetTopic}"**

Твоя задача:
1. Возьми СТРУКТУРУ оригинала (порядок слайдов, роли, триггеры)
2. Полностью замени КОНТЕНТ под тему "${targetTopic}"
3. Сохрани те же психологические механизмы и хук
4. Адаптируй CTA под новую нишу
5. Результат должен быть неотличим по формату, но совершенно другим по содержанию
    `,
    };
    return `
Ты — эксперт по контент-ремаркетингу и стратег вирального контента.

## ОРИГИНАЛЬНАЯ КАРУСЕЛЬ:
[Смотри прикреплённый коллаж — все слайды оригинала]

${modeInstructions[mode]}

---

## ЗАДАЧА: СОЗДАЙ JSON ДЛЯ НОВОЙ КАРУСЕЛИ

Верни ВАЛИДНЫЙ JSON следующей структуры (ровно ${slideCount} слайдов):

\`\`\`json
{
  "mode": "${mode}",
  "originalUrl": "${originalAnalysis.url ?? ''}",
  "newTopic": "${targetTopic ?? 'оригинальная тема'}",
  "slides": [
    {
      "slideNumber": 1,
      "emoji": "🔥",
      "title": "Заголовок (до 60 символов)",
      "subtitle": "Подзаголовок (до 80 символов)",
      "body": "Основной текст (до 200 символов)",
      "tag": "#тег или метка"
    }
  ]
}
\`\`\`

## ТРЕБОВАНИЯ К СЛАЙДАМ:

### СЛАЙД 1 (ХУК) — КРИТИЧЕСКИ ВАЖЕН:
- Должен захватить внимание за 0.5 секунды
- Используй тот же тип хука что в оригинале, но ${mode === 'copy' ? 'в других словах' : mode === 'localize' ? 'на русском языке' : `под тему "${targetTopic}"`}
- Максимум 7 слов в заголовке

### СЛАЙДЫ 2-${slideCount - 1} (ТЕЛО):
- Каждый слайд = одна идея
- Конкретно, без воды
- Сохраняй тот же темп и ритм что в оригинале

### СЛАЙД ${slideCount} (CTA):
- Конкретный призыв к действию
- Формат: "Сохрани" / "Напиши X в комментах" / "Перешли" — выбери самый подходящий

${outputDir ? `
## ПОСЛЕ СОЗДАНИЯ JSON:

Автоматически запусти aim_render_premium_carousel с параметрами:
- slidesData: [JSON из выше]
- theme: ${designTheme ?? 1}
- format: "square"
- outputDir: "${outputDir}"

И сообщи пути к сохранённым PNG-файлам.
` : ''}

${mode === 'localize' ? `
## ДОПОЛНИТЕЛЬНО ДЛЯ LOCALIZE-РЕЖИМА:

После JSON добавь таблицу сравнения:
| Слайд | Оригинал (EN) | Локализация (RU) | Изменения |
|-------|--------------|-----------------|-----------|
| 1 | [оригинал] | [перевод] | [что адаптировано] |
...
` : ''}

${mode === 'adapt' ? `
## ДОПОЛНИТЕЛЬНО ДЛЯ ADAPT-РЕЖИМА:

После JSON объясни в 3-5 предложениях:
- Как ты сохранил структуру оригинала
- Какие триггеры перенёс и почему они работают для "${targetTopic}"
- Что изменил и почему это лучше для новой аудитории
` : ''}
  `.trim();
}
//# sourceMappingURL=localizeCarousel.js.map