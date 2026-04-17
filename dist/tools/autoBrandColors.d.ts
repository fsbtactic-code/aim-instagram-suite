/**
 * AIM CarouselStudio — Tool: aim_auto_brand_colors
 * Кастомизация цветов базовой темы под бренд пользователя.
 */
import { z } from 'zod';
export declare const AutoBrandColorsSchema: z.ZodObject<{
    baseTheme: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>, z.ZodLiteral<5>, z.ZodLiteral<6>, z.ZodLiteral<7>, z.ZodLiteral<8>]>;
    primaryColor: z.ZodString;
    secondaryColor: z.ZodString;
    textColor: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    baseTheme: 1 | 2 | 4 | 5 | 3 | 6 | 7 | 8;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
}, {
    baseTheme: 1 | 2 | 4 | 5 | 3 | 6 | 7 | 8;
    primaryColor: string;
    secondaryColor: string;
    textColor?: string | undefined;
}>;
export type AutoBrandColorsInput = z.infer<typeof AutoBrandColorsSchema>;
export interface BrandColorResult {
    baseTheme: number;
    baseThemeLabel: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    cssOverlay: string;
    previewNote: string;
    usage: string;
}
export declare function autoBrandColors(input: AutoBrandColorsInput): string;
//# sourceMappingURL=autoBrandColors.d.ts.map