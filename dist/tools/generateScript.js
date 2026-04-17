"use strict";
/**
 * AIM VideoLens — Tool: aim_generate_script
 * Кража структуры: адаптация успешного контента под новую тему.
 * Пайплайн: Чтение .md референса → LLM генерирует таблицу сценария
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
exports.generateScript = generateScript;
const fs = __importStar(require("fs"));
async function generateScript(input) {
    const { referenceMdPath, targetTopic } = input;
    if (!fs.existsSync(referenceMdPath)) {
        return JSON.stringify({
            error: `Файл референса не найден: ${referenceMdPath}`,
            hint: 'Сначала используй aim_analyze_viral_reels чтобы создать файл референса.',
        });
    }
    const referenceContent = fs.readFileSync(referenceMdPath, 'utf-8');
    // Проверка что файл не пустой
    if (referenceContent.trim().length < 100) {
        return JSON.stringify({
            error: 'Файл референса слишком маленький или пустой.',
            hint: 'Убедитесь что aim_analyze_viral_reels успешно записал отчёт в этот файл.',
        });
    }
    const result = {
        tool: 'aim_generate_script',
        referenceMdPath,
        targetTopic,
        referenceContent,
        analysisRequest: `
Ты — профессиональный сценарист коротких видео для Instagram Reels и TikTok.

## ЗАДАЧА:
Возьми успешную структуру из отчёта ниже и адаптируй её под НОВУЮ тему: **"${targetTopic}"**

## РЕФЕРЕНС (успешный контент для анализа):
${referenceContent}

---

## ПРАВИЛА АДАПТАЦИИ:
1. **Сохрани динамику** — такой же темп монтажа и смену блоков
2. **Укради хук** — адаптируй формулу первой фразы под ${targetTopic}
3. **Скопируй эмоциональные триггеры** — если в оригинале был Surprise+FOMO, используй те же в новой теме
4. **Не копируй слова** — меняй тему, сохраняй структуру

---

## РЕЗУЛЬТАТ — СЦЕНАРИЙ В ВИДЕ ТАБЛИЦЫ:

| ⏱ Таймкод | 🎬 Визуал | 🎤 Текст диктора |
|-----------|-----------|-----------------|
| 00:00–00:03 | [что на экране] | [точный текст хука] |
| 00:03–00:08 | [что показываем] | [текст] |
| ... | ... | ... |

**Важно:**
- Таймкоды должны совпадать с ритмом оригинала
- Колонка "Визуал" — конкретное описание кадра, не "показываем продукт"
- Колонка "Текст" — готовый текст для начитки, слово в слово
- Финал = призыв к действию (CTA)

Напиши ТОЛЬКО таблицу и краткое объяснение (3-5 предложений): почему такая структура будет работать для ниши "${targetTopic}".
`.trim(),
    };
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=generateScript.js.map