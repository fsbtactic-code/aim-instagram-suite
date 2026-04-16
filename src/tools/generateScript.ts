/**
 * AIM VideoLens — Tool: aim_generate_script
 * Кража структуры: адаптация успешного контента под новую тему.
 * Пайплайн: Чтение .md референса → LLM генерирует таблицу сценария
 */

import * as fs from 'fs';

export interface GenerateScriptInput {
  referenceMdPath: string;
  targetTopic: string;
}

export async function generateScript(input: GenerateScriptInput): Promise<string> {
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
