"use strict";
/**
 * AIM VideoLens — Tool: aim_analyze_hook
 * Оценщик хука: анализирует первые 5 секунд видео.
 * Пайплайн: trimVideo(5s) → Whisper → Scene Grid 2x2 → 5 вариантов усиления
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
exports.analyzeHook = analyzeHook;
const fs = __importStar(require("fs"));
const mediaProcessor_js_1 = require("../core/mediaProcessor.js");
const ytdlp_js_1 = require("../core/ytdlp.js");
async function analyzeHook(input) {
    const { videoPath, url } = input;
    const source = url ?? videoPath;
    if (!source) {
        return JSON.stringify({
            error: 'Укажите videoPath (локальный файл) или url (ссылка на видео)',
        });
    }
    // Валидация локального файла
    if (!(0, ytdlp_js_1.isUrl)(source) && !fs.existsSync(source)) {
        return JSON.stringify({
            error: `Файл не найден: ${source}`,
            hint: 'Проверьте путь к видеофайлу.',
        });
    }
    // Пайплайн только для первых 5 секунд (hookOnly mode)
    const media = await (0, mediaProcessor_js_1.processVideo)(source, { hookOnly: true, hooksSeconds: 5 });
    // Извлекаем первую фразу из транскрипта
    const firstPhrase = media.transcript.segments.length > 0
        ? media.transcript.segments[0].text
        : '(речь не обнаружена в первых 5 секундах)';
    const result = {
        tool: 'aim_analyze_hook',
        source,
        hookDuration: '5 секунд',
        hookTranscript: {
            firstPhrase,
            fullText: media.transcriptText,
            language: media.transcript.language,
        },
        visualHook: {
            sceneCount: media.sceneTimecodes.length,
            timecodes: media.sceneTimecodes,
            gridImages: media.gridImages.map((base64, index) => ({
                mimeType: 'image/jpeg',
                base64,
                description: `Сетка кадров хука (часть ${index + 1})`,
            })),
        },
        analysisRequest: `
Ты — эксперт по захвату внимания в коротких видео. Оцени ХУК этого видео (первые 5 секунд).

## ПЕРВАЯ ФРАЗА:
> "${firstPhrase}"

## ТРАНСКРИПТ ПЕРВЫХ 5 СЕКУНД:
${media.transcriptText}

## ВИЗУАЛЬНЫЙ КОНТЕКСТ:
[Смотри прикреплённую сетку кадров первых 5 секунд]

---

## ОЦЕНКА ТЕКУЩЕГО ХУКА:

**Сила текстового хука:** X/10  
**Сила визуального хука:** X/10  
**Общая оценка:** X/10  

**Главная слабость:** [одна конкретная проблема]

---

## 5 ВАРИАНТОВ УСИЛЕННОГО ХУКА:

Для каждого варианта дай:
- **Новая первая фраза** (точный текст)
- **Формула** (название приёма: вопрос / провокация / цифра / обещание / боль)
- **Визуал** (что должно быть на экране в этот момент)

### Вариант 1: [Название приёма]
📝 **Фраза:** "..."
🎬 **Визуал:** ...
💡 **Почему сработает:** ...

### Вариант 2: [Название приёма]
📝 **Фраза:** "..."
🎬 **Визуал:** ...
💡 **Почему сработает:** ...

### Вариант 3: [Название приёма]
📝 **Фраза:** "..."
🎬 **Визуал:** ...
💡 **Почему сработает:** ...

### Вариант 4: [Название приёма]
📝 **Фраза:** "..."
🎬 **Визуал:** ...
💡 **Почему сработает:** ...

### Вариант 5: [Название приёма]
📝 **Фраза:** "..."
🎬 **Визуал:** ...
💡 **Почему сработает:** ...

---
**Рекомендую использовать** Вариант X — потому что [1 предложение].
`.trim(),
    };
    (0, mediaProcessor_js_1.cleanupVideoTemp)(media);
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=analyzeHook.js.map