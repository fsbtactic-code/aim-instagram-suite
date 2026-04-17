"use strict";
/**
 * AIM Instagram Suite — Core: Viral Structures
 * 5 доказанных вирусных структур каруселей (до 20 слайдов).
 * Используются как шаблоны для генерации контента.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIRAL_STRUCTURES = void 0;
exports.getViralStructure = getViralStructure;
exports.listViralStructures = listViralStructures;
exports.structureToSlides = structureToSlides;
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 1: "Открытая петля" (Open Loop)
// Нарратив с нарастающим напряжением — зритель листает до конца ради развязки
// ─────────────────────────────────────────────────────────────────────────────
const openLoopStructure = {
    id: 'open-loop',
    name: 'Открытая петля (Open Loop)',
    description: 'Интригующий нарратив с развязкой в конце. Зритель не может остановить листание.',
    targetAudience: 'Образование, личный бренд, эксперты, личные истории',
    engagementMechanic: 'FOMO + незавершённость (эффект Зейгарник)',
    optimalSlideCount: 10,
    slides: [
        {
            position: 1,
            role: 'ХУК — Незакрытый вопрос',
            trigger: 'Curiosity Gap / Информационный разрыв',
            titleFormula: '[Я сделал X] — и вот что произошло.',
            bodyFormula: 'Листай до конца — расскажу всё без прикрас.',
            emoji: '🔐',
        },
        {
            position: 2,
            role: 'Контекст — Точка А',
            trigger: 'Идентификация / "Это про меня"',
            titleFormula: 'Сначала всё было [негативное состояние].',
            bodyFormula: 'Я был [описание проблемы]. Казалось, выхода нет.',
            emoji: '😔',
        },
        {
            position: 3,
            role: 'Поворот — Катализатор',
            trigger: 'Surprise / Неожиданность',
            titleFormula: 'Потом произошло кое-что странное.',
            bodyFormula: '[Конкретное событие / инсайт / встреча], которые всё изменили.',
            emoji: '⚡',
        },
        {
            position: 4,
            role: 'Путь — Шаг 1',
            trigger: 'Полезность / Value',
            titleFormula: 'Первое что я изменил: [конкретное действие].',
            bodyFormula: 'Результат: [измеримый результат] за [срок].',
            emoji: '1️⃣',
        },
        {
            position: 5,
            role: 'Путь — Шаг 2',
            trigger: 'Momentum / Нарастание',
            titleFormula: 'Потом я понял про [второй инсайт].',
            bodyFormula: 'Это казалось контринтуитивным, но [объяснение почему работает].',
            emoji: '2️⃣',
        },
        {
            position: 6,
            role: 'Путь — Шаг 3',
            trigger: 'Confirmation Bias / Подтверждение',
            titleFormula: 'Третья вещь оказалась самой важной.',
            bodyFormula: '[Инсайт №3]. Именно это дало [результат].',
            emoji: '3️⃣',
        },
        {
            position: 7,
            role: 'Кризис — Момент сомнения',
            trigger: 'Drama / Эмоциональный пик',
            titleFormula: 'Но потом всё чуть не рухнуло.',
            bodyFormula: '[Препятствие / провал / кризис]. Я почти сдался.',
            emoji: '💥',
        },
        {
            position: 8,
            role: 'Прорыв — Точка Б',
            trigger: 'Transformation / Трансформация',
            titleFormula: 'А потом — прорыв.',
            bodyFormula: '[Конкретный результат]. Цифры / факты / доказательства.',
            emoji: '🚀',
        },
        {
            position: 9,
            role: 'Урок — Главный вывод',
            trigger: 'Wisdom / Мудрость',
            titleFormula: 'Главное что я понял за это время:',
            bodyFormula: '[Универсальный принцип, применимый к аудитории].',
            emoji: '💡',
        },
        {
            position: 10,
            role: 'CTA — Закрытие петли',
            trigger: 'Community / Принадлежность',
            titleFormula: 'Ты на той же дороге?',
            bodyFormula: 'Сохрани карусель — вернёшься когда понадобится.',
            emoji: '🔖',
            cta: 'Напиши в комментах: ты на каком шаге сейчас?',
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 2: "Список-Гид" (Listicle Guide)
// Numbered tips — максимально shareble и saveable
// ─────────────────────────────────────────────────────────────────────────────
const listicleStructure = {
    id: 'listicle',
    name: 'Список-Гид (Numbered Listicle)',
    description: 'Пронумерованные советы. Максимально сохраняемый формат.',
    targetAudience: 'Любая ниша: бизнес, здоровье, SMM, финансы, психология',
    engagementMechanic: 'Save-trigger + Полнота (FOMO пропустить совет)',
    optimalSlideCount: 9,
    slides: [
        {
            position: 1,
            role: 'ХУК — Обещание ценности',
            trigger: 'Curiosity + FOMO',
            titleFormula: '[N] [вещей/правил/секретов], которые я бы узнал раньше.',
            bodyFormula: 'Листай до слайда [N] — там самый важный.',
            emoji: '📋',
        },
        {
            position: 2,
            role: 'Совет 1 — Самый неожиданный',
            trigger: 'Surprise / Counter-intuitive',
            titleFormula: '1. [Контринтуитивный совет]',
            bodyFormula: 'Большинство делает [стандартно]. Но [объяснение почему неправильно]. Вместо этого: [правильный подход].',
            emoji: '💡',
        },
        {
            position: 3,
            role: 'Совет 2 — Практический',
            trigger: 'Utility / Полезность',
            titleFormula: '2. [Конкретное действие с результатом]',
            bodyFormula: '[Инструкция в 1-2 предложения]. Результат: [что получишь].',
            emoji: '⚡',
        },
        {
            position: 4,
            role: 'Совет 3 — С доказательством',
            trigger: 'Social Proof / Авторитет',
            titleFormula: '3. [Совет со ссылкой на данные/опыт]',
            bodyFormula: '[Цифра/факт/исследование]. Это значит [практический вывод].',
            emoji: '📊',
        },
        {
            position: 5,
            role: 'Совет 4 — Психологический',
            trigger: 'Resonance / Глубокое попадание',
            titleFormula: '4. [Принцип изменения мышления]',
            bodyFormula: 'Когда ты начинаешь думать [по-новому], всё меняется. Потому что [объяснение].',
            emoji: '🧠',
        },
        {
            position: 6,
            role: 'Совет 5 — Быстрый вин',
            trigger: 'Quick Win / Немедленная польза',
            titleFormula: '5. Это займёт 5 минут, но изменит [сферу].',
            bodyFormula: '[Конкретный mini-hack]. Сделай прямо сегодня.',
            emoji: '⏱️',
        },
        {
            position: 7,
            role: 'Совет 6 — Долгосрочный',
            trigger: 'Investment / Инвестиция в себя',
            titleFormula: '6. [Привычка/система на которую нужно время]',
            bodyFormula: 'Через [срок] ты [результат]. Большинство не делает это, потому что [причина].',
            emoji: '🌱',
        },
        {
            position: 8,
            role: 'Совет N — "Золотой" (самый важный)',
            trigger: 'Anticipation / Ожидание',
            titleFormula: '[N]. ← Этого я ждал больше всего.',
            bodyFormula: '[Главный инсайт]. Запомни: [афоризм / запоминаемая формула].',
            emoji: '🔥',
        },
        {
            position: 9,
            role: 'CTA — Сохрани и поделись',
            trigger: 'Reciprocity / Взаимность',
            titleFormula: 'Сохрани — вернёшься когда нужно.',
            bodyFormula: 'Отправь другу который [проблема из хука]. Ему это нужно.',
            emoji: '🔖',
            cta: 'Какой пункт твой любимый? Напиши цифру в комментах 👇',
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 3: "Прежде/После + Система" (Before/After + System)
// Трансформационная история с конкретным фреймворком
// ─────────────────────────────────────────────────────────────────────────────
const beforeAfterStructure = {
    id: 'before-after',
    name: 'До/После + Система (Transformation Framework)',
    description: 'Трансформация + конкретная система. Максимальное доверие и желание купить.',
    targetAudience: 'Коучинг, курсы, health&fitness, продуктивность, финансы',
    engagementMechanic: 'Aspiration + Proof + Система = максимальные продажи',
    optimalSlideCount: 12,
    slides: [
        {
            position: 1,
            role: 'ХУК — Результат до/после',
            trigger: 'Social Proof + Aspiration',
            titleFormula: 'За [срок] я [измеримый результат]. Вот как.',
            bodyFormula: 'Без [распространённого заблуждения]. Только [уникальный метод].',
            emoji: '📈',
        },
        {
            position: 2,
            role: 'Боль — Точка А',
            trigger: 'Empathy / Сопереживание',
            titleFormula: 'Раньше я [болезненная проблема].',
            bodyFormula: '[Детальное описание боли на языке аудитории]. Звучит знакомо?',
            emoji: '😤',
        },
        {
            position: 3,
            role: 'Провалившиеся попытки',
            trigger: 'Identification + Frustration Release',
            titleFormula: 'Я пробовал [стандартные решения]. Не работало.',
            bodyFormula: '[Перечисление 2-3 провалов]. Тратил деньги/время впустую.',
            emoji: '❌',
        },
        {
            position: 4,
            role: 'Открытие — Новый фрейм',
            trigger: 'Revelation / Открытие',
            titleFormula: 'Потом я понял: проблема не в [следствие], а в [причина].',
            bodyFormula: 'Это изменило всё. Вот почему стандартные методы не работают.',
            emoji: '🔍',
        },
        {
            position: 5,
            role: 'Система — Обзор',
            trigger: 'Structure / Надёжность',
            titleFormula: 'Я разработал систему из [N] шагов.',
            bodyFormula: 'Называю её [название метода]. Объясняю дальше.',
            emoji: '🏗️',
        },
        {
            position: 6,
            role: 'Шаг 1 системы',
            trigger: 'Utility',
            titleFormula: '[Шаг 1]: [Название действия]',
            bodyFormula: 'Что делать: [конкретно]. Зачем: [механика]. Пример: [мой пример].',
            emoji: '1️⃣',
        },
        {
            position: 7,
            role: 'Шаг 2 системы',
            trigger: 'Momentum',
            titleFormula: '[Шаг 2]: [Название действия]',
            bodyFormula: 'Что делать: [конкретно]. Частая ошибка здесь: [ошибка].',
            emoji: '2️⃣',
        },
        {
            position: 8,
            role: 'Шаг 3 системы',
            trigger: 'Climax',
            titleFormula: '[Шаг 3]: [Самый важный шаг]',
            bodyFormula: 'Именно здесь большинство сдаётся. Но если ты [действие] — [результат].',
            emoji: '3️⃣',
        },
        {
            position: 9,
            role: 'Результат — Точка Б',
            trigger: 'Proof / Доказательство',
            titleFormula: 'Через [срок] я получил: [список результатов].',
            bodyFormula: '[Конкретные цифры]. [Что изменилось в жизни/бизнесе].',
            emoji: '✅',
        },
        {
            position: 10,
            role: 'Другие результаты (Social Proof)',
            trigger: 'Bandwagon / Стадный инстинкт',
            titleFormula: 'Потом эту систему применили [N] человек.',
            bodyFormula: '[Краткий результат клиента 1]. [Краткий результат клиента 2].',
            emoji: '👥',
        },
        {
            position: 11,
            role: 'Возражение — Это не для меня?',
            trigger: 'Objection Handling',
            titleFormula: '"А вдруг у меня не получится?" — Вот мой ответ.',
            bodyFormula: 'Это работает даже если [возражение]. Потому что [опровержение].',
            emoji: '🛡️',
        },
        {
            position: 12,
            role: 'CTA — Призыв к действию',
            trigger: 'Urgency + Community',
            titleFormula: 'Хочешь тот же результат?',
            bodyFormula: 'Начни с шага 1 прямо сегодня. Напиши в комментах "СИСТЕМА" — пришлю детальный гайд.',
            emoji: '🚀',
            cta: '👇 Напиши "СИСТЕМА" в комментах',
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 4: "Мифы vs Реальность" (Myth Busting)
// Провокационный разрыв ожиданий — максимальный охват через холодную аудиторию
// ─────────────────────────────────────────────────────────────────────────────
const mythBustingStructure = {
    id: 'myth-busting',
    name: 'Мифы против Реальности (Myth Busting)',
    description: 'Разрушение популярных заблуждений. Провоцирует дискуссию и охват через share.',
    targetAudience: 'Эксперты, ниши с устоявшимися мифами: диеты, бизнес, SMM, финансы',
    engagementMechanic: 'Dissonance + Controversy = максимальный охват',
    optimalSlideCount: 11,
    slides: [
        {
            position: 1,
            role: 'ХУК — Провокационный тезис',
            trigger: 'Dissonance / Когнитивный диссонанс',
            titleFormula: 'Всё что ты знаешь о [теме] — неправда.',
            bodyFormula: 'Я разобью [N] самых популярных мифов с доказательствами.',
            emoji: '💣',
        },
        {
            position: 2,
            role: 'Предисловие — Почему важно',
            trigger: 'Authority / Авторитет',
            titleFormula: 'Я изучил [количество источников/лет опыта]. Вот что выяснилось.',
            bodyFormula: 'Эти мифы стоят людям [конкретная цена: деньги/время/здоровье].',
            emoji: '🔬',
        },
        {
            position: 3,
            role: 'МИФ 1 — Самый популярный',
            trigger: 'Confirmation Bias破坏',
            titleFormula: 'МИФ 1: "[Цитата популярного мифа]"',
            bodyFormula: 'Почему это неправда: [объяснение с фактом/исследованием].',
            emoji: '❌',
        },
        {
            position: 4,
            role: 'ПРАВДА 1',
            trigger: 'Revelation',
            titleFormula: 'РЕАЛЬНОСТЬ: [Правда вместо мифа]',
            bodyFormula: 'На самом деле [правдивый факт]. [Как это применить практически].',
            emoji: '✅',
        },
        {
            position: 5,
            role: 'МИФ 2',
            trigger: 'Momentum',
            titleFormula: 'МИФ 2: "[Второй популярный миф]"',
            bodyFormula: 'Откуда этот миф взялся: [история/источник]. Почему неверно: [факт].',
            emoji: '❌',
        },
        {
            position: 6,
            role: 'ПРАВДА 2',
            trigger: 'Utility',
            titleFormula: 'РЕАЛЬНОСТЬ: [Правда]',
            bodyFormula: '[Правдивый факт + практическое применение].',
            emoji: '✅',
        },
        {
            position: 7,
            role: 'МИФ 3 — Самый опасный',
            trigger: 'Fear / Защита',
            titleFormula: 'МИФ 3 — самый опасный: "[Третий миф]"',
            bodyFormula: 'Из-за него люди [конкретный вред]. Вот почему.',
            emoji: '⚠️',
        },
        {
            position: 8,
            role: 'ПРАВДА 3',
            trigger: 'Relief / Облегчение',
            titleFormula: 'РЕАЛЬНОСТЬ: [Успокаивающая правда]',
            bodyFormula: 'Хорошая новость: [правдивое и позитивное]. Вот что делать вместо.',
            emoji: '✅',
        },
        {
            position: 9,
            role: 'МИФ 4 (опц.)',
            trigger: 'Completion Drive',
            titleFormula: 'МИФ 4: "[Четвертый миф]"',
            bodyFormula: '[Краткое опровержение с фактом].',
            emoji: '❌',
        },
        {
            position: 10,
            role: 'Главный вывод',
            trigger: 'Wisdom + Trust',
            titleFormula: 'Почему эти мифы так живучи?',
            bodyFormula: 'Потому что [системная причина: маркетинг, невежество, традиция]. Теперь ты знаешь правду.',
            emoji: '🧩',
        },
        {
            position: 11,
            role: 'CTA — Провокация',
            trigger: 'Social Identity + Controversy',
            titleFormula: 'Согласен? Или есть что возразить?',
            bodyFormula: 'Сохрани и отправь тому, кто верит в эти мифы.',
            emoji: '🔥',
            cta: '👇 Напиши в комментах какой миф тебя удивил больше всего',
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 5: "Пошаговый Гайд" (Step-by-Step Tutorial)
// Максимально практичный формат — людей спасают и они возвращаются
// ─────────────────────────────────────────────────────────────────────────────
const stepByStepStructure = {
    id: 'step-by-step',
    name: 'Пошаговый Гайд (Step-by-Step Tutorial)',
    description: 'Полная инструкция с нуля. Максимальное время сессии и возвраты.',
    targetAudience: 'Обучение, DIY, технологии, рецепты, процессы',
    engagementMechanic: 'Completeness Drive + Save Mechanic',
    optimalSlideCount: 14,
    slides: [
        {
            position: 1,
            role: 'ХУК — Конечный результат',
            trigger: 'Aspiration + Simplicity Promise',
            titleFormula: 'Как сделать [результат] за [конкретный срок]. Полный гайд.',
            bodyFormula: 'Шаг за шагом — от нуля до результата. Сохрани, чтобы не потерять.',
            emoji: '🗺️',
        },
        {
            position: 2,
            role: 'Что нужно подготовить',
            trigger: 'Preparation / Вовлечение',
            titleFormula: 'Что понадобится: краткий список.',
            bodyFormula: '[1. Инструмент/ресурс 1]\n[2. Инструмент/ресурс 2]\n[3. Что НЕ нужно — развенчание страха].',
            emoji: '📦',
        },
        {
            position: 3,
            role: 'Шаг 1',
            trigger: 'Quick Win',
            titleFormula: 'Шаг 1: [Простое действие]',
            bodyFormula: '[Конкретная инструкция]. ⏱ Займёт: [время]. Результат: [мини-результат].',
            emoji: '1️⃣',
        },
        {
            position: 4,
            role: 'Шаг 2',
            trigger: 'Momentum',
            titleFormula: 'Шаг 2: [Следующее действие]',
            bodyFormula: '[Конкретная инструкция]. ⚠️ Частая ошибка: [ошибка]. Как избежать: [решение].',
            emoji: '2️⃣',
        },
        {
            position: 5,
            role: 'Шаг 3',
            trigger: 'Depth',
            titleFormula: 'Шаг 3: [Более сложное действие]',
            bodyFormula: '[Инструкция]. 💡 Профессиональный трюк: [секрет].',
            emoji: '3️⃣',
        },
        {
            position: 6,
            role: 'Шаг 4',
            trigger: 'Value Stacking',
            titleFormula: 'Шаг 4: [Действие]',
            bodyFormula: '[Инструкция]. Почему именно так: [логическое объяснение].',
            emoji: '4️⃣',
        },
        {
            position: 7,
            role: 'Шаг 5 — Критический',
            trigger: 'Anticipation',
            titleFormula: 'Шаг 5 — самый важный (большинство пропускает).',
            bodyFormula: '[Инструкция для критического шага]. Без этого [последствие].',
            emoji: '⚡',
        },
        {
            position: 8,
            role: 'Шаг 6',
            trigger: 'Progress',
            titleFormula: 'Шаг 6: [Действие]',
            bodyFormula: '[Инструкция]. Ты уже на полпути — продолжай!',
            emoji: '6️⃣',
        },
        {
            position: 9,
            role: 'Шаг 7',
            trigger: 'Routine Building',
            titleFormula: 'Шаг 7: [Действие]',
            bodyFormula: '[Инструкция]. Когда привыкнешь — это займёт [меньше времени].',
            emoji: '7️⃣',
        },
        {
            position: 10,
            role: 'Финальный шаг',
            trigger: 'Completion',
            titleFormula: 'Последний шаг: [Завершающее действие]',
            bodyFormula: '[Инструкция]. Готово! Ты получишь [конкретный результат].',
            emoji: '🏁',
        },
        {
            position: 11,
            role: 'Частые ошибки',
            trigger: 'Protection / Забота',
            titleFormula: 'Топ-3 ошибки — не делай этого.',
            bodyFormula: '❌ [Ошибка 1]\n❌ [Ошибка 2]\n❌ [Ошибка 3]\nЕсли всё же столкнулся — [что делать].',
            emoji: '🚫',
        },
        {
            position: 12,
            role: 'Лайфхаки и ускорение',
            trigger: 'Bonus / Превышение ожиданий',
            titleFormula: 'Бонус: 3 лайфхака чтобы делать это быстрее.',
            bodyFormula: '💡 [Лайфхак 1]\n💡 [Лайфхак 2]\n💡 [Лайфхак 3]',
            emoji: '🎁',
        },
        {
            position: 13,
            role: 'Ожидаемые результаты',
            trigger: 'Expectation Setting',
            titleFormula: 'Что ожидать: реалистичный прогноз.',
            bodyFormula: 'Через [срок 1]: [мини-результат]\nЧерез [срок 2]: [средний результат]\nЧерез [срок 3]: [большой результат]',
            emoji: '📈',
        },
        {
            position: 14,
            role: 'CTA — Сохрани и начни',
            trigger: 'Action + Community',
            titleFormula: 'Начни прямо сейчас. Шаг 1 займёт 5 минут.',
            bodyFormula: 'Сохрани гайд — вернёшься к нему. Поделись с тем, кому это нужно.',
            emoji: '🔖',
            cta: '👇 Напиши в комментах на каком шаге застряли раньше — помогу',
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 6: "Разбор Кейса" (Case Study)
// ─────────────────────────────────────────────────────────────────────────────
const caseStudyStructure = {
    id: 'case-study',
    name: 'Разбор Кейса (Case Study)',
    description: 'Реальный результат клиента/свой опыт с цифрами. Убивает возражения через proof.',
    targetAudience: 'Фрилансеры, агентства, коучи, B2B, эксперты с портфолио',
    engagementMechanic: 'Social Proof + Specificity = максимальное доверие и продажи',
    optimalSlideCount: 12,
    slides: [
        { position: 1, role: 'ХУК — Впечатляющий результат', trigger: 'Social Proof + Aspiration', titleFormula: '[Имя/Я]: [Результат с цифрами] за [срок].', bodyFormula: 'Полный разбор: как мы это сделали шаг за шагом.', emoji: '🏆' },
        { position: 2, role: 'Контекст — Стартовая точка', trigger: 'Identification', titleFormula: 'Дано: [описание начальной ситуации].', bodyFormula: 'Цифры ДО: [метрика 1], [метрика 2]. Главная боль: [проблема].', emoji: '📊' },
        { position: 3, role: 'Диагностика проблем', trigger: 'Authority + Expertise', titleFormula: 'Мы выявили [N] ключевых проблем.', bodyFormula: '❌ [Проблема 1]\n❌ [Проблема 2]\n❌ [Проблема 3]\nГлавная: [корневая причина].', emoji: '🔍' },
        { position: 4, role: 'Стратегия', trigger: 'Clarity + Trust', titleFormula: 'Наш план из [N] шагов.', bodyFormula: '[Краткое описание стратегии]. Почему именно так: [логика/опыт].', emoji: '🗺️' },
        { position: 5, role: 'Этап 1 — Действия', trigger: 'Narrative / Хронология', titleFormula: '[Период 1]: [Что делали].', bodyFormula: '[Конкретные действия]. Результат этапа: [промежуточный результат].', emoji: '▶️' },
        { position: 6, role: 'Этап 2 — Корректировка', trigger: 'Momentum + Progress', titleFormula: '[Период 2]: [Что изменили и почему].', bodyFormula: '[Действия]. Неожиданный инсайт: [открытие которое помогло].', emoji: '⚡' },
        { position: 7, role: 'Поворотный момент', trigger: 'Climax / Эмоциональный пик', titleFormula: '[Момент]: Всё изменилось.', bodyFormula: '[Конкретное действие которое дало прорыв]. Именно это запустило рост.', emoji: '🚀' },
        { position: 8, role: 'Результат — Цифры ПОСЛЕ', trigger: 'Proof + Specificity', titleFormula: 'Итог через [срок]: вот цифры.', bodyFormula: '✅ [Метрика 1]: с X до Y (+Z%)\n✅ [Метрика 2]: с X до Y\n✅ [Метрика 3]: [результат].', emoji: '📈' },
        { position: 9, role: '3 ключевых урока', trigger: 'Wisdom + Generalization', titleFormula: 'Что сработало: 3 главных вывода.', bodyFormula: '1. [Урок 1]\n2. [Урок 2]\n3. [Урок 3 — самый неожиданный].', emoji: '💡' },
        { position: 10, role: 'Честность — Что не сработало', trigger: 'Authenticity / Доверие через уязвимость', titleFormula: 'Что мы бы сделали иначе.', bodyFormula: '[Ошибка 1] — потеряли [ресурс]. [Что бы изменили]. Это честно.', emoji: '🎯' },
        { position: 11, role: 'Применимость', trigger: 'Personalization + Empathy', titleFormula: 'Подойдёт ли это тебе?', bodyFormula: 'Да, если: [условие 1], [условие 2].\nНет, если: [условие]. [Что делать вместо].', emoji: '🤔' },
        { position: 12, role: 'CTA', trigger: 'Urgency + Direct Offer', titleFormula: 'Хочешь разобрать твою ситуацию?', bodyFormula: 'Напиши "КЕЙС" в комментах — расскажу с чего начать именно тебе.', emoji: '💬', cta: '👇 Напиши "КЕЙС" в комментах — отвечу лично' },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 7: "Горячий Тейк" (Hot Take / Unpopular Opinion)
// ─────────────────────────────────────────────────────────────────────────────
const hotTakeStructure = {
    id: 'hot-take',
    name: 'Горячий Тейк (Hot Take / Unpopular Opinion)',
    description: 'Спорная экспертная позиция против общепринятого. Рекордные комментарии и охват.',
    targetAudience: 'Эксперты с сильной позицией, B2B, SMM, коучи, финансисты, маркетологи',
    engagementMechanic: 'Controversy + Identity Threat = максимальное вовлечение',
    optimalSlideCount: 10,
    slides: [
        { position: 1, role: 'ХУК — Провокация', trigger: 'Cognitive Dissonance', titleFormula: 'Непопулярное мнение: [спорный тезис].', bodyFormula: 'Большинство не согласится. Но я объясню почему я прав.', emoji: '🔥' },
        { position: 2, role: 'Источник позиции', trigger: 'Authority + Experience', titleFormula: 'Я пришёл к этому после [опыт/данные/лет].', bodyFormula: '[Факт/данные/кейс из опыта]. Это изменило моё мнение.', emoji: '🧠' },
        { position: 3, role: 'Признание оппонента', trigger: 'Fairness / Объективность', titleFormula: 'Я понимаю почему большинство думает иначе.', bodyFormula: '[Признание логики противоположной точки зрения]. Но вот проблема...', emoji: '🤝' },
        { position: 4, role: 'Аргумент 1 — Данные', trigger: 'Evidence / Доказательство', titleFormula: 'Аргумент 1: [Факт который опровергает мейнстрим].', bodyFormula: '[Конкретная цифра/исследование/пример]. Это значит [вывод].', emoji: '📊' },
        { position: 5, role: 'Аргумент 2 — Логика', trigger: 'Reasoning', titleFormula: 'Аргумент 2: [Логическая цепочка].', bodyFormula: 'Если [предпосылка А], то [следствие Б]. Большинство игнорирует это.', emoji: '⚙️' },
        { position: 6, role: 'Аргумент 3 — Личный опыт', trigger: 'Authenticity + Vulnerability', titleFormula: 'Аргумент 3: я сам раньше думал иначе.', bodyFormula: 'Раньше я [стандартное мнение]. Но [событие] изменил всё. Результат: [данные].', emoji: '💡' },
        { position: 7, role: 'Предвидение возражений', trigger: 'Proactive Defense', titleFormula: 'Знаю что скажут: "[Главное возражение]".', bodyFormula: '[Точный ответ на возражение с фактами].', emoji: '🛡️' },
        { position: 8, role: 'Интеллектуальная честность', trigger: 'Maturity', titleFormula: 'Где моя позиция может быть неверна.', bodyFormula: '[Ситуация в которой общепринятое мнение правильнее]. Я не догматик.', emoji: '⚖️' },
        { position: 9, role: 'Итоговая позиция', trigger: 'Clarity + Leadership', titleFormula: 'Моя итоговая позиция:', bodyFormula: '[Чёткое резюме в 2-3 предложения]. Основано на [данные/опыт].', emoji: '🎯' },
        { position: 10, role: 'CTA — Дискуссия', trigger: 'Social Identity + Tribal Warfare', titleFormula: 'Согласен? Не согласен? Докажи.', bodyFormula: 'Напиши в комментах — отвечаю на каждый аргумент.', emoji: '💬', cta: '👇 СОГЛАСЕН или НЕТ — и почему' },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 8: "Аудит / Чек-лист" (Checklist Audit)
// ─────────────────────────────────────────────────────────────────────────────
const checklistAuditStructure = {
    id: 'checklist-audit',
    name: 'Аудит / Чек-лист (Checklist Audit)',
    description: 'Самопроверка по критериям. Люди сохраняют как шпаргалку и возвращаются.',
    targetAudience: 'Маркетинг, финансы, здоровье, бизнес — любые ниши с процессами',
    engagementMechanic: 'Self-Assessment + Save Mechanic = многократные просмотры',
    optimalSlideCount: 11,
    slides: [
        { position: 1, role: 'ХУК — Диагностика', trigger: 'Curiosity + Self-relevance', titleFormula: 'Проверь себя: [N] признаков что твой [объект] работает неправильно.', bodyFormula: 'Если нашёл хотя бы 3 — нужно срочно исправлять. Листай.', emoji: '🔎' },
        { position: 2, role: 'Инструкция по использованию', trigger: 'Structure', titleFormula: 'Как проходить этот аудит.', bodyFormula: '✅ = всё хорошо | ⚠️ = нужно улучшение | ❌ = срочно исправить\nСохрани — чтобы вернуться регулярно.', emoji: '📋' },
        { position: 3, role: 'Блок 1 — Фундамент', trigger: 'Foundation', titleFormula: 'Блок 1: [Название категории]', bodyFormula: '☐ [Пункт 1. Конкретный критерий]\n☐ [Пункт 2]\n☐ [Пункт 3]', emoji: '🏗️' },
        { position: 4, role: 'Блок 2 — Эффективность', trigger: 'Performance', titleFormula: 'Блок 2: [Вторая категория]', bodyFormula: '☐ [Пункт 1]\n☐ [Пункт 2]\n☐ [Пункт 3 — делают только топ-10%]', emoji: '⚡' },
        { position: 5, role: 'Блок 3 — Продвинутый уровень', trigger: 'Growth Mindset', titleFormula: 'Блок 3: [Продвинутые критерии]', bodyFormula: '☐ [Пункт 1]\n☐ [Пункт 2]\n☐ [Пункт 3]', emoji: '🚀' },
        { position: 6, role: 'Красные флаги — Срочно исправить', trigger: 'Loss Aversion', titleFormula: 'Блок 4: Красные флаги — немедленно исправить.', bodyFormula: '🚨 [Критическая ошибка 1]\n🚨 [Критическая ошибка 2]\n🚨 [Критическая ошибка 3]', emoji: '⚠️' },
        { position: 7, role: 'Блок для роста', trigger: 'Ambition', titleFormula: 'Есть ли у тебя это для масштабирования?', bodyFormula: '☐ [Элемент роста 1]\n☐ [Элемент роста 2]\n☐ [Элемент роста 3 — у большинства нет]', emoji: '🌱' },
        { position: 8, role: 'Что часто пропускают', trigger: 'Completeness Drive', titleFormula: 'Топ-3 ошибки при проверке.', bodyFormula: '[Ошибка 1 — почему незаметна но критична]\n[Ошибка 2]\n[Ошибка 3]', emoji: '🎯' },
        { position: 9, role: 'Подсчёт результата', trigger: 'Gamification', titleFormula: 'Подсчитай свой балл.', bodyFormula: '10+ ✅ = 🏆 Всё отлично\n6-9 = ⚠️ Точки роста\n1-5 = 🚨 Нужен план действий', emoji: '🏅' },
        { position: 10, role: 'Приоритеты исправления', trigger: 'Actionability', titleFormula: 'С чего начать если нашёл ошибки.', bodyFormula: '1. Исправь [самое критичное] первым — даст [быстрый результат].\n2. [Второй приоритет].\n3. Остальное — план на месяц.', emoji: '📅' },
        { position: 11, role: 'CTA — Ежемесячная проверка', trigger: 'Utility + Recurrence', titleFormula: 'Сохрани — возвращайся каждый месяц.', bodyFormula: 'Этот аудит работает лучше при регулярном использовании. Поделись с коллегой.', emoji: '🔖', cta: '👇 Напиши свой балл в комментах: сколько галочек набрал?' },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 9: "A vs B — Два пути" (Compare)
// ─────────────────────────────────────────────────────────────────────────────
const avsBStructure = {
    id: 'a-vs-b',
    name: 'A vs B — Два пути (Compare)',
    description: 'Сравнение двух подходов/инструментов. Аудитория выбирает сторону — максимум комментариев.',
    targetAudience: 'Технологии, лайфстайл, бизнес-инструменты, фитнес, финансы, SMM',
    engagementMechanic: 'Choice Architecture + Team Identity = споры в комментариях',
    optimalSlideCount: 10,
    slides: [
        { position: 1, role: 'ХУК — Вечный спор', trigger: 'Controversy + Tribal Identity', titleFormula: '[A] vs [B]: что выбрать в [год/контекст]?', bodyFormula: 'Разберём по критериям. Финальный ответ — на последнем слайде.', emoji: '⚔️' },
        { position: 2, role: 'Правила сравнения', trigger: 'Fairness / Объективность', titleFormula: 'Как мы сравниваем: [N] критериев.', bodyFormula: 'Критерии: [1], [2], [3], [4], [5]. Данные: [источник/личный опыт].', emoji: '📏' },
        { position: 3, role: 'Раунд 1 — Скорость/Простота', trigger: 'Quick Assessment', titleFormula: 'Раунд 1: [Критерий].', bodyFormula: '[A]: [оценка + почему]\n[B]: [оценка + почему]\n🏆 Победитель: [A/B] — [причина].', emoji: '⚡' },
        { position: 4, role: 'Раунд 2 — Цена/Экономика', trigger: 'Value', titleFormula: 'Раунд 2: [Критерий].', bodyFormula: '[A]: [данные/цифры]\n[B]: [данные/цифры]\n🏆 Победитель: [A/B].', emoji: '💰' },
        { position: 5, role: 'Раунд 3 — Качество/Результат', trigger: 'Proof', titleFormula: 'Раунд 3: [Критерий].', bodyFormula: '[A]: [конкретный результат]\n[B]: [конкретный результат]\n🏆 Победитель: [A/B].', emoji: '🏆' },
        { position: 6, role: 'Раунд 4 — Для кого подходит', trigger: 'Personalization', titleFormula: 'Раунд 4: Кому что подходит.', bodyFormula: '[A] лучше если: [профиль]\n[B] лучше если: [профиль].', emoji: '👤' },
        { position: 7, role: 'Раунд 5 — Реальный опыт', trigger: 'Authority + Story', titleFormula: 'Раунд 5: Мой личный опыт с обоими.', bodyFormula: 'Использовал [A] [срок] и [B] [срок]. Вот что заметил: [сравнение].', emoji: '🎯' },
        { position: 8, role: 'Итоговая таблица', trigger: 'Clarity + Summary', titleFormula: 'Итог по всем критериям.', bodyFormula: '[A]: победил в [N из 5] раундов\n[B]: победил в [M из 5] раундов\nОбщий счёт: [A] [X] : [Y] [B]', emoji: '📊' },
        { position: 9, role: 'Финальный вердикт', trigger: 'Resolution + Opinion Leadership', titleFormula: 'Мой финальный выбор: [A или B].', bodyFormula: 'Потому что [3 причины]. НО: если [условие] — выбирай [противоположный].', emoji: '🥇' },
        { position: 10, role: 'CTA — Опрос аудитории', trigger: 'Participation + Identity', titleFormula: 'А ты на чьей стороне?', bodyFormula: 'Напиши в комментах: [A] или [B] — и почему именно.', emoji: '🗳️', cta: '👇 [A] или [B]? Отвечай в комментах — спорим!' },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 10: "День/Неделя из жизни" (Day in Life / Routine Breakdown)
// ─────────────────────────────────────────────────────────────────────────────
const dayInLifeStructure = {
    id: 'day-in-life',
    name: 'День из жизни / Рутина (Day in Life)',
    description: 'Разбор идеального дня/рутины. Высокая аспирация, лайфстайл, идентификация.',
    targetAudience: 'Личный бренд, коучи, предприниматели, health&wellness, блогеры',
    engagementMechanic: 'Aspiration + Voyeurism + Copycat желание',
    optimalSlideCount: 11,
    slides: [
        { position: 1, role: 'ХУК — Результат рутины', trigger: 'Aspiration + Curiosity', titleFormula: 'Как выглядит мой [день/неделя] когда я делаю [впечатляющий результат].', bodyFormula: 'Полный breakdown: от подъёма до сна. Укради мою систему.', emoji: '📅' },
        { position: 2, role: 'Утро — Ритуал пробуждения', trigger: 'Lifestyle + Aspiration', titleFormula: '[Время]: Подъём и первые [N] минут.', bodyFormula: '[Что делаю первые минуты]. Почему именно так: [причина]. Время: [данные].', emoji: '🌅' },
        { position: 3, role: 'Утро — Физическая практика', trigger: 'Health + Energy', titleFormula: '[Время]: [Спорт/медитация/зарядка].', bodyFormula: '[Что конкретно делаю]. Эффект для [энергии/фокуса]. [Сколько времени].', emoji: '💪' },
        { position: 4, role: 'Утро — Ментальная подготовка', trigger: 'Mindset', titleFormula: '[Время]: Как настраиваю голову.', bodyFormula: '[Конкретная практика: журнал/планирование]. Занимает [время]. Почему именно.', emoji: '🧘' },
        { position: 5, role: 'Главный блок — Глубокая работа', trigger: 'Productivity', titleFormula: '[Время]-[Время]: Работа без помех.', bodyFormula: 'В это время: [задачи]. Правило: [без чего обхожусь]. Успеваю: [результат].', emoji: '🎯' },
        { position: 6, role: 'Питание и восстановление', trigger: 'Energy Optimization', titleFormula: '[Время]: Питание и перезарядка.', bodyFormula: '[Что ем/как перезаряжаюсь]. Убрал: [что исключил]. Эффект: [результат].', emoji: '🥗' },
        { position: 7, role: 'Коммуникации', trigger: 'Workflow', titleFormula: '[Время]: Встречи, звонки, сообщения.', bodyFormula: 'Правила: [правило 1], [правило 2]. Никогда не делаю: [табу].', emoji: '📱' },
        { position: 8, role: 'Вечерний ритуал', trigger: 'Closure + Recovery', titleFormula: '[Время]: Завершение дня.', bodyFormula: '[Ритуал закрытия работы]. [Вечерняя практика]. Сон: [время + почему важно].', emoji: '🌙' },
        { position: 9, role: 'Что намеренно НЕ делаю', trigger: 'Counter-intuitive + Contrast', titleFormula: 'Что я убрал из своей рутины навсегда.', bodyFormula: '❌ [Привычка 1]\n❌ [Привычка 2]\n❌ [Привычка 3]\nПочему отказался: [причины].', emoji: '🚫' },
        { position: 10, role: 'Ключевые принципы системы', trigger: 'Wisdom', titleFormula: '3 принципа которые делают рутину рабочей.', bodyFormula: '1. [Принцип 1]\n2. [Принцип 2]\n3. [Принцип 3 — самый неочевидный].', emoji: '💡' },
        { position: 11, role: 'CTA — Попробуй сам', trigger: 'Copycat + Aspiration', titleFormula: 'Начни с одного элемента.', bodyFormula: 'Самый лёгкий старт: [конкретный первый шаг]. Напиши что добавишь первым.', emoji: '🔖', cta: '👇 Какой элемент добавишь в свой день? Напиши в комментах' },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 11: "Вопросы и Ответы" (FAQ / Q&A Storm)
// ─────────────────────────────────────────────────────────────────────────────
const faqStructure = {
    id: 'faq',
    name: 'Ответы на Вопросы (FAQ / Q&A)',
    description: 'Реальные вопросы из DM/комментариев с экспертными ответами. Строит доверие.',
    targetAudience: 'Эксперты всех ниш, бренды, консультанты, коучи',
    engagementMechanic: 'Parasocial Bond + Problem Solving + Trust Building',
    optimalSlideCount: 10,
    slides: [
        { position: 1, role: 'ХУК — Острые вопросы', trigger: 'Curiosity + Relevance', titleFormula: 'Отвечаю на [N] вопросов которые мне задают каждый день.', bodyFormula: 'Собрал из DM и комментариев. Честные ответы — без воды.', emoji: '❓' },
        { position: 2, role: 'Q1 — Самый частый вопрос', trigger: 'Universal Pain', titleFormula: 'Вопрос: "[Самый популярный вопрос]"', bodyFormula: 'Ответ: [Чёткий ёмкий ответ]. Важный нюанс: [то что обычно забывают].', emoji: '💬' },
        { position: 3, role: 'Q2 — Спорный вопрос', trigger: 'Controversy + Honesty', titleFormula: 'Вопрос: "[Спорный вопрос]"', bodyFormula: 'Честный ответ: [прямо без прикрас]. Большинство не хотят это слышать, но...', emoji: '🔥' },
        { position: 4, role: 'Q3 — Про деньги/результаты', trigger: 'Aspiration + Social Proof', titleFormula: 'Вопрос: "[Вопрос про заработок/результат]"', bodyFormula: 'Ответ: [Конкретные цифры/данные]. Контекст: [что учитывать].', emoji: '💰' },
        { position: 5, role: 'Q4 — Вопрос новичка', trigger: 'Empathy', titleFormula: 'Вопрос: "[Базовый вопрос]"', bodyFormula: 'Многие стесняются спросить. Честный ответ: [объяснение без снобизма].', emoji: '🌱' },
        { position: 6, role: 'Q5 — Технический вопрос', trigger: 'Expertise + Specificity', titleFormula: 'Вопрос: "[Технический вопрос]"', bodyFormula: 'Ответ: [Чёткий технический ответ]. Инструмент/ресурс: [рекомендация].', emoji: '⚙️' },
        { position: 7, role: 'Q6 — Про типичные ошибки', trigger: 'Protection + Loss Aversion', titleFormula: 'Вопрос: "[Вопрос про ошибку]"', bodyFormula: '90% делают это неправильно. Правильно так: [решение]. Проверь себя.', emoji: '⚠️' },
        { position: 8, role: 'Q7 — Про тренды/будущее', trigger: 'FOMO + Authority', titleFormula: 'Вопрос: "[Вопрос о трендах]"', bodyFormula: 'Мой прогноз: [конкретный прогноз с обоснованием]. Основано на: [данные].', emoji: '🔮' },
        { position: 9, role: 'Бонусный неожиданный вопрос', trigger: 'Surprise + Authenticity', titleFormula: 'Бонусный вопрос который меня удивил.', bodyFormula: '"[Неожиданный вопрос]" — [честный личный ответ].', emoji: '🎁' },
        { position: 10, role: 'CTA — Задавай вопрос', trigger: 'Community + Engagement Loop', titleFormula: 'Какой у тебя вопрос?', bodyFormula: 'Задавай в комментах — разберу в следующей подборке.', emoji: '💬', cta: '👇 Задай вопрос — сделаю следующую часть с лучшими' },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// СТРУКТУРА 12: "Трёхактная История" (Story Arc)
// ─────────────────────────────────────────────────────────────────────────────
const storyArcStructure = {
    id: 'story-arc',
    name: 'Трёхактная История (Story Arc)',
    description: 'Классическая нарративная дуга: проблема → борьба → победа. Максимальная эмпатия.',
    targetAudience: 'Личный бренд, коучи, предприниматели, авторы, anyone с историей',
    engagementMechanic: 'Narrative Transportation = полное погружение и эмоциональная связь',
    optimalSlideCount: 14,
    slides: [
        { position: 1, role: 'ХУК — Начало с кульминации (In Medias Res)', trigger: 'In Medias Res', titleFormula: '[Конкретный драматичный момент из середины истории].', bodyFormula: 'Это был [дата/период]. Расскажу всё с начала.', emoji: '⚡' },
        { position: 2, role: 'АКТ 1 — Обычный мир', trigger: 'Baseline / Идентификация', titleFormula: 'Раньше моя жизнь выглядела вот так.', bodyFormula: '[Описание "нормального" состояния]. Я думал что [заблуждение].', emoji: '🌍' },
        { position: 3, role: 'АКТ 1 — Зов к приключению', trigger: 'Inciting Incident', titleFormula: 'Потом случилось [событие] — и всё изменилось.', bodyFormula: '[Конкретное событие/звонок/встреча]. Именно это заставило меня...', emoji: '🔔' },
        { position: 4, role: 'АКТ 1 — Начальные сомнения', trigger: 'Vulnerability', titleFormula: 'Первая реакция: страх и сомнение.', bodyFormula: 'Я думал: "[внутренний монолог страха]". Казалось нереальным. Но...', emoji: '😰' },
        { position: 5, role: 'АКТ 2 — Первый шаг', trigger: 'Action + Risk', titleFormula: 'Я сделал первый шаг. Он был ужасным.', bodyFormula: '[Конкретное действие]. Результат: [провал/неловкость]. Но я продолжил.', emoji: '👣' },
        { position: 6, role: 'АКТ 2 — Союзники', trigger: 'Community + Gratitude', titleFormula: 'Появились люди которые помогли.', bodyFormula: '[Кто помог: ментор/друг/книга]. [Что изменили в подходе].', emoji: '🤝' },
        { position: 7, role: 'АКТ 2 — Нарастание препятствий', trigger: 'Conflict + Stakes', titleFormula: 'Но всё пошло не так как планировал.', bodyFormula: '[Препятствие 1]. [Препятствие 2]. Казалось что [негативный исход] неизбежен.', emoji: '⛈️' },
        { position: 8, role: 'АКТ 2 — Тёмная ночь (Кризис)', trigger: 'Emotional Peak / Catharsis', titleFormula: '[Конкретный момент максимального отчаяния].', bodyFormula: 'Я [детали кризиса]. Это был момент когда я почти сдался.', emoji: '😞' },
        { position: 9, role: 'АКТ 2 — Поворотный инсайт', trigger: 'Revelation + Hope', titleFormula: 'Но именно в этот момент я понял...', bodyFormula: '[Ключевое озарение]. Это изменило не только [ситуацию], но и меня.', emoji: '💡' },
        { position: 10, role: 'АКТ 3 — Решающий выбор', trigger: 'Agency + Courage', titleFormula: 'Я сделал выбор который изменил всё.', bodyFormula: '[Конкретное решение]. Многие выбрали бы [противоположное]. Я не стал.', emoji: '🎯' },
        { position: 11, role: 'АКТ 3 — Новый мир (Результат)', trigger: 'Resolution + Transformation', titleFormula: 'Вот где я оказался через [срок].', bodyFormula: '[Конкретные изменения: внешние + внутренние]. До и после — [сравнение].', emoji: '🌟' },
        { position: 12, role: 'АКТ 3 — Возврат с даром', trigger: 'Wisdom + Generosity', titleFormula: 'Что эта история изменила в моём понимании [темы].', bodyFormula: '[Универсальный принцип из личной истории]. Это работает для всех.', emoji: '🎁' },
        { position: 13, role: 'Универсальный урок для аудитории', trigger: 'Mirroring + Application', titleFormula: 'Что твой [аналогичная ситуация] говорит тебе прямо сейчас?', bodyFormula: 'Если ты в [точка А] — знай: [сообщение надежды]. Я был там.', emoji: '🪞' },
        { position: 14, role: 'CTA — Продолжение истории', trigger: 'Connection + Continuation', titleFormula: 'Ты тоже в середине своей истории.', bodyFormula: 'Напиши в комментах где ты сейчас: в акте 1, 2 или 3?', emoji: '📖', cta: '👇 Напиши свой акт — отвечаю каждому' },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// Экспорт — 12 структур
// ─────────────────────────────────────────────────────────────────────────────
exports.VIRAL_STRUCTURES = {
    'open-loop': openLoopStructure,
    'listicle': listicleStructure,
    'before-after': beforeAfterStructure,
    'myth-busting': mythBustingStructure,
    'step-by-step': stepByStepStructure,
    'case-study': caseStudyStructure,
    'hot-take': hotTakeStructure,
    'checklist-audit': checklistAuditStructure,
    'a-vs-b': avsBStructure,
    'day-in-life': dayInLifeStructure,
    'faq': faqStructure,
    'story-arc': storyArcStructure,
};
function getViralStructure(id) {
    return exports.VIRAL_STRUCTURES[id];
}
function listViralStructures() {
    return Object.values(exports.VIRAL_STRUCTURES);
}
/**
 * Генерирует шаблонный JSON слайдов из вирусной структуры
 */
function structureToSlides(structure) {
    return structure.slides.map(slide => ({
        slideNumber: slide.position,
        title: slide.titleFormula,
        subtitle: slide.role,
        body: slide.bodyFormula + (slide.cta ? '\n\n' + slide.cta : ''),
        emoji: slide.emoji,
        tag: slide.trigger,
    }));
}
//# sourceMappingURL=viralStructures.js.map