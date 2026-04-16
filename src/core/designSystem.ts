/**
 * AIM CarouselStudio — Core: Design System
 * 7 премиальных тем + кастомная (тема 8).
 * Все шрифты поддерживают кириллицу (subset=cyrillic).
 */

export type ThemeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ThemeName =
  | 'glassmorphism'
  | 'neo-brutalism'
  | 'minimalist'
  | 'cyberpunk'
  | 'apple-premium'
  | 'y2k-acid'
  | 'edtech'
  | 'custom';

export interface ThemeDefinition {
  id: ThemeId;
  name: ThemeName;
  label: string;
  description: string;
  googleFontsUrl: string;
  css: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 1: Glassmorphism
// ─────────────────────────────────────────────────────────────────────────────
const glassmorphismCSS = `
  @import url('{{FONTS_URL}}');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 150px 140px;
    position: relative;
    overflow: hidden;
    font-family: 'Golos Text', 'Inter', sans-serif;
    color: #ffffff;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%);
  }

  .slide::before {
    content: '';
    position: absolute;
    width: 1250px; height: 1250px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%);
    top: -375px; right: -375px;
    pointer-events: none;
  }
  .slide::after {
    content: '';
    position: absolute;
    width: 1000px; height: 1000px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%);
    bottom: -250px; left: -250px;
    pointer-events: none;
  }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 100%;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(60px);
    -webkit-backdrop-filter: blur(60px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 70px;
    padding: 125px 110px;
    box-shadow: 0 20px 100px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.12);
    text-align: center;
  }

  .slide-number {
    font-size: 33px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(139,92,246,0.9);
    margin-bottom: 50px;
  }

  .emoji-icon {
    font-size: 130px;
    margin-bottom: 50px;
    display: block;
    filter: drop-shadow(0 4px 30px rgba(139,92,246,0.5));
  }

  .slide-title {
    font-size: 90px;
    font-weight: 700;
    line-height: 1.25;
    color: #ffffff;
    margin-bottom: 45px;
    text-shadow: 0 2px 50px rgba(139,92,246,0.4);
  }

  .slide-subtitle {
    font-size: 48px;
    font-weight: 500;
    color: rgba(139,92,246,0.95);
    margin-bottom: 40px;
    letter-spacing: 0.5px;
  }

  .slide-body {
    font-size: 46px;
    font-weight: 400;
    line-height: 1.7;
    color: rgba(255,255,255,0.75);
  }

  .tag {
    display: inline-block;
    background: rgba(139,92,246,0.2);
    border: 1px solid rgba(139,92,246,0.4);
    border-radius: 125px;
    padding: 15px 40px;
    font-size: 33px;
    color: rgba(139,92,246,0.95);
    margin-top: 50px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 2: Neo-Brutalism
// ─────────────────────────────────────────────────────────────────────────────
const neoBrutalismCSS = `
  @import url('{{FONTS_URL}}');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 160px 150px;
    position: relative;
    overflow: hidden;
    font-family: 'Unbounded', 'Space Grotesk', sans-serif;
    background: #F5F000;
  }

  .accent-block {
    position: absolute;
    top: 0; right: 0;
    width: 550px; height: 550px;
    background: #FF2D55;
    border-left: 5px solid #000;
    border-bottom: 5px solid #000;
  }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 100%;
    background: #fff;
    border: 4px solid #000;
    border-radius: 0;
    padding: 110px 100px;
    box-shadow: 20px 20px 0 #000;
  }

  .slide-number {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #000;
    margin-bottom: 35px;
    background: #FF2D55;
    display: inline-block;
    padding: 4px 30px;
  }

  .emoji-icon {
    font-size: 120px;
    margin-bottom: 40px;
    display: block;
  }

  .slide-title {
    font-size: 83px;
    font-weight: 900;
    line-height: 1.15;
    color: #000;
    margin-bottom: 40px;
    text-transform: uppercase;
    word-break: break-word;
  }

  .slide-subtitle {
    font-size: 46px;
    font-weight: 800;
    color: #FF2D55;
    margin-bottom: 35px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .slide-body {
    font-size: 41px;
    font-weight: 500;
    line-height: 1.6;
    color: #111;
    border-left: 4px solid #000;
    padding-left: 35px;
  }

  .tag {
    display: inline-block;
    background: #F5F000;
    border: 3px solid #000;
    border-radius: 0;
    padding: 15px 35px;
    font-size: 30px;
    font-weight: 800;
    color: #000;
    margin-top: 45px;
    text-transform: uppercase;
    box-shadow: 3px 3px 0 #000;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 3: Minimalist Elegance
// ─────────────────────────────────────────────────────────────────────────────
const minimalistCSS = `
  @import url('{{FONTS_URL}}');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 200px 190px;
    position: relative;
    overflow: hidden;
    background: #FAF8F5;
  }

  .decorative-line {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: linear-gradient(to bottom, #C9A96E, #E8D5B0);
  }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 100%;
    background: transparent;
    padding: 0;
  }

  .slide-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 120px;
    font-weight: 300;
    font-style: italic;
    color: rgba(201,169,110,0.35);
    line-height: 1;
    margin-bottom: 30px;
    display: block;
  }

  .emoji-icon {
    font-size: 100px;
    margin-bottom: 45px;
    display: block;
    opacity: 0.85;
  }

  .slide-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 103px;
    font-weight: 600;
    font-style: italic;
    line-height: 1.2;
    color: #2C2416;
    margin-bottom: 50px;
  }

  .slide-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 39px;
    font-weight: 600;
    color: #C9A96E;
    margin-bottom: 40px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .slide-body {
    font-family: 'Montserrat', sans-serif;
    font-size: 41px;
    font-weight: 400;
    line-height: 1.85;
    color: #5C5040;
  }

  .divider {
    width: 125px;
    height: 1px;
    background: #C9A96E;
    margin: 50px 0;
  }

  .tag {
    display: inline-block;
    border: 1px solid #C9A96E;
    border-radius: 2px;
    padding: 5px 35px;
    font-family: 'Montserrat', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #C9A96E;
    margin-top: 45px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 4: Dark Cyberpunk
// ─────────────────────────────────────────────────────────────────────────────
const cyberpunkCSS = `
  @import url('{{FONTS_URL}}');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 150px 140px;
    position: relative;
    overflow: hidden;
    font-family: 'JetBrains Mono', 'Jura', monospace;
    background: #0D0D0D;
    background-image:
      linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px);
    background-size: 100px 100px;
  }

  .scan-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #00FF88, #7B2FFF, transparent);
    opacity: 0.8;
  }
  .corner-tl, .corner-br {
    position: absolute;
    width: 75px; height: 75px;
    border-color: #00FF88;
    border-style: solid;
    opacity: 0.7;
  }
  .corner-tl { top: 60px; left: 60px; border-width: 2px 0 0 2px; }
  .corner-br { bottom: 60px; right: 60px; border-width: 0 2px 2px 0; }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 100%;
    background: rgba(0,255,136,0.03);
    border: 1px solid rgba(0,255,136,0.2);
    border-radius: 4px;
    padding: 110px 100px;
    box-shadow: 0 0 75px rgba(0,255,136,0.08), inset 0 0 75px rgba(0,0,0,0.3);
  }

  .slide-number {
    font-size: 28px;
    font-weight: 400;
    letter-spacing: 4px;
    color: #00FF88;
    margin-bottom: 40px;
    opacity: 0.7;
  }

  .emoji-icon {
    font-size: 110px;
    margin-bottom: 40px;
    display: block;
    filter: drop-shadow(0 0 25px rgba(0,255,136,0.6));
  }

  .slide-title {
    font-size: 76px;
    font-weight: 700;
    line-height: 1.25;
    color: #FFFFFF;
    margin-bottom: 40px;
    text-shadow: 0 0 50px rgba(0,255,136,0.3);
  }

  .slide-subtitle {
    font-size: 39px;
    font-weight: 400;
    color: #00FF88;
    margin-bottom: 35px;
    letter-spacing: 2px;
  }

  .slide-body {
    font-size: 39px;
    font-weight: 400;
    line-height: 1.75;
    color: rgba(255,255,255,0.6);
  }

  .tag {
    display: inline-block;
    background: rgba(0,255,136,0.1);
    border: 1px solid rgba(0,255,136,0.4);
    border-radius: 2px;
    padding: 5px 35px;
    font-size: 28px;
    color: #00FF88;
    margin-top: 45px;
    letter-spacing: 2px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 5: Apple Premium
// ─────────────────────────────────────────────────────────────────────────────
const applePremiumCSS = `
  @import url('{{FONTS_URL}}');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 180px 170px;
    position: relative;
    overflow: hidden;
    font-family: 'Onest', sans-serif;
    color: #ffffff;
    background: #000000;
  }

  .glow-orb {
    position: absolute;
    width: 1500px; height: 1500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%);
    top: -500px; right: -500px;
    pointer-events: none;
  }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 100%;
    background: transparent;
    padding: 0;
  }

  .slide-number {
    font-size: 28px;
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 50px;
    display: block;
  }

  .emoji-icon {
    font-size: 125px;
    margin-bottom: 50px;
    display: block;
  }

  .slide-title {
    font-size: 110px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -1.5px;
    background: linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.65) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 50px;
  }

  .slide-subtitle {
    font-size: 46px;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    margin-bottom: 40px;
    letter-spacing: 0.3px;
  }

  .slide-body {
    font-size: 46px;
    font-weight: 400;
    line-height: 1.7;
    color: rgba(255,255,255,0.55);
  }

  .tag {
    display: inline-block;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 125px;
    padding: 18px 45px;
    font-size: 30px;
    font-weight: 500;
    color: rgba(255,255,255,0.6);
    margin-top: 55px;
    letter-spacing: 0.5px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 6: Y2K / Acid Graphic
// ─────────────────────────────────────────────────────────────────────────────
const y2kAcidCSS = `
  @import url('{{FONTS_URL}}');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 150px 140px;
    position: relative;
    overflow: hidden;
    font-family: 'Russo One', sans-serif;
    color: #ffffff;
    background: linear-gradient(135deg, #FF006E 0%, #FB5607 25%, #FFBE0B 50%, #3A86FF 75%, #8338EC 100%);
  }

  .chrome-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(255,255,255,0.15) 0%,
      transparent 30%,
      rgba(255,255,255,0.08) 50%,
      transparent 70%,
      rgba(255,255,255,0.12) 100%
    );
  }
  .blob {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    filter: blur(100px);
  }
  .blob-1 { width: 750px; height: 750px; top: -200px; left: -200px; }
  .blob-2 { width: 625px; height: 625px; bottom: -150px; right: -150px; }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 100%;
    background: rgba(0,0,0,0.15);
    backdrop-filter: blur(25px);
    border: 2px solid rgba(255,255,255,0.4);
    border-radius: 40px;
    padding: 125px 110px;
    text-align: center;
    box-shadow:
      0 0 0 4px rgba(255,255,255,0.15),
      0 50px 150px rgba(0,0,0,0.2);
  }

  .slide-number {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.8);
    margin-bottom: 35px;
    display: block;
  }

  .emoji-icon {
    font-size: 135px;
    margin-bottom: 40px;
    display: block;
    filter: drop-shadow(0 4px 50px rgba(0,0,0,0.3));
  }

  .slide-title {
    font-size: 90px;
    font-weight: 900;
    line-height: 1.15;
    color: #FFFFFF;
    margin-bottom: 40px;
    text-shadow:
      3px 3px 0 rgba(0,0,0,0.25),
      -1px -1px 0 rgba(255,255,255,0.3);
    word-break: break-word;
  }

  .slide-subtitle {
    font-size: 46px;
    font-weight: 700;
    color: rgba(255,255,255,0.9);
    margin-bottom: 35px;
    letter-spacing: 1px;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.2);
  }

  .slide-body {
    font-family: 'Russo One', sans-serif;
    font-size: 41px;
    font-weight: 400;
    line-height: 1.7;
    color: rgba(255,255,255,0.85);
  }

  .tag {
    display: inline-block;
    background: rgba(255,255,255,0.25);
    border: 2px solid rgba(255,255,255,0.6);
    border-radius: 125px;
    padding: 15px 45px;
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    margin-top: 45px;
    letter-spacing: 2px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 7: EdTech / Trust
// ─────────────────────────────────────────────────────────────────────────────
const edtechCSS = `
  @import url('{{FONTS_URL}}');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 160px 150px;
    position: relative;
    overflow: hidden;
    font-family: 'Manrope', 'Roboto Flex', sans-serif;
    background: #FAFBFF;
  }

  .top-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 5px;
    background: linear-gradient(90deg, #2563EB, #06B6D4);
  }

  .sidebar-accent {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: linear-gradient(to bottom, #2563EB, #06B6D4);
  }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #E8EFF8;
    border-radius: 40px;
    padding: 110px 100px;
    box-shadow: 0 4px 60px rgba(37,99,235,0.08);
  }

  .slide-number {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #2563EB;
    margin-bottom: 40px;
    display: block;
    opacity: 0.7;
  }

  .emoji-icon {
    font-size: 110px;
    margin-bottom: 40px;
    display: block;
  }

  .slide-title {
    font-size: 83px;
    font-weight: 800;
    line-height: 1.25;
    color: #0F172A;
    margin-bottom: 40px;
  }

  .slide-subtitle {
    font-size: 41px;
    font-weight: 700;
    color: #2563EB;
    margin-bottom: 35px;
    letter-spacing: 0.5px;
  }

  .highlight-box {
    background: linear-gradient(135deg, rgba(37,99,235,0.06), rgba(6,182,212,0.06));
    border-left: 3px solid #2563EB;
    border-radius: 0 20px 20px 0;
    padding: 30px 40px;
    margin: 35px 0;
  }

  .slide-body {
    font-size: 41px;
    font-weight: 400;
    line-height: 1.75;
    color: #475569;
  }

  .tag {
    display: inline-block;
    background: rgba(37,99,235,0.08);
    border: 1px solid rgba(37,99,235,0.2);
    border-radius: 15px;
    padding: 15px 35px;
    font-size: 30px;
    font-weight: 600;
    color: #2563EB;
    margin-top: 45px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Конфигурация всех тем
// ─────────────────────────────────────────────────────────────────────────────
export const THEMES: Record<ThemeId, ThemeDefinition> = {
  1: {
    id: 1,
    name: 'glassmorphism',
    label: 'Glassmorphism',
    description: 'Матовое стекло на градиентном фоне. Элегантно, современно.',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Inter:wght@400;500;600;700&subset=cyrillic&display=swap',
    css: glassmorphismCSS,
  },
  2: {
    id: 2,
    name: 'neo-brutalism',
    label: 'Neo-Brutalism',
    description: 'Жёсткие тени, кислотные цвета, дерзкий дизайн.',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Space+Grotesk:wght@400;500;700&subset=cyrillic&display=swap',
    css: neoBrutalismCSS,
  },
  3: {
    id: 3,
    name: 'minimalist',
    label: 'Minimalist Elegance',
    description: 'Журнальная верстка, пастельные тона, элегантная типографика.',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Montserrat:wght@400;500;600&subset=cyrillic&display=swap',
    css: minimalistCSS,
  },
  4: {
    id: 4,
    name: 'cyberpunk',
    label: 'Dark Cyberpunk',
    description: 'Тёмный фон, неоновые акценты, сетка кода. IT/Tech стиль.',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Jura:wght@400;600;700&subset=cyrillic&display=swap',
    css: cyberpunkCSS,
  },
  5: {
    id: 5,
    name: 'apple-premium',
    label: 'Apple Premium',
    description: 'Чёрный фон, огромные жирные заголовки, градиентный текст.',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;700;800;900&subset=cyrillic&display=swap',
    css: applePremiumCSS,
  },
  6: {
    id: 6,
    name: 'y2k-acid',
    label: 'Y2K / Acid Graphic',
    description: 'Ретро-футуризм, хромированные эффекты, кислотные градиенты.',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Russo+One&family=Evolventa&subset=cyrillic&display=swap',
    css: y2kAcidCSS,
  },
  7: {
    id: 7,
    name: 'edtech',
    label: 'EdTech / Trust',
    description: 'Корпоративный обучающий стиль. Чистый, доверительный, информативный.',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&subset=cyrillic&display=swap',
    css: edtechCSS,
  },
  8: {
    id: 8,
    name: 'custom',
    label: 'Custom Brand',
    description: 'Кастомный дизайн на основе загруженного пользователем стиля.',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&subset=cyrillic&display=swap',
    css: '', // заполняется динамически
  },
};

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES[id];
}

export function resolveThemeCSS(theme: ThemeDefinition, fontsUrl?: string): string {
  const url = fontsUrl ?? theme.googleFontsUrl;
  return theme.css.replace('{{FONTS_URL}}', url);
}

/**
 * Генерирует CSS-оверлей для кастомизации бренд-цветов
 */
export function generateBrandColorOverlay(
  primaryColor: string,
  secondaryColor: string,
  textColor: string,
): string {
  return `
    .slide {
      --brand-primary: ${primaryColor};
      --brand-secondary: ${secondaryColor};
      --brand-text: ${textColor};
    }
    .slide-title { color: ${textColor} !important; -webkit-text-fill-color: ${textColor} !important; }
    .slide-subtitle { color: ${primaryColor} !important; }
    .tag { background: ${primaryColor}22 !important; border-color: ${primaryColor}66 !important; color: ${primaryColor} !important; }
    .glass-card { border-color: ${primaryColor}33 !important; }
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// 📚 РАСШИРЕННАЯ БИБЛИОТЕКА ШРИФТОВ С КИРИЛЛИЦЕЙ
// Источники: Google Fonts + Bunny Fonts (privacy-first CDN)
// Все шрифты протестированы на поддержку кириллицы
// ─────────────────────────────────────────────────────────────────────────────

export interface FontEntry {
  name: string;
  displayName: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace' | 'handwriting';
  style: string;
  cyrillicSupport: 'full' | 'partial';
  sourceGoogle: string;
  sourceBunny: string;
  cssStack: string;
  bestFor: string[];
}

export const CYRILLIC_FONTS: FontEntry[] = [
  // ── Sans-serif ──────────────────────────────────────────────────────────────
  {
    name: 'GolosText',
    displayName: 'Golos Text',
    category: 'sans-serif',
    style: 'Современный, читабельный, нейтральный',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;900&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=golos-text:400,500,600,700,900&display=swap',
    cssStack: "'Golos Text', system-ui, sans-serif",
    bestFor: ['Glassmorphism', 'EdTech', 'Minimalist'],
  },
  {
    name: 'Manrope',
    displayName: 'Manrope',
    category: 'sans-serif',
    style: 'Геометрический, дружелюбный, современный',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=manrope:300,400,500,600,700,800&display=swap',
    cssStack: "'Manrope', sans-serif",
    bestFor: ['EdTech', 'Trust', 'Corporate'],
  },
  {
    name: 'Onest',
    displayName: 'Onest',
    category: 'sans-serif',
    style: 'Похож на SF Pro, Apple-стиль',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800;900&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=onest:300,400,500,600,700,800,900&display=swap',
    cssStack: "'Onest', sans-serif",
    bestFor: ['Apple Premium', 'Minimalist', 'Tech'],
  },
  {
    name: 'Inter',
    displayName: 'Inter',
    category: 'sans-serif',
    style: 'Универсальный UI-шрифт',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900&display=swap',
    cssStack: "'Inter', system-ui, sans-serif",
    bestFor: ['Tech', 'Corporate', 'Startup'],
  },
  {
    name: 'Montserrat',
    displayName: 'Montserrat',
    category: 'sans-serif',
    style: 'Геометрический, геометрический, классический',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=montserrat:300,400,500,600,700,800,900&display=swap',
    cssStack: "'Montserrat', sans-serif",
    bestFor: ['Minimalist', 'Fashion', 'Lifestyle'],
  },
  {
    name: 'Raleway',
    displayName: 'Raleway',
    category: 'sans-serif',
    style: 'Изящный, элегантный, тонкий',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=raleway:300,400,500,600,700,800,900&display=swap',
    cssStack: "'Raleway', sans-serif",
    bestFor: ['Luxury', 'Fashion', 'Beauty'],
  },
  {
    name: 'Roboto',
    displayName: 'Roboto',
    category: 'sans-serif',
    style: 'Android-стиль, стандартный, читабельный',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=roboto:300,400,500,700,900&display=swap',
    cssStack: "'Roboto', sans-serif",
    bestFor: ['Material Design', 'Corporate', 'Mobile'],
  },
  {
    name: 'NunitoSans',
    displayName: 'Nunito Sans',
    category: 'sans-serif',
    style: 'Округлый, дружелюбный, читабельный',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=nunito-sans:300,400,600,700,800&display=swap',
    cssStack: "'Nunito Sans', sans-serif",
    bestFor: ['EdTech', 'Friendly', 'Health'],
  },
  // ── Display / Bold ──────────────────────────────────────────────────────────
  {
    name: 'Unbounded',
    displayName: 'Unbounded',
    category: 'display',
    style: 'Жирный, агрессивный, дерзкий',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;800;900&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=unbounded:400,700,800,900&display=swap',
    cssStack: "'Unbounded', sans-serif",
    bestFor: ['Neo-Brutalism', 'Gaming', 'Streetwear'],
  },
  {
    name: 'RussoOne',
    displayName: 'Russo One',
    category: 'display',
    style: 'Советский конструктивизм, жирный',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Russo+One&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=russo-one:400&display=swap',
    cssStack: "'Russo One', sans-serif",
    bestFor: ['Y2K', 'Sports', 'Patriotic'],
  },
  {
    name: 'Oswald',
    displayName: 'Oswald',
    category: 'display',
    style: 'Узкий, заголовочный, газетный',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=oswald:400,500,600,700&display=swap',
    cssStack: "'Oswald', sans-serif",
    bestFor: ['News', 'Sports', 'Brutalism'],
  },
  {
    name: 'BlackHanSans',
    displayName: 'Black Han Sans',
    category: 'display',
    style: 'Максимально жирный, headline-стиль',
    cyrillicSupport: 'partial',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=black-han-sans:400&display=swap',
    cssStack: "'Black Han Sans', sans-serif",
    bestFor: ['Impact Headers', 'Posters', 'Aggressive'],
  },
  {
    name: 'SpaceGrotesk',
    displayName: 'Space Grotesk',
    category: 'display',
    style: 'Техно, геометрический',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=space-grotesk:400,500,600,700&display=swap',
    cssStack: "'Space Grotesk', sans-serif",
    bestFor: ['Tech', 'Startup', 'Crypto'],
  },
  // ── Serif ───────────────────────────────────────────────────────────────────
  {
    name: 'CormorantGaramond',
    displayName: 'Cormorant Garamond',
    category: 'serif',
    style: 'Роскошный, классический, журнальный',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=cormorant-garamond:400,600,400i,600i&display=swap',
    cssStack: "'Cormorant Garamond', Georgia, serif",
    bestFor: ['Minimalist', 'Luxury', 'Magazine'],
  },
  {
    name: 'PTSerif',
    displayName: 'PT Serif',
    category: 'serif',
    style: 'Специально создан для кириллицы',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=pt-serif:400,700,400i&display=swap',
    cssStack: "'PT Serif', serif",
    bestFor: ['Publishing', 'News', 'Official'],
  },
  {
    name: 'Playfair',
    displayName: 'Playfair Display',
    category: 'serif',
    style: 'Элегантный, Fashion-стиль',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=playfair-display:400,700,900,400i&display=swap',
    cssStack: "'Playfair Display', Georgia, serif",
    bestFor: ['Luxury', 'Editorial', 'Beauty'],
  },
  // ── Monospace ───────────────────────────────────────────────────────────────
  {
    name: 'JetBrainsMono',
    displayName: 'JetBrains Mono',
    category: 'monospace',
    style: 'Программистский, читабельный, технический',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=jetbrains-mono:400,500,700&display=swap',
    cssStack: "'JetBrains Mono', 'Courier New', monospace",
    bestFor: ['Cyberpunk', 'Code', 'Terminal'],
  },
  {
    name: 'Jura',
    displayName: 'Jura',
    category: 'monospace',
    style: 'Футуристический, sci-fi',
    cyrillicSupport: 'full',
    sourceGoogle: 'https://fonts.googleapis.com/css2?family=Jura:wght@400;500;600;700&display=swap',
    sourceBunny: 'https://fonts.bunny.net/css?family=jura:400,500,600,700&display=swap',
    cssStack: "'Jura', monospace",
    bestFor: ['Sci-Fi', 'Gaming', 'Cyberpunk'],
  },
];

/**
 * Возвращает URL для загрузки шрифта
 * @param fontName - имя шрифта из CYRILLIC_FONTS
 * @param preferBunny - использовать Bunny Fonts вместо Google (privacy-first)
 */
export function getFontUrl(fontName: string, preferBunny = false): string {
  const font = CYRILLIC_FONTS.find(f => f.name === fontName || f.displayName === fontName);
  if (!font) {
    // Fallback на Golos Text как надёжный кириллический шрифт
    return CYRILLIC_FONTS[0]![preferBunny ? 'sourceBunny' : 'sourceGoogle'];
  }
  return preferBunny ? font.sourceBunny : font.sourceGoogle;
}

/**
 * Генерирует @import URL для нескольких шрифтов одновременно
 * Используется при кастомной теме (тема 8)
 */
export function combineGoogleFontsUrl(fontNames: string[]): string {
  const families: string[] = [];
  for (const name of fontNames) {
    const font = CYRILLIC_FONTS.find(f => f.name === name || f.displayName === name);
    if (font) {
      // Извлекаем family= параметр из URL
      const match = font.sourceGoogle.match(/family=([^&?]+)/);
      if (match) families.push(match[1]!);
    }
  }
  if (families.length === 0) return CYRILLIC_FONTS[0]!.sourceGoogle;
  return `https://fonts.googleapis.com/css2?${families.map(f => `family=${f}`).join('&')}&display=swap`;
}

/**
 * Список всех доступных кириллических шрифтов (для информации)
 */
export function listAvailableFonts(): Array<{
  name: string;
  category: string;
  style: string;
  cyrillicSupport: string;
  bestFor: string[];
}> {
  return CYRILLIC_FONTS.map(f => ({
    name: f.displayName,
    category: f.category,
    style: f.style,
    cyrillicSupport: f.cyrillicSupport,
    bestFor: f.bestFor,
  }));
}

