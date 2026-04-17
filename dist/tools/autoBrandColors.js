"use strict";
/**
 * AIM CarouselStudio — Tool: aim_auto_brand_colors
 * Кастомизация цветов базовой темы под бренд пользователя.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBrandColorsSchema = void 0;
exports.autoBrandColors = autoBrandColors;
const zod_1 = require("zod");
const designSystem_js_1 = require("../core/designSystem.js");
exports.AutoBrandColorsSchema = zod_1.z.object({
    baseTheme: zod_1.z.union([
        zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3), zod_1.z.literal(4),
        zod_1.z.literal(5), zod_1.z.literal(6), zod_1.z.literal(7), zod_1.z.literal(8),
    ]).describe('Номер базовой темы (1-8)'),
    primaryColor: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe('Основной цвет бренда в HEX (например: #FF5722)'),
    secondaryColor: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe('Вторичный цвет бренда в HEX (например: #FFC107)'),
    textColor: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#FFFFFF')
        .describe('Цвет основного текста в HEX (default: #FFFFFF)'),
});
function autoBrandColors(input) {
    const { baseTheme, primaryColor, secondaryColor, textColor } = input;
    const theme = designSystem_js_1.THEMES[baseTheme];
    if (!theme) {
        return JSON.stringify({
            error: `Тема ${baseTheme} не найдена. Доступны: 1-8`,
        });
    }
    // Генерируем CSS-оверлей
    const cssOverlay = (0, designSystem_js_1.generateBrandColorOverlay)(primaryColor, secondaryColor, textColor ?? '#FFFFFF');
    // Вычисляем контрастность (упрощённо)
    const contrastNote = checkContrast(primaryColor, textColor ?? '#FFFFFF');
    const result = {
        baseTheme,
        baseThemeLabel: theme.label,
        primaryColor,
        secondaryColor,
        textColor: textColor ?? '#FFFFFF',
        cssOverlay,
        previewNote: contrastNote,
        usage: `Используй это при вызове aim_render_premium_carousel, передав параметр brandColorOverlay: <css выше>`,
    };
    return JSON.stringify({
        tool: 'aim_auto_brand_colors',
        result,
        nextStep: `
Отлично! Бренд-цвета готовы.

Теперь используй aim_render_premium_carousel со следующими параметрами:
- theme: ${baseTheme}
- brandColorOverlay: [CSS из result.cssOverlay]

Или скажи мне: "Создай карусель по этим цветам" — и я сделаю всё за тебя.
    `.trim(),
    }, null, 2);
}
/**
 * Упрощённая проверка контрастности (WCAG AA)
 */
function checkContrast(bgHex, textHex) {
    const bg = hexToRelativeLuminance(bgHex);
    const text = hexToRelativeLuminance(textHex);
    const lighter = Math.max(bg, text);
    const darker = Math.min(bg, text);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    if (ratio >= 4.5)
        return `✅ Контраст ${ratio.toFixed(1)}:1 — отлично для текста`;
    if (ratio >= 3)
        return `⚠️ Контраст ${ratio.toFixed(1)}:1 — достаточно для крупного текста`;
    return `❌ Контраст ${ratio.toFixed(1)}:1 — слишком низкий. Измените текст или фон.`;
}
function hexToRelativeLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
//# sourceMappingURL=autoBrandColors.js.map