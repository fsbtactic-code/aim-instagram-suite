/**
 * AIM VideoLens — Tool: aim_evaluate_video
 * Оценка виральности видео до публикации.
 * Пайплайн: Whisper → Scene Grid → Claude Vision
 */

import * as fs from 'fs';
import { processVideo, cleanupVideoTemp } from '../core/mediaProcessor.js';

export interface EvaluateVideoInput {
  videoPath: string;
}

export async function evaluateVideo(input: EvaluateVideoInput): Promise<string> {
  const { videoPath } = input;

  if (!fs.existsSync(videoPath)) {
    return JSON.stringify({
      error: `Файл не найден: ${videoPath}`,
      hint: 'Проверьте путь к видеофайлу.',
    });
  }

  const media = await processVideo(videoPath);

  // Возвращаем структурированные данные для Claude
  const result = {
    tool: 'aim_evaluate_video',
    videoPath,
    // TEXT-FIRST: сначала транскрипт
    transcript: {
      language: media.transcript.language,
      segmentCount: media.transcript.segments.length,
      fullText: media.transcriptText,
    },
    // GRIDS: массив из нескольких сеток
    visualAnalysis: {
      sceneCount: media.sceneTimecodes.length,
      timecodes: media.sceneTimecodes,
      gridImages: media.gridImages.map((base64, index) => ({
        mimeType: 'image/jpeg',
        base64,
        description: `Сетка кадров (ч.${index + 1} из ${media.gridImages.length})`,
      })),
    },
    // Задача для LLM
    analysisRequest: `
Ты — эксперт по вирусному контенту для Instagram Reels и TikTok.

Проанализируй это видео по системе оценки виральности:

## ТРАНСКРИПТ (текст видео):
${media.transcriptText}

## ВИЗУАЛЬНЫЙ КОНТЕКСТ (сетки ключевых кадров):
[Смотри прикреплённый набор картинок-сеток с таймкодами (слева-направо, сверху-вниз)]

---

Дай анализ по следующим критериям:

### 🪝 ХУК (первые 3 секунды)
- Оцени силу первой фразы (1-10)
- Есть ли визуальный крючок в первых кадрах?
- Почему зритель должен остаться?

### 📊 УДЕРЖАНИЕ ВНИМАНИЯ
- Где зритель скорее всего отвалится?
- Есть ли "провисания" — моменты без динамики?
- Темп монтажа: быстро / нормально / медленно?

### 💡 ЭМОЦИОНАЛЬНЫЙ РЕЗОНАНС
- Какую главную эмоцию вызывает видео?
- Есть ли триггеры (surprise, FOMO, юмор, сочувствие)?

### ⭐ ВИРАЛЬНЫЙ ПОТЕНЦИАЛ
- Общая оценка (1-10)
- Вероятность досмотра до конца (%)

### 🚀 ТОП-3 РЕКОМЕНДАЦИИ
Конкретные правки, которые поднимут виральный потенциал. Каждая рекомендация — 1 предложение с таймкодом.
`.trim(),
  };

  // Возвращаем JSON с base64 картинкой встроенной
  return JSON.stringify(result, null, 2);
}
