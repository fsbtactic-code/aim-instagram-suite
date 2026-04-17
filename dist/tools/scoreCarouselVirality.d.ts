/**
 * AIM Instagram Suite — Tool: aim_score_carousel_virality
 * Скоринг виральности КАРУСЕЛИ по 6 критериям со своими весами.
 * Критерии специфичны для формата карусели (не видео).
 */
export interface ScoreCarouselViralityInput {
    /** URL карусели для скачивания и анализа */
    url?: string;
    /** Или путь к папке с изображениями слайдов */
    slidesDir?: string;
    /** Контекст: ниша, цель (продажи, подписка, охват) */
    context?: string;
    /** Цель карусели */
    goal?: 'sales' | 'subscribers' | 'reach' | 'engagement' | 'trust';
}
export declare const CAROUSEL_VIRALITY_WEIGHTS: {
    readonly hookSlide: {
        readonly weight: 0.25;
        readonly label: "🎯 Первый слайд (Хук)";
        readonly max: 10;
    };
    readonly funnel: {
        readonly weight: 0.22;
        readonly label: "🔀 Воронка (AIDA структура)";
        readonly max: 10;
    };
    readonly design: {
        readonly weight: 0.18;
        readonly label: "🎨 Дизайн и читаемость";
        readonly max: 10;
    };
    readonly contentValue: {
        readonly weight: 0.17;
        readonly label: "💡 Ценность контента";
        readonly max: 10;
    };
    readonly triggers: {
        readonly weight: 0.1;
        readonly label: "❤️ Триггеры и эмоции";
        readonly max: 10;
    };
    readonly cta: {
        readonly weight: 0.08;
        readonly label: "📢 Последний слайд (CTA)";
        readonly max: 10;
    };
};
export declare function scoreCarouselVirality(input: ScoreCarouselViralityInput): Promise<string>;
//# sourceMappingURL=scoreCarouselVirality.d.ts.map