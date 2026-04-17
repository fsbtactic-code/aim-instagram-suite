/**
 * AIM Instagram Suite — Core: HTML Renderer v5
 * Puppeteer рендер HTML-слайдов → PNG.
 * Каждая тема получает точные декоративные элементы.
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { randomUUID } from 'crypto';

import { ThemeDefinition, resolveThemeCSS } from './designSystem.js';
import { ExtendedSlideData, renderSlideLayout, LAYOUTS_CSS } from './slideLayouts.js';

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

const FORMATS = {
  square:   { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
};

// ─────────────────────────────────────────────────────────────────────────────
// ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ ПО ТЕМЕ
// ─────────────────────────────────────────────────────────────────────────────
function getThemeDecorators(themeName: string): string {
  switch (themeName) {

    case 'glassmorphism':
      return `
        <div class="aurora-1" aria-hidden="true"></div>
        <div class="aurora-2" aria-hidden="true"></div>
        <div class="aurora-noise" aria-hidden="true"></div>
        <div class="top-accent" aria-hidden="true"></div>
        <svg class="svg-decor" aria-hidden="true" style="position:absolute;bottom:60px;right:40px;width:220px;height:220px;opacity:0.04;z-index:1" viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" stroke="white" stroke-width="1.5"/><circle cx="110" cy="110" r="60" fill="none" stroke="white" stroke-width="1"/><line x1="10" y1="110" x2="210" y2="110" stroke="white" stroke-width="0.5"/><line x1="110" y1="10" x2="110" y2="210" stroke="white" stroke-width="0.5"/></svg>`;

    case 'neo-brutalism':
      return `
        <div class="stripe stripe-1" aria-hidden="true"></div>
        <div class="stripe stripe-2" aria-hidden="true"></div>
        <div class="accent-block" aria-hidden="true"></div>
        <div class="accent-block-2" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:80px;left:50px;width:180px;height:180px;opacity:0.06;z-index:1" viewBox="0 0 180 180"><rect x="10" y="10" width="160" height="160" fill="none" stroke="#F2EF00" stroke-width="3"/><line x1="10" y1="10" x2="170" y2="170" stroke="#F2EF00" stroke-width="2"/><line x1="170" y1="10" x2="10" y2="170" stroke="#F2EF00" stroke-width="2"/></svg>`;

    case 'warm-editorial':
      return `
        <div class="warm-blob-tl" aria-hidden="true"></div>
        <div class="warm-blob-br" aria-hidden="true"></div>
        <div class="warm-blob-tr" aria-hidden="true"></div>
        <div class="grid-overlay" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:90px;right:50px;width:200px;height:200px;opacity:0.035;z-index:1" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="none" stroke="#8B6914" stroke-width="1"/><circle cx="100" cy="100" r="50" fill="none" stroke="#8B6914" stroke-width="0.8"/><circle cx="100" cy="100" r="20" fill="none" stroke="#8B6914" stroke-width="0.6"/></svg>`;

    case 'cyberpunk':
      return `
        <div class="grid-overlay" aria-hidden="true"></div>
        <div class="scan-line" aria-hidden="true"></div>
        <div class="scan-line-v" aria-hidden="true"></div>
        <div class="corner-tl" aria-hidden="true"></div>
        <div class="corner-tr" aria-hidden="true"></div>
        <div class="corner-bl" aria-hidden="true"></div>
        <div class="corner-br" aria-hidden="true"></div>
        <div class="top-accent" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:70px;left:60px;width:160px;height:160px;opacity:0.06;z-index:1" viewBox="0 0 160 160"><polygon points="80,5 155,45 155,115 80,155 5,115 5,45" fill="none" stroke="#00FF41" stroke-width="1.2"/><polygon points="80,30 130,55 130,105 80,130 30,105 30,55" fill="none" stroke="#00FF41" stroke-width="0.8"/></svg>`;

    case 'apple-premium':
      return `
        <div class="glow-orb glow-orb-1" aria-hidden="true"></div>
        <div class="glow-orb glow-orb-2" aria-hidden="true"></div>
        <div class="glow-orb glow-orb-3" aria-hidden="true"></div>
        <div class="grid-overlay" aria-hidden="true"></div>
        <div class="top-accent" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:80px;right:60px;width:240px;height:240px;opacity:0.03;z-index:1" viewBox="0 0 240 240"><circle cx="120" cy="120" r="110" fill="none" stroke="white" stroke-width="0.8"/><circle cx="120" cy="120" r="70" fill="none" stroke="white" stroke-width="0.5"/><circle cx="120" cy="120" r="30" fill="none" stroke="white" stroke-width="0.3"/></svg>`;

    case 'y2k-acid':
      return `
        <div class="blob blob-1" aria-hidden="true"></div>
        <div class="blob blob-2" aria-hidden="true"></div>
        <div class="aurora-noise" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:60px;right:40px;width:200px;height:200px;opacity:0.05;z-index:1" viewBox="0 0 200 200"><path d="M100,10 L190,100 L100,190 L10,100 Z" fill="none" stroke="#FF00FF" stroke-width="1.5"/><circle cx="100" cy="100" r="40" fill="none" stroke="#00FFFF" stroke-width="1"/></svg>`;

    case 'soft-gradient':
      return `
        <div class="warm-blob-tl" aria-hidden="true"></div>
        <div class="warm-blob-br" aria-hidden="true"></div>
        <div class="top-accent" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:80px;right:50px;width:180px;height:180px;opacity:0.04;z-index:1" viewBox="0 0 180 180"><circle cx="90" cy="90" r="80" fill="none" stroke="#6366f1" stroke-width="1"/><line x1="0" y1="90" x2="180" y2="90" stroke="#6366f1" stroke-width="0.5"/><line x1="90" y1="0" x2="90" y2="180" stroke="#6366f1" stroke-width="0.5"/></svg>`;

    // 9 — INK & PAPER
    case 'ink-paper':
      return `
        <div class="ink-rule" aria-hidden="true"></div>
        <div class="top-accent" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:80px;right:60px;width:200px;height:200px;opacity:0.04;z-index:1" viewBox="0 0 200 200"><line x1="0" y1="0" x2="200" y2="200" stroke="#CC0000" stroke-width="1"/><line x1="200" y1="0" x2="0" y2="200" stroke="#CC0000" stroke-width="1"/><circle cx="100" cy="100" r="70" fill="none" stroke="#000" stroke-width="0.8"/></svg>`;

    // 10 — DEEP SPACE
    case 'deep-space':
      return `
        <div class="star-field" aria-hidden="true"></div>
        <div class="glow-orb glow-orb-1" aria-hidden="true"></div>
        <div class="gold-accent-br" aria-hidden="true"></div>
        <div class="top-accent" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:70px;left:50px;width:220px;height:220px;opacity:0.05;z-index:1" viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" stroke="#C9A84C" stroke-width="0.8"/><circle cx="110" cy="110" r="60" fill="none" stroke="#C9A84C" stroke-width="0.6"/><path d="M110,10 L110,210 M10,110 L210,110" stroke="#C9A84C" stroke-width="0.4"/></svg>`;

    // 11 — CONCRETE SWISS
    case 'concrete-swiss':
      return `
        <div class="swiss-top" aria-hidden="true"></div>
        <div class="swiss-grid" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:80px;right:60px;width:160px;height:160px;opacity:0.06;z-index:1" viewBox="0 0 160 160"><line x1="0" y1="80" x2="160" y2="80" stroke="#E30613" stroke-width="2"/><line x1="80" y1="0" x2="80" y2="160" stroke="#E30613" stroke-width="2"/></svg>`;

    // 12 — SAKURA NEON
    case 'sakura-neon':
      return `
        <div class="grid-overlay" aria-hidden="true"></div>
        <div class="blob blob-1" aria-hidden="true"></div>
        <div class="blob blob-2" aria-hidden="true"></div>
        <div class="neon-line-h" aria-hidden="true"></div>
        <div class="neon-line-v" aria-hidden="true"></div>
        <svg aria-hidden="true" style="position:absolute;bottom:60px;right:40px;width:200px;height:200px;opacity:0.06;z-index:1" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="none" stroke="#FF69B4" stroke-width="1"/><circle cx="100" cy="100" r="50" fill="none" stroke="#00E5FF" stroke-width="0.8"/><path d="M100,10 L100,190 M10,100 L190,100" stroke="#FF69B4" stroke-width="0.5"/></svg>`;

    default:
      return `
        <div class="glow-orb glow-orb-1" aria-hidden="true"></div>
        <div class="top-accent" aria-hidden="true"></div>`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN RENDER FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
export async function renderCarousel(
  slides: SlideData[],
  options: RenderOptions,
): Promise<RenderResult> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const puppeteer = require('puppeteer');

  const { width, height } = FORMATS[options.format];
  const { theme, outputDir, brandColorOverlay, customCssOverlay, globalCta } = options;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let css = resolveThemeCSS(theme);
  css += '\n' + LAYOUTS_CSS;
  if (brandColorOverlay) css += '\n' + brandColorOverlay;
  if (customCssOverlay)  css += '\n' + customCssOverlay;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
      '--disable-lcd-text',
    ],
  });

  const totalSlides = slides.length;
  const slidePaths: string[] = [];

  try {
    for (let i = 0; i < slides.length; i++) {
      const slide: SlideData = {
        ...slides[i],
        slideNumber: slides[i].slideNumber ?? i + 1,
        ctaText: slides[i].ctaText ?? globalCta,
      };

      const html = buildSlideHTML(slide, css, theme, width, height, totalSlides);

      const tmpPath = path.join(os.tmpdir(), `aim_slide_${randomUUID()}.html`);
      fs.writeFileSync(tmpPath, html, 'utf-8');

      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.goto(`file://${tmpPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

      // Ждём шрифты
      await Promise.race([
        page.evaluateHandle('document.fonts.ready'),
        new Promise(r => setTimeout(r, 5000)),
      ]);
      await new Promise(r => setTimeout(r, 500));

      const el = await page.$('.slide');
      if (!el) throw new Error(`Слайд ${i + 1}: .slide не найден`);

      const slideFile = `slide_${String(i + 1).padStart(2, '0')}.png`;
      const slidePath = path.join(outputDir, slideFile);
      await el.screenshot({ path: slidePath, type: 'png', omitBackground: false });
      el.dispose();
      await page.close();

      try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }

      slidePaths.push(slidePath);
      console.error(`[AIM] Слайд ${i + 1}/${slides.length} → ${slideFile}`);
    }
  } finally {
    await browser.close();
  }

  return { slidePaths, outputDir, format: options.format, theme: theme.label };
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function buildSlideHTML(
  slide: SlideData,
  css: string,
  theme: ThemeDefinition,
  width: number,
  height: number,
  totalSlides: number,
): string {
  const base = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: ${width}px; height: ${height}px; overflow: hidden;
    }
    :root {
      --slide-width: ${width}px;
      --slide-height: ${height}px;
    }
    h1, h2, h3, .slide-title, .cta-main-title {
      text-wrap: balance; overflow-wrap: break-word; word-break: normal; hyphens: auto;
    }
    p, .slide-body, .check-text, .ba-text, .grid-value, .step-body, .gb-text {
      text-wrap: pretty; overflow-wrap: break-word; word-break: normal; hyphens: auto;
    }
  `;


  if (slide.customHtml) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${theme.googleFontsUrl}" rel="stylesheet">
  <style>${base}${css}</style>
</head>
<body>${slide.customHtml}</body>
</html>`;
  }

  const decorators = getThemeDecorators(theme.name);
  const content = renderSlideLayout(slide, totalSlides);

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${theme.googleFontsUrl}" rel="stylesheet">
  <style>${base}${css}</style>
</head>
<body>
  <div class="slide" data-theme="${theme.name}">
    ${decorators}
    ${content}
  </div>
</body>
</html>`;
}
