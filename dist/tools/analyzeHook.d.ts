/**
 * AIM VideoLens — Tool: aim_analyze_hook
 * Оценщик хука: анализирует первые 5 секунд видео.
 * Пайплайн: trimVideo(5s) → Whisper → Scene Grid 2x2 → 5 вариантов усиления
 */
export interface AnalyzeHookInput {
    videoPath?: string;
    url?: string;
}
export declare function analyzeHook(input: AnalyzeHookInput): Promise<string>;
//# sourceMappingURL=analyzeHook.d.ts.map