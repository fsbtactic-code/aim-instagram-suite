/**
 * AIM VideoLens — Tool: aim_analyze_hook
 * Оценщик хука: анализирует первые 5 секунд видео.
 * Пайплайн: trimVideo(5s) → Whisper → Scene Grid 2x2 → 5 вариантов усиления
 */

import * as fs from 'fs';
import { processVideo, cleanupVideoTemp } from '../core/mediaProcessor.js';
import { isUrl } from '../core/ytdlp.js';

export interface AnalyzeHookInput {
  videoPath?: string;
  url?: string;
}

export async function analyzeHook(input: AnalyzeHookInput): Promise<string> {
  const { videoPath, url } = input;

  const source = url ?? videoPath;

  if (!source) {
    return JSON.stringify({
      error: 'Укажите videoPath (локальный файл) или url (ссылка на видео)',
    });
  }

  // Валидация локального файла
  if (!isUrl(source) && !fs.existsSync(source)) {
    return JSON.stringify({
      error: `Файл не найден: ${source}`,
      hint: 'Проверьте путь к видеофайлу.',
    });
  }

  // Пайплайн только для первых 5 секунд (hookOnly mode)
  const media = await processVideo(source, { hookOnly: true, hooksSeconds: 5 });

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

  cleanupVideoTemp(media);
  return JSON.stringify(result, null, 2);
}
