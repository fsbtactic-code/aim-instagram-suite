/**
 * AIM Instagram Suite — Design System v5 ULTRA
 * 12 premium themes. Portrait-first (1080×1350). Body-text readability focus.
 *
 * ТИПОГРАФИЧЕСКАЯ ШКАЛА (1080px):
 *   title     : 90-96px / weight 900 / lh 0.96 / ls -3px
 *   subtitle  : 28px    / weight 600 / lh 1.40
 *   body      : 28px    / weight 400 / lh 1.78 / ls 0.01em
 *   tag/label : 14px    / weight 700 / UPPERCASE / ls 0.10em
 *   slide-num : 13px    / weight 700 / MONO      / ls 0.18em
 */
export type ThemeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface ThemeDefinition {
    id: ThemeId;
    name: string;
    label: string;
    googleFontsUrl: string;
    css: string;
}
export declare const THEMES: Record<ThemeId, ThemeDefinition>;
export declare function getTheme(id: ThemeId): ThemeDefinition;
export declare function resolveThemeCSS(theme: ThemeDefinition, customCss?: string): string;
export declare function generateBrandColorOverlay(primary: string, secondary: string, text?: string): string;
export declare function listAvailableFonts(): string[];
//# sourceMappingURL=designSystem.d.ts.map