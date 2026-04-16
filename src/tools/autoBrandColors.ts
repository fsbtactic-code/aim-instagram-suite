/**
 * AIM CarouselStudio — Tool: aim_auto_brand_colors
 * Кастомизация цветов базовой темы под бренд пользователя.
 */

import { z } from 'zod';
import { THEMES, ThemeId, generateBrandColorOverlay } from '../core/designSystem.js';

export const AutoBrandColorsSchema = z.object({
  baseTheme: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4),
    z.literal(5), z.literal(6), z.literal(7), z.literal(8),
  ]).describe('Номер базовой темы (1-8)'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe('Основной цвет бренда в HEX (например: #FF5722)'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe('Вторичный цвет бренда в HEX (например: #FFC107)'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#FFFFFF')
    .describe('Цвет основного текста в HEX (default: #FFFFFF)'),
});

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

export function autoBrandColors(input: AutoBrandColorsInput): string {
  const { baseTheme, primaryColor, secondaryColor, textColor } = input;

  const theme = THEMES[baseTheme as ThemeId];
  if (!theme) {
    return JSON.stringify({
      error: `Тема ${baseTheme} не найдена. Доступны: 1-8`,
    });
  }

  // Генерируем CSS-оверлей
  const cssOverlay = generateBrandColorOverlay(primaryColor, secondaryColor, textColor ?? '#FFFFFF');

  // Вычисляем контрастность (упрощённо)
  const contrastNote = checkContrast(primaryColor, textColor ?? '#FFFFFF');

  const result: BrandColorResult = {
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
function checkContrast(bgHex: string, textHex: string): string {
  const bg = hexToRelativeLuminance(bgHex);
  const text = hexToRelativeLuminance(textHex);
  const lighter = Math.max(bg, text);
  const darker = Math.min(bg, text);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  if (ratio >= 4.5) return `✅ Контраст ${ratio.toFixed(1)}:1 — отлично для текста`;
  if (ratio >= 3) return `⚠️ Контраст ${ratio.toFixed(1)}:1 — достаточно для крупного текста`;
  return `❌ Контраст ${ratio.toFixed(1)}:1 — слишком низкий. Измените текст или фон.`;
}

function hexToRelativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
