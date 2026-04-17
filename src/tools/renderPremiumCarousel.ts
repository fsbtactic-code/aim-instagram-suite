/**
 * AIM Instagram Suite — Tool: aim_render_premium_carousel
 * v2: поддержка 10 лейаутов, CTA-баннер, globalCta.
 */

import * as fs from 'fs';
import { z } from 'zod';

import { THEMES, ThemeId, getTheme } from '../core/designSystem.js';
import { renderCarousel, SlideData, CarouselFormat } from '../core/htmlRenderer.js';
import { SlideLayout } from '../core/slideLayouts.js';

const LAYOUT_IDS: [SlideLayout, ...SlideLayout[]] = [
  'standard', 'hero-number', 'grid-2x2', 'good-bad',
  'before-after', 'steps-3', 'quote', 'checklist', 'comparison', 'cta-final',
];

export const RenderPremiumCarouselSchema = z.object({
  slidesData: z.union([
    z.string().describe('JSON-строка с массивом слайдов'),
    z.array(z.object({
      slideNumber:  z.number().optional(),
      layout:       z.enum(LAYOUT_IDS).optional(),
      title:        z.string(),
      subtitle:     z.string().optional(),
      body:         z.string().optional(),
      emoji:        z.string().optional(),
      tag:          z.string().optional(),
      ctaText:      z.string().optional(),
      heroNumber:   z.string().optional(),
      heroUnit:     z.string().optional(),
      quoteText:    z.string().optional(),
      quoteAuthor:  z.string().optional(),
      blocks:       z.array(z.object({ label: z.string().optional(), value: z.string(), accent: z.boolean().optional() })).optional(),
      leftBlocks:   z.array(z.object({ label: z.string().optional(), value: z.string(), accent: z.boolean().optional() })).optional(),
      rightBlocks:  z.array(z.object({ label: z.string().optional(), value: z.string(), accent: z.boolean().optional() })).optional(),
      customHtml:   z.string().optional(),
    })).describe('Массив объектов слайдов'),
  ]),
  theme: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4),
    z.literal(5), z.literal(6), z.literal(7), z.literal(8),
    z.literal(9), z.literal(10), z.literal(11), z.literal(12),
  ]).describe(`Номер темы (1-12):
1  = Aurora Glassmorphism — тёмный, purple aurora, frosted glass
2  = Neo-Brutalism RAW    — кислотный жёлтый #F2EF00, агрессия, floating card
3  = Warm Editorial ⭐     — кремовый, dot-grid, персик — КАК В РЕФЕРЕНСЕ
4  = Matrix Cyberpunk     — чёрный матрикс, neon-зелёный #00FF41
5  = Obsidian Premium     — почти чёрный, градиентный заголовок, glow
6  = Chrome Y2K           — хромированный ретрофутуризм, кислота
7  = Soft Gradient        — лавандовый, белая glass-карточка, пастель
8  = Custom Brand         — кастомный (передай customCssOverlay)
9  = Ink & Paper 🆕        — чистый белый, красный акцент, editorial serif
10 = Deep Space 🆕         — тёмно-синий, золото, star-field, luxury
11 = Concrete Swiss 🆕     — светло-серый, signal-red, Swiss grid, Unbounded
12 = Sakura Neon 🆕        — чёрный, pink #FF2882 + cyan #00E5FF, Tokyo night`),

  format: z.enum(['square', 'portrait']).default('square')
    .describe('square=1080x1080 | portrait=1080x1350'),
  outputDir: z.string().describe('Папка для PNG (напр. C:\\Users\\Alina\\Desktop\\carousel)'),
  globalCta: z.string().optional()
    .describe('CTA-текст на каждый слайд снизу (напр. "Напиши СЛОВО — пришлю в директ")'),
  brandColorOverlay: z.string().optional().describe('CSS из aim_auto_brand_colors'),
  customCssOverlay:  z.string().optional().describe('Кастомный CSS (для темы 8)'),
});

export type RenderPremiumCarouselInput = z.infer<typeof RenderPremiumCarouselSchema>;

