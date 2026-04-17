/**
 * AIM VideoLens — Core: Whisper wrapper
 * Локальная транскрибация через nodejs-whisper (whisper.cpp бинд).
 * Бесплатно, без API, работает офлайн.
 */

import * as path from 'path';
import * as fs from 'fs';

export interface TranscriptSegment {
  start: number;   // секунды
  end: number;     // секунды
  text: string;
}

export interface TranscriptResult {
  segments: TranscriptSegment[];
  fullText: string;
  language: string;
}

/**
 * Транскрибирует WAV-файл через nodejs-whisper.
 * @param wavPath — путь к WAV (16kHz, mono, PCM s16le)
 * @param modelName — размер модели: 'base', 'small', 'medium' (default: 'base')
 */
export async function transcribe(
  wavPath: string,
  modelName: 'tiny' | 'base' | 'small' | 'medium' = 'base',
): Promise<TranscriptResult> {
  if (!fs.existsSync(wavPath)) {
    throw new Error(`Whisper: WAV файл не найден: ${wavPath}`);
  }

  // nodejs-whisper — динамический импорт
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { nodewhisper } = require('nodejs-whisper');

  // nodejs-whisper возвращает массив сегментов с таймкодами
  // ВАЖНО: nodejs-whisper использует console.log(), что загрязняет stdout
  // и ломает MCP stdio транспорт. Перехватываем stdout → перенаправляем в stderr.
  let result: unknown;
  const origStdoutWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = (chunk: any, ...args: any[]) => {
    process.stderr.write('[WHISPER_STDOUT] ' + chunk);
    return true;
  };
  try {
    result = await nodewhisper(wavPath, {
      modelName,
      autoDownloadModelName: modelName,   // авто-скачивание модели при первом запуске
      removeWavFileAfterTranscription: false,
      withCuda: false,                    // CPU-режим — работает везде
      whisperOptions: {
        outputInJson: true,
        wordTimestamps: false,
        language: 'auto',                 // автодетект языка
      },
    });
  } catch (whisperErr) {
    // Тихое аудио или video-only stream — возвращаем пустой транскрипт
    const msg = whisperErr instanceof Error ? whisperErr.message : String(whisperErr);
    console.error('[AIM] Whisper: тихое аудио или ошибка транскрипции:', msg);
    return { segments: [], fullText: '', language: 'auto' };
  } finally {
    // Восстанавливаем оригинальный stdout
    process.stdout.write = origStdoutWrite;
  }


  // Нормализуем вывод nodejs-whisper
  let segments: TranscriptSegment[] = [];
  let fullText = '';

  if (Array.isArray(result)) {
    segments = result.map((seg: { start?: number; end?: number; speech?: string; text?: string }) => ({
      start: seg.start ?? 0,
      end: seg.end ?? 0,
      text: (seg.speech ?? seg.text ?? '').trim(),
    })).filter((s: TranscriptSegment) => s.text.length > 0);

    fullText = segments.map((s: TranscriptSegment) => s.text).join(' ');
  } else if (typeof result === 'string') {
    // Fallback: plain text without timestamps
    fullText = result.trim();
    segments = [{ start: 0, end: 0, text: fullText }];
  }

  // Try to detect language from first few characters (basic heuristic)
  const language = detectLanguageHeuristic(fullText);

  return { segments, fullText, language };
}

/**
 * Форматирует транскрипт с таймкодами для передачи в LLM.
 */
export function formatTranscriptForLLM(result: TranscriptResult): string {
  if (result.segments.length === 0) return '(аудио не распознано)';

  return result.segments
    .map(seg => {
      const start = formatTime(seg.start);
      const end = formatTime(seg.end);
      return `[${start} → ${end}] ${seg.text}`;
    })
    .join('\n');
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  return `${String(m).padStart(2, '0')}:${String(Number(s).toFixed(1)).padStart(4, '0')}`;
}

function detectLanguageHeuristic(text: string): string {
  // Simple heuristic: count Cyrillic vs Latin characters
  const cyrillicCount = (text.match(/[\u0400-\u04FF]/g) || []).length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
  if (cyrillicCount > latinCount) return 'ru';
  if (latinCount > cyrillicCount) return 'en';
  return 'auto';
}
