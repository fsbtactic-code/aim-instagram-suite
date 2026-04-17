/**
 * AIM VideoLens — Tool: aim_analyze_viral_reels
 * Реверс-инжиниринг вирального контента конкурентов.
 * Пайплайн: yt-dlp → Whisper → Grid → Структурированный .md отчет
 */
export interface AnalyzeViralReelsInput {
    url: string;
    outputMdPath: string;
}
export declare function analyzeViralReels(input: AnalyzeViralReelsInput): Promise<string>;
//# sourceMappingURL=analyzeViralReels.d.ts.map