export async function renderPremiumCarousel(input: RenderPremiumCarouselInput): Promise<string> {
  const { slidesData, theme, format, outputDir, globalCta, brandColorOverlay, customCssOverlay } = input;

  // ── Парсинг слайдов ─────────────────────────────────────────────────────────
  let slides: SlideData[];
  try {
    let raw: SlideData[];
    if (typeof slidesData === 'string') {
      let cleanData = slidesData.trim();
      // Убираем обертки ```json и ```
      if (cleanData.startsWith('```')) {
        cleanData = cleanData.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      }
      const parsed = JSON.parse(cleanData);
      raw = Array.isArray(parsed) ? parsed : (parsed.slides ?? parsed);
    } else {
      raw = slidesData as SlideData[];
    }
    slides = raw.map((s, i) => ({ ...s, slideNumber: s.slideNumber ?? i + 1 }));
  } catch (e) {
    return JSON.stringify({
      error: 'Не удалось разобрать slidesData. Убедитесь что это валидный JSON.',
      hint: 'Сначала используй aim_draft_carousel_structure для создания структуры.',
      parseError: String(e),
    });
  }

  if (slides.length === 0) return JSON.stringify({ error: 'Массив слайдов пустой.' });

  // ── Тема ────────────────────────────────────────────────────────────────────
  const themeDefinition = getTheme(theme as ThemeId);
  if (!themeDefinition) return JSON.stringify({ error: `Тема ${theme} не найдена` });

  if (theme === 8 && !customCssOverlay) {
    // Custom Brand — uses base of theme 1 if no overlay provided
  }

  // ── Проверяем папку ─────────────────────────────────────────────────────────
  try {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  } catch (e) {
    return JSON.stringify({
      error: `Не удалось создать папку: ${outputDir}`,
      detail: String(e),
    });
  }

  console.error(`[AIM] Рендеринг ${slides.length} слайдов | тема ${themeDefinition.label}`);
  console.error(`[AIM] Формат: ${format} | CTA: ${globalCta ?? 'нет глобального'}`);

  // ── Рендер ──────────────────────────────────────────────────────────────────
  try {
    const result = await renderCarousel(slides, {
      theme: themeDefinition,
      format: format as CarouselFormat,
      outputDir,
      globalCta,
      brandColorOverlay,
      customCssOverlay,
    });

    const layoutsUsed = [...new Set(slides.map(s => (s as SlideData & { layout?: string }).layout ?? 'standard'))];

    return JSON.stringify({
      tool: 'aim_render_premium_carousel',
      success: true,
      summary: `✅ ${result.slidePaths.length} слайдов отрендерено`,
      theme: result.theme,
      format: result.format,
      outputDir: result.outputDir,
      slideCount: result.slidePaths.length,
      layoutsUsed,
      files: result.slidePaths,
      quickActions: [
        '→ 1. Оценить виральность карусели: aim_score_carousel_virality с slidesDir=' + outputDir,
        '→ 2. Перерендерить с другой темой (1-12). Новые: 9=Ink&Paper, 10=DeepSpace, 11=Swiss, 12=SakuraNeon',
        '→ 3. Изменить CTA-текст через globalCta',
        '→ 4. Добавить лейаут hero-number / quote / grid-2x2 к нужным слайдам',
        '→ 5. Применить цвета бренда: aim_auto_brand_colors',
        '→ 6. Переключить format: portrait (1080×1350) для Instagram feed формата 4:5',
      ],
    }, null, 2);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      error: `Ошибка рендеринга: ${message}`,
      hint: 'Проверьте что Puppeteer установлен (npm install). Google Chrome скачивается автоматически.',
      outputDir,
    });
  }
}

export function listAvailableThemes(): string {
  const themes = Object.values(THEMES).map(t => ({
    id: t.id,
    name: t.label,
    fonts: t.googleFontsUrl.match(/family=([^&:]+)/g)?.map(f => f.replace('family=', '').replace(/\+/g, ' ')) ?? [],
  }));
  return JSON.stringify({
    availableThemes: themes,
    availableLayouts: [
      { id: 'standard',     description: 'Классика: эмодзи → заголовок → текст → тег' },
      { id: 'hero-number',  description: 'Большая цифра/статистика по центру (120px)' },
      { id: 'grid-2x2',     description: '4 блока сеткой 2×2 — идеально для сравнений и фактов' },
      { id: 'good-bad',     description: 'Сплит ✅ Правильно / ❌ Ошибка бок о бок' },
      { id: 'before-after', description: 'ДО → ПОСЛЕ (вертикальный сплит)' },
      { id: 'steps-3',      description: 'Три шага в ряд с пронумерованными кругами' },
      { id: 'quote',        description: 'Полноэкранная цитата с большими кавычками' },
      { id: 'checklist',    description: 'Вертикальный чек-лист с иконками' },
      { id: 'comparison',   description: 'Таблица сравнения A vs B' },
      { id: 'cta-final',    description: 'Финальный слайд с большим CTA-призывом' },
    ],
  }, null, 2);
}
