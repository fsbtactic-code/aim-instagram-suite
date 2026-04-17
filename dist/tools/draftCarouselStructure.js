"use strict";
/**
 * AIM Instagram Suite — Tool: aim_draft_carousel_structure
 * Создаёт контентную структуру карусели (JSON воронка).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftCarouselStructureSchema = void 0;
exports.draftCarouselStructure = draftCarouselStructure;
const zod_1 = require("zod");
exports.DraftCarouselStructureSchema = zod_1.z.object({
    topic: zod_1.z.string().describe('Тема карусели (например: "5 способов победить прокрастинацию")'),
    slideCount: zod_1.z.number().min(3).max(15).default(7).describe('Количество слайдов (3-15, рекомендуется 7-10)'),
    toneOfVoice: zod_1.z.enum(['educational', 'motivational', 'professional', 'casual', 'provocative'])
        .default('educational')
        .describe('Тон подачи: educational/motivational/professional/casual/provocative'),
});
function draftCarouselStructure(input) {
    const { topic, slideCount, toneOfVoice } = input;
    const toneDescriptions = {
        educational: 'образовательный — структурированно, с фактами, доверительно',
        motivational: 'мотивационный — вдохновляющий, с призывами, энергичный',
        professional: 'профессиональный — деловой, экспертный, с данными и статистикой',
        casual: 'дружеский — непринуждённый, как разговор с приятелем, с юмором',
        provocative: 'провокационный — спорный, противоречивый, вызывающий реакцию',
    };
    const structureExamples = {
        educational: [
            'Слайд 1: Хук — шокирующий факт или неожиданный вопрос по теме',
            'Слайды 2-N-1: Пронумерованные пункты (совет/шаг/факт + объяснение)',
            'Последний слайд: Итог + призыв к действию (сохрани / подпишись / напиши в комментах)',
        ],
        motivational: [
            'Слайд 1: Хук — боль или признание проблемы ("Ты тоже устал от...")',
            'Слайды 2-3: Агент перемен — почему важно меняться прямо сейчас',
            'Слайды 4-N-1: Конкретные шаги/инсайты (1 на слайд)',
            'Последний слайд: Мощный призыв + энергичный CTA',
        ],
        professional: [
            'Слайд 1: Тезис + данные/статистика для зацепки',
            'Слайды 2-3: Проблема + контекст рынка',
            'Слайды 4-N-1: Решения/фреймворки/методологии',
            'Последний слайд: Вывод + экспертная рекомендация',
        ],
        casual: [
            'Слайд 1: Хук как мем или личная история',
            'Слайды 2-N-1: Советы в разговорном стиле (можно с юмором)',
            'Последний слайд: Неформальный призыв поделиться или обсудить',
        ],
        provocative: [
            'Слайд 1: Провокационный тезис (все думают X, но на самом деле Y)',
            'Слайды 2-3: Разрушение мифа + аргументы',
            'Слайды 4-N-1: Альтернативный взгляд (1 аргумент на слайд)',
            'Последний слайд: Сильная позиция + вопрос аудитории',
        ],
    };
    const result = {
        tool: 'aim_draft_carousel_structure',
        topic,
        slideCount,
        toneOfVoice,
        meta: {
            toneDescription: toneDescriptions[toneOfVoice],
            recommendedStructure: structureExamples[toneOfVoice],
        },
        analysisRequest: `
Ты — эксперт по контенту для Instagram и Telegram. Создай структуру карусели.

## ПАРАМЕТРЫ:
- **Тема:** ${topic}
- **Слайдов:** ${slideCount}
- **Тон:** ${toneDescriptions[toneOfVoice]}

## РЕКОМЕНДУЕМАЯ СТРУКТУРА:
${structureExamples[toneOfVoice].map(s => `- ${s}`).join('\n')}

---

## ЗАДАЧА:
Сгенерируй JSON-объект с массивом slides (ровно ${slideCount} элементов).

Каждый элемент массива ОБЯЗАН содержать:
\`\`\`json
{
  "slideNumber": 1,
  "emoji": "🔥",
  "title": "Заголовок слайда (до 60 символов)",
  "subtitle": "Подзаголовок (до 80 символов, опционально)",
  "body": "Основной текст слайда (до 200 символов). Может быть пустым.",
  "tag": "#тег или краткая дата (опционально)"
}
\`\`\`

## ТРЕБОВАНИЯ:
1. **Слайд 1 — ХУК:** Первые 5 слов заголовка должны захватить внимание мгновенно
2. **Слайды 2-${slideCount - 1}:** Каждый раскрывает одну конкретную идею. Никакой воды.
3. **Слайд ${slideCount} — CTA:** Призыв к действию (сохрани / подпишись / напиши в ответ / отмечай друзей)
4. Текст полностью на **русском языке**
5. Emoji — по смыслу, не случайный
6. Соблюдай тон: **${toneOfVoice}**

После JSON укажи:
- Рекомендуемый вирусный архетип для этой темы
- Рекомендуемую тему дизайна (1-8)
- LSI-слова и ключевые фразы для подписи к посту (не хэштеги — слова для caption)

Верни ТОЛЬКО валидный JSON в формате:
\`\`\`json
{
  "topic": "${topic}",
  "toneOfVoice": "${toneOfVoice}",
  "slides": [...]
}
\`\`\`
    `.trim(),
        quickActions: [
            '→ 1. Отрендерить эту карусель — какую тему дизайна выбрать? (1=Glassmorph 2=Brutalism 3=Minimal 4=Cyber 5=Apple 6=Y2K 7=EdTech)',
            '→ 2. Использовать вирусную структуру как основу (aim_viral_structure)',
            '→ 3. Изменить тон: provocative / motivational / professional / casual',
            '→ 4. Увеличить слайды до 12-14',
            '→ 5. После рендера — оценить виральность (aim_score_carousel_virality)',
        ],
    };
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=draftCarouselStructure.js.map