/**
 * AIM Instagram Suite — Tool: aim_render_premium_carousel
 * v2: поддержка 10 лейаутов, CTA-баннер, globalCta.
 */
import { z } from 'zod';
import { SlideLayout } from '../core/slideLayouts.js';
export declare const RenderPremiumCarouselSchema: z.ZodObject<{
    slidesData: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodObject<{
        slideNumber: z.ZodOptional<z.ZodNumber>;
        layout: z.ZodOptional<z.ZodEnum<[SlideLayout, ...SlideLayout[]]>>;
        title: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodString>;
        tag: z.ZodOptional<z.ZodString>;
        ctaText: z.ZodOptional<z.ZodString>;
        heroNumber: z.ZodOptional<z.ZodString>;
        heroUnit: z.ZodOptional<z.ZodString>;
        quoteText: z.ZodOptional<z.ZodString>;
        quoteAuthor: z.ZodOptional<z.ZodString>;
        blocks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
            accent: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }, {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }>, "many">>;
        leftBlocks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
            accent: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }, {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }>, "many">>;
        rightBlocks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
            accent: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }, {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }>, "many">>;
        customHtml: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        subtitle?: string | undefined;
        body?: string | undefined;
        emoji?: string | undefined;
        tag?: string | undefined;
        ctaText?: string | undefined;
        heroNumber?: string | undefined;
        heroUnit?: string | undefined;
        blocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        leftBlocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        rightBlocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        quoteText?: string | undefined;
        quoteAuthor?: string | undefined;
        slideNumber?: number | undefined;
        layout?: SlideLayout | undefined;
        customHtml?: string | undefined;
    }, {
        title: string;
        subtitle?: string | undefined;
        body?: string | undefined;
        emoji?: string | undefined;
        tag?: string | undefined;
        ctaText?: string | undefined;
        heroNumber?: string | undefined;
        heroUnit?: string | undefined;
        blocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        leftBlocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        rightBlocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        quoteText?: string | undefined;
        quoteAuthor?: string | undefined;
        slideNumber?: number | undefined;
        layout?: SlideLayout | undefined;
        customHtml?: string | undefined;
    }>, "many">]>;
    theme: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>, z.ZodLiteral<5>, z.ZodLiteral<6>, z.ZodLiteral<7>, z.ZodLiteral<8>, z.ZodLiteral<9>, z.ZodLiteral<10>, z.ZodLiteral<11>, z.ZodLiteral<12>]>;
    format: z.ZodDefault<z.ZodEnum<["square", "portrait"]>>;
    outputDir: z.ZodString;
    globalCta: z.ZodOptional<z.ZodString>;
    brandColorOverlay: z.ZodOptional<z.ZodString>;
    customCssOverlay: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    theme: 1 | 2 | 4 | 5 | 10 | 3 | 6 | 7 | 8 | 9 | 11 | 12;
    outputDir: string;
    format: "square" | "portrait";
    slidesData: string | {
        title: string;
        subtitle?: string | undefined;
        body?: string | undefined;
        emoji?: string | undefined;
        tag?: string | undefined;
        ctaText?: string | undefined;
        heroNumber?: string | undefined;
        heroUnit?: string | undefined;
        blocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        leftBlocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        rightBlocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        quoteText?: string | undefined;
        quoteAuthor?: string | undefined;
        slideNumber?: number | undefined;
        layout?: SlideLayout | undefined;
        customHtml?: string | undefined;
    }[];
    brandColorOverlay?: string | undefined;
    customCssOverlay?: string | undefined;
    globalCta?: string | undefined;
}, {
    theme: 1 | 2 | 4 | 5 | 10 | 3 | 6 | 7 | 8 | 9 | 11 | 12;
    outputDir: string;
    slidesData: string | {
        title: string;
        subtitle?: string | undefined;
        body?: string | undefined;
        emoji?: string | undefined;
        tag?: string | undefined;
        ctaText?: string | undefined;
        heroNumber?: string | undefined;
        heroUnit?: string | undefined;
        blocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        leftBlocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        rightBlocks?: {
            value: string;
            label?: string | undefined;
            accent?: boolean | undefined;
        }[] | undefined;
        quoteText?: string | undefined;
        quoteAuthor?: string | undefined;
        slideNumber?: number | undefined;
        layout?: SlideLayout | undefined;
        customHtml?: string | undefined;
    }[];
    brandColorOverlay?: string | undefined;
    customCssOverlay?: string | undefined;
    globalCta?: string | undefined;
    format?: "square" | "portrait" | undefined;
}>;
export type RenderPremiumCarouselInput = z.infer<typeof RenderPremiumCarouselSchema>;
export declare function renderPremiumCarousel(input: RenderPremiumCarouselInput): Promise<string>;
export declare function listAvailableThemes(): string;
//# sourceMappingURL=renderPremiumCarousel.d.ts.map