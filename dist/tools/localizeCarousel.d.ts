/**
 * AIM Instagram Suite — Tool: aim_localize_carousel
 * Скачивает чужую карусель → анализирует → помогает создать свою версию.
 * Поддерживает: прямое копирование, локализацию на RU, адаптацию под свою тему.
 */
export type LocalizeMode = 'copy' | 'localize' | 'adapt';
export interface LocalizeCarouselInput {
    url: string;
    mode: LocalizeMode;
    /** Для mode='adapt': новая тема/ниша */
    targetTopic?: string;
    /** Количество слайдов в новой карусели (по умолчанию как оригинал) */
    slideCount?: number;
    /** Тема дизайна для рендера (1-7) */
    designTheme?: number;
    /** Папка для сохранения PNG */
    outputDir?: string;
}
export declare function localizeCarousel(input: LocalizeCarouselInput): Promise<string>;
//# sourceMappingURL=localizeCarousel.d.ts.map