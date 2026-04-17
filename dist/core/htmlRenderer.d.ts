/**
 * AIM Instagram Suite — Core: HTML Renderer v5
 * Puppeteer рендер HTML-слайдов → PNG.
 * Каждая тема получает точные декоративные элементы.
 */
import { ThemeDefinition } from './designSystem.js';
import { ExtendedSlideData } from './slideLayouts.js';
export type CarouselFormat = 'square' | 'portrait';
export type SlideData = ExtendedSlideData;
export interface RenderOptions {
    theme: ThemeDefinition;
    format: CarouselFormat;
    outputDir: string;
    brandColorOverlay?: string;
    customCssOverlay?: string;
    globalCta?: string;
}
export interface RenderResult {
    slidePaths: string[];
    outputDir: string;
    format: CarouselFormat;
    theme: string;
}
export declare function renderCarousel(slides: SlideData[], options: RenderOptions): Promise<RenderResult>;
//# sourceMappingURL=htmlRenderer.d.ts.map