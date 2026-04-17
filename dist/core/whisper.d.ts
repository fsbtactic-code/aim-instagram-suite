/**
 * AIM VideoLens — Core: Whisper wrapper
 * Локальная транскрибация через nodejs-whisper (whisper.cpp бинд).
 * Бесплатно, без API, работает офлайн.
 */
export interface TranscriptSegment {
    start: number;
    end: number;
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
export declare function transcribe(wavPath: string, modelName?: 'tiny' | 'base' | 'small' | 'medium'): Promise<TranscriptResult>;
/**
 * Форматирует транскрипт с таймкодами для передачи в LLM.
 */
export declare function formatTranscriptForLLM(result: TranscriptResult): string;
//# sourceMappingURL=whisper.d.ts.map