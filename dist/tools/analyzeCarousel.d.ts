/**
 * AIM Instagram Suite — Tool: aim_analyze_carousel
 * Разбор Instagram-карусели: скачать → коллаж-лента → анализ воронки и триггеров.
 */
export interface AnalyzeCarouselInput {
    url: string;
    outputMdPath?: string;
}
export declare function analyzeCarousel(input: AnalyzeCarouselInput): Promise<string>;
//# sourceMappingURL=analyzeCarousel.d.ts.map