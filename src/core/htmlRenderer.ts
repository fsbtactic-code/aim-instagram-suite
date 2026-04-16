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
      
      // Capture debug messages from browser
      page.on('console', (msg: any) => {
        const text = msg.text();
        if (text.startsWith('[AIM-DEBUG]')) {
          console.warn(`\x1b[33m${text}\x1b[0m`);
        }
      });

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
      const container = document.querySelector('.glass-card') || document.querySelector('.slide') || document.body;
      const getContainerOverflow = () => {
         // Для .slide (поскольку он height: 100%)
         if (container.classList.contains('slide')) {
           return (container.scrollHeight > container.clientHeight + 5) || (container.scrollWidth > container.clientWidth + 5);
         }
         // Для .glass-card (может и не иметь фикс высоты, поэтому смотрим на родительский .slide)
         const parentSlide = container.closest('.slide');
         if (parentSlide) {
           return (parentSlide.scrollHeight > parentSlide.clientHeight + 5) || (parentSlide.scrollWidth > parentSlide.clientWidth + 5);
         }
         return (document.body.scrollHeight > window.innerHeight + 5) || (document.body.scrollWidth > window.innerWidth + 5);
      };

      // 1. Фикс для заголовков (высота + ширина)
      const title = document.querySelector('.slide-title, h1, .cta-main-title');
      if (title) {
        let size = parseInt(window.getComputedStyle(title).fontSize) || 80;
        let p = title.parentElement;
        while((title.clientHeight > window.innerHeight * 0.45 || 
               title.scrollWidth > (title.clientWidth || (p && p.clientWidth) || window.innerWidth * 0.85)) && size > 40) {
          size -= 2;
          title.style.setProperty('font-size', size + 'px', 'important');
          title.style.setProperty('line-height', '1.1', 'important');
        }
      }
      
      // 2. Фикс для текстов
      const bodies = document.querySelectorAll('.slide-body, p, .check-text, .cmp-cell, .step-body, .card-text');
      bodies.forEach(b => {
        let size = parseInt(window.getComputedStyle(b).fontSize) || 30;
        let pw = b.parentElement ? b.parentElement.clientWidth : window.innerWidth;
        while((b.scrollWidth > (b.clientWidth || pw)) && size > 24) {
          size -= 1;
          b.style.setProperty('font-size', size + 'px', 'important');
        }
      });
      
      // 3. Финальный глобальный скейлинг всей карточки
      if (container) {
         let scale = 1.0;
         while(getContainerOverflow() && scale > 0.5) {
            scale -= 0.05;
            container.style.zoom = scale;
         }
         // Debug log for Claude if it still overflows
         if (getContainerOverflow()) {
            console.log('[AIM-DEBUG] Layout Overflow on Slide ' + ${slide.slideNumber} + ': scrollHeight=' + container.scrollHeight + ', clientHeight=' + container.clientHeight + ' | scrollWidth=' + container.scrollWidth + ', clientWidth=' + container.clientWidth);
         }
      }
    })();
  </script>`;

  // Базовый глобальный CSS для защиты верстки
  const typographyProtection = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
    h1, h2, h3, .slide-title, .cta-main-title {
      text-wrap: balance; /* Магическое свойство для красивых переносов заголовков */
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    }
    p, .slide-body, .check-text {
      text-wrap: pretty; /* Избавляет от висячих 'вдов' в последней строке текста */
      overflow-wrap: break-word;
    }
    :root { --slide-width: ${width}px; --slide-height: ${height}px; }
  `;

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
    ${typographyProtection}
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
    ${typographyProtection}
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
