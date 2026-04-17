/**
 * AIM Instagram Suite — Tool: aim_score_virality
 * Детализированный индекс виральности ВИДЕО по 7 взвешенным критериям.
 * Для каруселей используй aim_score_carousel_virality (отдельный инструмент).
 */
export interface ScoreViralityInput {
    videoPath?: string;
    url?: string;
    /** Дополнительный контекст: ниша, целевая аудитория */
    context?: string;
}
export declare const VIRALITY_WEIGHTS: {
    readonly hook: {
        readonly weight: 0.25;
        readonly label: "🪝 Хук (первые 3 сек)";
        readonly max: 10;
    };
    readonly dynamics: {
        readonly weight: 0.2;
        readonly label: "⚡ Динамика монтажа";
        readonly max: 10;
    };
    readonly audio: {
        readonly weight: 0.15;
        readonly label: "🎵 Звуковое оформление";
        readonly max: 10;
    };
    readonly content: {
        readonly weight: 0.15;
        readonly label: "💡 Ценность контента";
        readonly max: 10;
    };
    readonly emotion: {
        readonly weight: 0.12;
        readonly label: "❤️ Эмоциональный резонанс";
        readonly max: 10;
    };
    readonly visual: {
        readonly weight: 0.08;
        readonly label: "🎨 Визуальное качество";
        readonly max: 10;
    };
    readonly cta: {
        readonly weight: 0.05;
        readonly label: "📢 Призыв к действию";
        readonly max: 10;
    };
};
export type ViralityDimension = keyof typeof VIRALITY_WEIGHTS;
export declare function scoreVirality(input: ScoreViralityInput): Promise<string>;
//# sourceMappingURL=scoreVirality.d.ts.map