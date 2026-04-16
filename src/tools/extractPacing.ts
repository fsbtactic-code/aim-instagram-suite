/**
 * AIM VideoLens — Tool: aim_extract_pacing
 * Детектор скуки: анализирует ритм монтажа, находит провисания.
 * Пайплайн: detectSceneTimecodes (без сохранения кадров) → расчёт интервалов → LLM
 */

import * as fs from 'fs';
import { extractPacingData, cleanupVideoTemp } from '../core/mediaProcessor.js';
import { isUrl } from '../core/ytdlp.js';

export interface ExtractPacingInput {
  videoPath?: string;
  url?: string;
  slowThresholdSec?: number;  // Интервал без склейки считается "провисанием" (default: 4 сек)
}

export async function extractPacing(input: ExtractPacingInput): Promise<string> {
  const { videoPath, url, slowThresholdSec = 4 } = input;

  const source = url ?? videoPath;

  if (!source) {
    return JSON.stringify({
      error: 'Укажите videoPath (локальный файл) или url (ссылка на видео)',
    });
  }

  if (!isUrl(source) && !fs.existsSync(source)) {
    return JSON.stringify({
      error: `Файл не найден: ${source}`,
      hint: 'Проверьте путь к видеофайлу.',
    });
  }

  const { media, pacing } = await extractPacingData(source, slowThresholdSec);

  // Форматируем таблицу таймкодов для LLM
  const timecodeTable = pacing.timecodes.map((tc, i) => {
    const next = pacing.timecodes[i + 1];
    const interval = next ? (next.timecode - tc.timecode).toFixed(1) : '-';
    const isSlow = next && (next.timecode - tc.timecode) > slowThresholdSec;
    return `| ${tc.ptsTime} | ${interval}с | ${isSlow ? '⚠️ ПРОВИСАНИЕ' : '✅'} |`;
  }).join('\n');

  const result = {
    tool: 'aim_extract_pacing',
    source,

    pacingStats: {
      totalSceneCuts: pacing.timecodes.length,
      avgCutIntervalSec: parseFloat(pacing.avgCutInterval.toFixed(2)),
      slowThresholdSec,
      slowSpotsCount: pacing.slowSpots.length,
      slowSpots: pacing.slowSpots,
    },

    transcript: {
      fullText: media.transcriptText,
      language: media.transcript.language,
    },

    visualContext: {
      gridImages: media.gridImages.map((base64, index) => ({
        mimeType: 'image/jpeg',
        base64,
        description: `Сетка контекста (часть ${index + 1})`,
      })),
    },

    analysisRequest: `
Ты — монтажёр и эксперт по ритму короткого видео. Проанализируй динамику монтажа.

## ТРАНСКРИПТ ВИДЕО:
${media.transcriptText}

## ТАБЛИЦА РИТМА МОНТАЖА:
| Таймкод | Интервал | Статус |
|---------|---------|--------|
${timecodeTable}

## СТАТИСТИКА:
- **Всего склеек:** ${pacing.timecodes.length}
- **Средний интервал:** ${pacing.avgCutInterval.toFixed(1)} сек
- **Провисаний (>${slowThresholdSec}с):** ${pacing.slowSpots.length}

${pacing.slowSpots.length > 0 ? `
## НАЙДЕННЫЕ ПРОВИСАНИЯ:
${pacing.slowSpots.map((s, i) => `${i + 1}. От ${s.from} до ${s.to} — **${s.durationSec.toFixed(1)} секунд** без смены кадра`).join('\n')}
` : '## ✅ ПРОВИСАНИЙ НЕ ОБНАРУЖЕНО'}

---

## ВИЗУАЛЬНЫЙ КОНТЕКСТ:
[Смотри прикреплённые ключевые кадры]

---

## ЗАДАЧА:

### 📊 ОБЩАЯ ОЦЕНКА РИТМА:
[Быстрый/Нормальный/Медленный — и почему]

### ⚠️ РАЗБОР КАЖДОГО ПРОВИСАНИЯ:
Для каждого провисания из таблицы дай КОНКРЕТНУЮ рекомендацию:

**[Таймкод] — ${slowThresholdSec}+ секунд без смены:**
- 🎬 **Вставь:** B-Roll: [что именно показать] / Зум: [на что] / Текст/Подпись: [что написать] / Звуковой эффект: [какой]
- 🎯 **Эффект:** [почему это решение удержит зрителя]

### ✅ ЧТО РАБОТАЕТ ХОРОШО:
[Моменты с хорошим темпом — 2-3 конкретных примера]

### 🎯 ИТОГОВЫЙ ПЛАН ПРАВОК:
Пронумерованный список конкретных действий в хронологическом порядке.
`.trim(),
  };

  cleanupVideoTemp(media);
  return JSON.stringify(result, null, 2);
}
