/**
 * AIM Instagram Suite — Core: HTML Renderer
 * Puppeteer-рендер HTML-слайдов в PNG.
 * v2: поддержка 10 лейаутов + CTA-баннер на каждом слайде.
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { randomUUID } from 'crypto';

import { ThemeDefinition, resolveThemeCSS } from './designSystem.js';
import { ExtendedSlideData, renderSlideLayout, LAYOUTS_CSS } from './slideLayouts.js';

export type CarouselFormat = 'square' | 'portrait';

/**
 * SlideData — базовый интерфейс (обратная совместимость).
 * Для новых лейаутов используй ExtendedSlideData напрямую.
 */
export type SlideData = ExtendedSlideData;

export interface RenderOptions {
  theme: ThemeDefinition;
  format: CarouselFormat;
  outputDir: string;
  brandColorOverlay?: string;
  customCssOverlay?: string;
  /** Глобальный CTA текст — отображается на всех слайдах если не задан в слайде */
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

/**
 * Рендерит массив слайдов в PNG-файлы через Puppeteer.
 */
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

  // Собираем финальный CSS: тема + лейауты + бренд-оверлей + кастом
  let themeCSS = resolveThemeCSS(theme);
  themeCSS += '\n' + LAYOUTS_CSS;
  if (brandColorOverlay) themeCSS += '\n' + brandColorOverlay;
  if (customCssOverlay)  themeCSS += '\n' + customCssOverlay;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
  });

  const slidePaths: string[] = [];

  try {
    for (let i = 0; i < slides.length; i++) {
      const slide: SlideData = {
        ...slides[i],
        slideNumber: slides[i].slideNumber ?? i + 1,
        // Наследуем globalCta если у слайда нет своего
        ctaText: slides[i].ctaText ?? globalCta,
      };

      const html = buildSlideHTML(slide, themeCSS, theme.googleFontsUrl, width, height);

      const tmpHtmlPath = path.join(os.tmpdir(), `aim_slide_${randomUUID()}.html`);
      fs.writeFileSync(tmpHtmlPath, html, 'utf-8');

      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.goto(`file://${tmpHtmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

      // ⚡ КРИТИЧНО: ждём все шрифты (кириллица), но не дольше 3 секунд
      await Promise.race([
        page.evaluateHandle('document.fonts.ready'),
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);
      await new Promise(resolve => setTimeout(resolve, 300));

      const slideElement = await page.$('.slide');
      if (!slideElement) {
        throw new Error(`Слайд ${i + 1}: .slide не найден`);
      }

      const slideFileName = `slide_${String(i + 1).padStart(2, '0')}.png`;
      const slidePath = path.join(outputDir, slideFileName);

      await slideElement.screenshot({ path: slidePath, type: 'png', omitBackground: false });
      slideElement.dispose();
      await page.close();

      try { fs.unlinkSync(tmpHtmlPath); } catch { /* ignore */ }

      slidePaths.push(slidePath);
      console.error(`[AIM] Слайд ${i + 1}/${slides.length} → ${slideFileName}`);
    }
  } finally {
    await browser.close();
  }

  return { slidePaths, outputDir, format: options.format, theme: theme.label };
}

/**
 * Строит полный HTML-документ для одного слайда.
 */
function buildSlideHTML(
  slide: SlideData,
  css: string,
  fontsUrl: string,
  width: number,
  height: number,
): string {
  const autoFitScript = `
  <script>
    (function autoFit() {
      const title = document.querySelector('.slide-title, h1, .cta-main-title');
      if (title) {
        let size = parseInt(window.getComputedStyle(title).fontSize) || 80;
        while((title.clientHeight > window.innerHeight * 0.45 || document.body.scrollHeight > window.innerHeight + 10) && size > 30) {
          size -= 2;
          title.style.setProperty('font-size', size + 'px', 'important');
          title.style.setProperty('line-height', '1.1', 'important');
        }
      }
      
      const bodies = document.querySelectorAll('.slide-body, p, .check-text, .cmp-cell, .step-body, .card-text');
      bodies.forEach(b => {
        let size = parseInt(window.getComputedStyle(b).fontSize) || 30;
        while(document.body.scrollHeight > window.innerHeight + 10 && size > 16) {
          size -= 1;
          b.style.setProperty('font-size', size + 'px', 'important');
        }
      });
      
      const container = document.querySelector('.glass-card') || document.querySelector('.slide');
      if (container && document.body.scrollHeight > window.innerHeight + 10) {
         let scale = 1.0;
         while(document.body.scrollHeight > window.innerHeight + 10 && scale > 0.5) {
            scale -= 0.05;
            container.style.transform = 'scale(' + scale + ')';
            container.style.transformOrigin = 'center center';
         }
      }
    })();
  </script>`;

  // Кастомный HTML (полное переопределение)
  if (slide.customHtml) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --slide-width: ${width}px; --slide-height: ${height}px; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
    ${css}
  </style>
</head>
<body>${slide.customHtml}
${autoFitScript}
</body>
</html>`;
  }

  // Через систему лейаутов
  const innerHTML = renderSlideLayout(slide);

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --slide-width: ${width}px; --slide-height: ${height}px; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
    ${css}
  </style>
</head>
<body>
  <div class="slide">
    <div class="accent-block"   aria-hidden="true"></div>
    <div class="scan-line"      aria-hidden="true"></div>
    <div class="corner-tl"      aria-hidden="true"></div>
    <div class="corner-br"      aria-hidden="true"></div>
    <div class="glow-orb"       aria-hidden="true"></div>
    <div class="decorative-line" aria-hidden="true"></div>
    <div class="top-accent"     aria-hidden="true"></div>
    <div class="sidebar-accent" aria-hidden="true"></div>
    <div class="chrome-bg"      aria-hidden="true"></div>
    <div class="blob blob-1"    aria-hidden="true"></div>
    <div class="blob blob-2"    aria-hidden="true"></div>
    ${innerHTML}
  </div>
  ${autoFitScript}
</body>
</html>`;
}
