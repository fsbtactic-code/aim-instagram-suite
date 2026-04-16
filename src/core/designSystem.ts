/**
 * AIM CarouselStudio — Core: Design System v3
 * 7 премиальных тем + кастомная (тема 8).
 * Все шрифты поддерживают кириллицу (subset=cyrillic).
 * 
 * v3: Полный редизайн — контент заполняет слайд,
 *     правильная типографическая шкала, без autoFit zoom.
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

// ══════════════════════════════════════════════════════════════════════════════
// Общая база для всех тем — типографическая шкала и flex-контейнер
// ══════════════════════════════════════════════════════════════════════════════
const BASE_LAYOUT = `
  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .glass-card {
    position: relative;
    z-index: 2;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
    background: transparent;
    padding: 0;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 1: Glassmorphism
// ─────────────────────────────────────────────────────────────────────────────
const glassmorphismCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ${BASE_LAYOUT}

  .slide {
    padding: 70px 65px;
    font-family: 'Golos Text', 'Inter', sans-serif;
    color: #ffffff;
    background: linear-gradient(145deg, #0f0c29 0%, #1a1a4e 35%, #24243e 65%, #302b63 100%);
  }
  .slide::before {
    content: '';
    position: absolute;
    width: 900px; height: 900px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%);
    top: -300px; right: -250px;
    pointer-events: none;
  }
  .slide::after {
    content: '';
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
    bottom: -200px; left: -200px;
    pointer-events: none;
  }

  .glass-card {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 32px;
    padding: 56px 52px;
    box-shadow: 0 8px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
  }

  .slide-number {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(139,92,246,0.8);
    margin-bottom: 24px;
    display: block;
  }
  .emoji-icon {
    font-size: 52px;
    margin-bottom: 20px;
    display: block;
    filter: drop-shadow(0 2px 12px rgba(139,92,246,0.4));
  }
  .slide-title {
    font-size: 54px;
    font-weight: 700;
    line-height: 1.15;
    color: #ffffff;
    margin-bottom: 16px;
    text-shadow: 0 2px 30px rgba(139,92,246,0.3);
  }
  .slide-subtitle {
    font-size: 26px;
    font-weight: 500;
    color: rgba(167,139,250,0.95);
    margin-bottom: 20px;
    letter-spacing: 0.02em;
  }
  .divider {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, rgba(139,92,246,0.8), rgba(139,92,246,0.1));
    margin: 20px 0;
  }
  .slide-body {
    font-size: 24px;
    font-weight: 400;
    line-height: 1.65;
    color: rgba(255,255,255,0.72);
  }
  .highlight-box {
    background: rgba(139,92,246,0.08);
    border-left: 3px solid rgba(139,92,246,0.5);
    border-radius: 0 16px 16px 0;
    padding: 20px 24px;
    margin: 16px 0;
  }
  .tag {
    display: inline-block;
    background: rgba(139,92,246,0.15);
    border: 1px solid rgba(139,92,246,0.3);
    border-radius: 100px;
    padding: 8px 24px;
    font-size: 16px;
    color: rgba(167,139,250,0.9);
    margin-top: 20px;
    letter-spacing: 0.03em;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 2: Neo-Brutalism
// ─────────────────────────────────────────────────────────────────────────────
const neoBrutalismCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ${BASE_LAYOUT}

  .slide {
    padding: 65px 60px;
    font-family: 'Unbounded', 'Space Grotesk', sans-serif;
    color: #000;
    background: #F5F000;
  }
  .accent-block {
    position: absolute;
    top: 0; right: 0;
    width: 360px; height: 360px;
    background: #FF2D55;
    border-left: 4px solid #000;
    border-bottom: 4px solid #000;
  }
  .glass-card {
    background: #fff;
    border: 4px solid #000;
    border-radius: 0;
    padding: 52px 48px;
    box-shadow: 12px 12px 0 #000;
  }

  .slide-number {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #000;
    background: #FF2D55;
    display: inline-block;
    padding: 4px 16px;
    margin-bottom: 20px;
  }
  .emoji-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
  }
  .slide-title {
    font-size: 52px;
    font-weight: 900;
    line-height: 1.1;
    color: #000;
    margin-bottom: 16px;
    text-transform: uppercase;
    word-break: break-word;
  }
  .slide-subtitle {
    font-size: 24px;
    font-weight: 800;
    color: #FF2D55;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .slide-body {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 500;
    line-height: 1.55;
    color: #222;
    border-left: 4px solid #000;
    padding-left: 20px;
  }
  .highlight-box {
    background: #F5F000;
    border: 2px solid #000;
    padding: 16px 20px;
    margin: 16px 0;
  }
  .tag {
    display: inline-block;
    background: #F5F000;
    border: 3px solid #000;
    border-radius: 0;
    padding: 8px 20px;
    font-size: 15px;
    font-weight: 800;
    color: #000;
    margin-top: 20px;
    text-transform: uppercase;
    box-shadow: 3px 3px 0 #000;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 3: Minimalist Elegance
// ─────────────────────────────────────────────────────────────────────────────
const minimalistCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ${BASE_LAYOUT}

  .slide {
    padding: 80px 75px;
    font-family: 'Montserrat', sans-serif;
    color: #2C2416;
    background: #FAF8F5;
  }
  .decorative-line {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #C9A96E, #E8D5B0);
  }
  .glass-card {
    padding: 0;
  }

  .slide-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px;
    font-weight: 300;
    font-style: italic;
    color: rgba(201,169,110,0.25);
    line-height: 1;
    margin-bottom: 16px;
    display: block;
  }
  .emoji-icon {
    font-size: 44px;
    margin-bottom: 16px;
    display: block;
    opacity: 0.8;
  }
  .slide-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 58px;
    font-weight: 600;
    font-style: italic;
    line-height: 1.15;
    color: #2C2416;
    margin-bottom: 20px;
  }
  .slide-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #C9A96E;
    margin-bottom: 20px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }
  .divider {
    width: 60px;
    height: 1px;
    background: #C9A96E;
    margin: 20px 0;
  }
  .slide-body {
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 1.75;
    color: #5C5040;
  }
  .highlight-box {
    border-left: 2px solid #C9A96E;
    padding: 16px 20px;
    margin: 16px 0;
  }
  .tag {
    display: inline-block;
    border: 1px solid #C9A96E;
    border-radius: 2px;
    padding: 6px 20px;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #C9A96E;
    margin-top: 20px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 4: Dark Cyberpunk
// ─────────────────────────────────────────────────────────────────────────────
const cyberpunkCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ${BASE_LAYOUT}

  .slide {
    padding: 70px 65px;
    font-family: 'JetBrains Mono', 'Jura', monospace;
    color: #fff;
    background: #0a0a0a;
    background-image:
      linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
    background-size: 80px 80px;
  }
  .scan-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00FF88, #7B2FFF, transparent);
    opacity: 0.7;
  }
  .corner-tl, .corner-br {
    position: absolute;
    width: 40px; height: 40px;
    border-color: #00FF88;
    border-style: solid;
    opacity: 0.5;
  }
  .corner-tl { top: 30px; left: 30px; border-width: 2px 0 0 2px; }
  .corner-br { bottom: 30px; right: 30px; border-width: 0 2px 2px 0; }

  .glass-card {
    background: rgba(0,255,136,0.02);
    border: 1px solid rgba(0,255,136,0.15);
    border-radius: 4px;
    padding: 52px 48px;
    box-shadow: 0 0 40px rgba(0,255,136,0.05), inset 0 0 40px rgba(0,0,0,0.2);
  }

  .slide-number {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 4px;
    color: #00FF88;
    margin-bottom: 20px;
    opacity: 0.6;
  }
  .emoji-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
    filter: drop-shadow(0 0 12px rgba(0,255,136,0.5));
  }
  .slide-title {
    font-family: 'Jura', sans-serif;
    font-size: 50px;
    font-weight: 700;
    line-height: 1.2;
    color: #FFFFFF;
    margin-bottom: 16px;
    text-shadow: 0 0 30px rgba(0,255,136,0.2);
  }
  .slide-subtitle {
    font-size: 22px;
    font-weight: 400;
    color: #00FF88;
    margin-bottom: 16px;
    letter-spacing: 2px;
  }
  .slide-body {
    font-size: 21px;
    font-weight: 400;
    line-height: 1.7;
    color: rgba(255,255,255,0.55);
  }
  .highlight-box {
    background: rgba(0,255,136,0.05);
    border-left: 2px solid #00FF88;
    border-radius: 0 8px 8px 0;
    padding: 16px 20px;
    margin: 16px 0;
  }
  .tag {
    display: inline-block;
    background: rgba(0,255,136,0.08);
    border: 1px solid rgba(0,255,136,0.3);
    border-radius: 2px;
    padding: 6px 20px;
    font-size: 14px;
    color: #00FF88;
    margin-top: 20px;
    letter-spacing: 2px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 5: Apple Premium — Keynote-level драма
// ─────────────────────────────────────────────────────────────────────────────
const applePremiumCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ${BASE_LAYOUT}

  .slide {
    padding: 80px 72px 60px;
    font-family: 'Onest', -apple-system, sans-serif;
    color: #ffffff;
    background: #050508;
  }
  /* Тонкий градиент-акцент сверху */
  .top-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  }
  /* Глоу-сфера — глубина */
  .glow-orb {
    position: absolute;
    width: 800px; height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.04) 40%, transparent 70%);
    top: -200px; right: -200px;
    pointer-events: none;
  }
  /* Вторая глоу-сфера внизу слева */
  .blob-1 {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%);
    bottom: -200px; left: -200px;
    pointer-events: none;
  }
  /* Тонкая линия-акцент внизу */
  .decorative-line {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  }

  .glass-card { padding: 0; }

  .slide-number {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: rgba(163,130,255,0.6);
    margin-bottom: 32px;
    display: block;
  }
  .emoji-icon {
    font-size: 56px;
    margin-bottom: 24px;
    display: block;
    filter: drop-shadow(0 0 24px rgba(139,92,246,0.3));
  }
  .slide-title {
    font-size: 64px;
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #FFFFFF 0%, #e0e0ff 50%, rgba(255,255,255,0.55) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
  }
  .slide-subtitle {
    font-size: 24px;
    font-weight: 500;
    color: rgba(167,139,250,0.7);
    margin-bottom: 24px;
    letter-spacing: 0.02em;
  }
  .divider {
    width: 48px;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #a855f7);
    margin: 20px 0;
    border-radius: 1px;
  }
  .slide-body {
    font-size: 25px;
    font-weight: 400;
    line-height: 1.65;
    color: rgba(255,255,255,0.5);
  }
  .highlight-box {
    background: rgba(99,102,241,0.06);
    border-left: 2px solid rgba(139,92,246,0.4);
    border-radius: 0 16px 16px 0;
    padding: 20px 24px;
    margin: 20px 0;
  }
  .tag {
    display: inline-block;
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.25);
    border-radius: 100px;
    padding: 10px 28px;
    font-size: 15px;
    font-weight: 600;
    color: rgba(167,139,250,0.8);
    margin-top: 24px;
    letter-spacing: 0.03em;
  }

  /* Layout overrides for drama */
  .hero-num {
    background: linear-gradient(135deg, #FFFFFF 0%, #a78bfa 50%, #6366f1 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    font-size: 200px !important;
  }
  .hero-unit {
    color: rgba(167,139,250,0.6) !important;
    -webkit-text-fill-color: rgba(167,139,250,0.6) !important;
  }
  .check-item {
    background: rgba(99,102,241,0.04) !important;
    border-color: rgba(99,102,241,0.1) !important;
  }
  .check-item--accent {
    background: rgba(139,92,246,0.1) !important;
    border-color: rgba(139,92,246,0.25) !important;
    border-left: 3px solid rgba(139,92,246,0.5) !important;
  }
  .grid-cell {
    background: rgba(99,102,241,0.04) !important;
    border-color: rgba(99,102,241,0.1) !important;
  }
  .step-card {
    background: rgba(99,102,241,0.04) !important;
    border-color: rgba(99,102,241,0.1) !important;
  }
  .step-num {
    background: rgba(139,92,246,0.15) !important;
    border-color: rgba(139,92,246,0.3) !important;
    color: #a78bfa !important;
  }
  .quote-mark { color: rgba(139,92,246,0.15) !important; }
  .quote-text {
    background: linear-gradient(135deg, #FFFFFF 0%, rgba(167,139,250,0.8) 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 6: Y2K / Acid Graphic
// ─────────────────────────────────────────────────────────────────────────────
const y2kAcidCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ${BASE_LAYOUT}

  .slide {
    padding: 65px 60px;
    font-family: 'Russo One', sans-serif;
    color: #ffffff;
    background: linear-gradient(135deg, #FF006E 0%, #FB5607 25%, #FFBE0B 50%, #3A86FF 75%, #8338EC 100%);
  }
  .chrome-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.12)0%, transparent 30%, rgba(255,255,255,0.06)50%, transparent 70%, rgba(255,255,255,0.1)100%);
  }
  .blob { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.08); filter: blur(80px); }
  .blob-1 { width: 500px; height: 500px; top: -150px; left: -150px; }
  .blob-2 { width: 400px; height: 400px; bottom: -100px; right: -100px; }

  .glass-card {
    background: rgba(0,0,0,0.18);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 28px;
    padding: 52px 48px;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.1), 0 20px 80px rgba(0,0,0,0.15);
  }

  .slide-number {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.75);
    margin-bottom: 16px;
    display: block;
  }
  .emoji-icon {
    font-size: 52px;
    margin-bottom: 16px;
    display: block;
    filter: drop-shadow(0 2px 20px rgba(0,0,0,0.25));
  }
  .slide-title {
    font-size: 52px;
    font-weight: 900;
    line-height: 1.12;
    color: #FFFFFF;
    margin-bottom: 16px;
    text-shadow: 2px 2px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2);
    word-break: break-word;
  }
  .slide-subtitle {
    font-size: 24px;
    font-weight: 700;
    color: rgba(255,255,255,0.85);
    margin-bottom: 16px;
    letter-spacing: 1px;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.15);
  }
  .slide-body {
    font-size: 22px;
    font-weight: 400;
    line-height: 1.6;
    color: rgba(255,255,255,0.8);
  }
  .tag {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 100px;
    padding: 8px 24px;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    margin-top: 20px;
    letter-spacing: 2px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕМА 7: EdTech / Trust
// ─────────────────────────────────────────────────────────────────────────────
const edtechCSS = `
  @import url('{{FONTS_URL}}');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ${BASE_LAYOUT}

  .slide {
    padding: 70px 65px;
    font-family: 'Manrope', sans-serif;
    color: #0F172A;
    background: #F8FAFC;
  }
  .top-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2563EB, #06B6D4);
  }
  .sidebar-accent {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #2563EB, #06B6D4);
  }

  .glass-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 24px;
    padding: 48px 44px;
    box-shadow: 0 4px 30px rgba(37,99,235,0.06);
  }

  .slide-number {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #2563EB;
    margin-bottom: 20px;
    display: block;
    opacity: 0.6;
  }
  .emoji-icon {
    font-size: 44px;
    margin-bottom: 16px;
    display: block;
  }
  .slide-title {
    font-size: 50px;
    font-weight: 800;
    line-height: 1.15;
    color: #0F172A;
    margin-bottom: 16px;
  }
  .slide-subtitle {
    font-size: 22px;
    font-weight: 700;
    color: #2563EB;
    margin-bottom: 16px;
  }
  .highlight-box {
    background: linear-gradient(135deg, rgba(37,99,235,0.04), rgba(6,182,212,0.04));
    border-left: 3px solid #2563EB;
    border-radius: 0 12px 12px 0;
    padding: 16px 20px;
    margin: 16px 0;
  }
  .slide-body {
    font-size: 22px;
    font-weight: 400;
    line-height: 1.7;
    color: #475569;
  }
  .tag {
    display: inline-block;
    background: rgba(37,99,235,0.06);
    border: 1px solid rgba(37,99,235,0.15);
    border-radius: 12px;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 600;
    color: #2563EB;
    margin-top: 20px;
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
  { name: 'GolosText', displayName: 'Golos Text', category: 'sans-serif', style: 'Современный, читабельный', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;900&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=golos-text:400,500,600,700,900&display=swap', cssStack: "'Golos Text', system-ui, sans-serif", bestFor: ['Glassmorphism', 'EdTech'] },
  { name: 'Manrope', displayName: 'Manrope', category: 'sans-serif', style: 'Геометрический, дружелюбный', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=manrope:300,400,500,600,700,800&display=swap', cssStack: "'Manrope', sans-serif", bestFor: ['EdTech', 'Trust'] },
  { name: 'Onest', displayName: 'Onest', category: 'sans-serif', style: 'SF Pro стиль', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800;900&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=onest:300,400,500,600,700,800,900&display=swap', cssStack: "'Onest', sans-serif", bestFor: ['Apple Premium'] },
  { name: 'Inter', displayName: 'Inter', category: 'sans-serif', style: 'UI шрифт', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900&display=swap', cssStack: "'Inter', system-ui, sans-serif", bestFor: ['Tech', 'Corporate'] },
  { name: 'Montserrat', displayName: 'Montserrat', category: 'sans-serif', style: 'Геометрический классика', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=montserrat:300,400,500,600,700,800,900&display=swap', cssStack: "'Montserrat', sans-serif", bestFor: ['Minimalist', 'Fashion'] },
  { name: 'Unbounded', displayName: 'Unbounded', category: 'display', style: 'Жирный, агрессивный', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;800;900&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=unbounded:400,700,800,900&display=swap', cssStack: "'Unbounded', sans-serif", bestFor: ['Neo-Brutalism'] },
  { name: 'RussoOne', displayName: 'Russo One', category: 'display', style: 'Конструктивизм', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Russo+One&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=russo-one:400&display=swap', cssStack: "'Russo One', sans-serif", bestFor: ['Y2K', 'Sports'] },
  { name: 'CormorantGaramond', displayName: 'Cormorant Garamond', category: 'serif', style: 'Роскошный, журнальный', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=cormorant-garamond:400,600,400i,600i&display=swap', cssStack: "'Cormorant Garamond', Georgia, serif", bestFor: ['Minimalist', 'Luxury'] },
  { name: 'JetBrainsMono', displayName: 'JetBrains Mono', category: 'monospace', style: 'Программистский', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=jetbrains-mono:400,500,700&display=swap', cssStack: "'JetBrains Mono', monospace", bestFor: ['Cyberpunk', 'Code'] },
  { name: 'Jura', displayName: 'Jura', category: 'monospace', style: 'Футуристический', cyrillicSupport: 'full', sourceGoogle: 'https://fonts.googleapis.com/css2?family=Jura:wght@400;500;600;700&display=swap', sourceBunny: 'https://fonts.bunny.net/css?family=jura:400,500,600,700&display=swap', cssStack: "'Jura', monospace", bestFor: ['Sci-Fi', 'Cyberpunk'] },
];

export function getFontUrl(fontName: string, preferBunny = false): string {
  const font = CYRILLIC_FONTS.find(f => f.name === fontName || f.displayName === fontName);
  if (!font) return CYRILLIC_FONTS[0]![preferBunny ? 'sourceBunny' : 'sourceGoogle'];
  return preferBunny ? font.sourceBunny : font.sourceGoogle;
}

export function combineGoogleFontsUrl(fontNames: string[]): string {
  const families: string[] = [];
  for (const name of fontNames) {
    const font = CYRILLIC_FONTS.find(f => f.name === name || f.displayName === name);
    if (font) {
      const match = font.sourceGoogle.match(/family=([^&?]+)/);
      if (match) families.push(match[1]!);
    }
  }
  if (families.length === 0) return CYRILLIC_FONTS[0]!.sourceGoogle;
  return `https://fonts.googleapis.com/css2?${families.map(f => `family=${f}`).join('&')}&display=swap`;
}

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
