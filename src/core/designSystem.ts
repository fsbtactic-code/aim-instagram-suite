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

// ─────────────────────────────────────────────────────────────────────────────
// BASE LAYOUT  (общий каркас, не зависит от темы)
// ─────────────────────────────────────────────────────────────────────────────
const BASE_LAYOUT = `
  /* ── Reset ─────────────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: var(--slide-width); height: var(--slide-height); overflow: hidden; }

  /* ── Slide root ─────────────────────────────────────────────────────── */
  .slide {
    width: var(--slide-width);
    height: var(--slide-height);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'kern' 1, 'liga' 1;
  }

  /* ── Glass card = fills portrait canvas, distributes content ─────── */
  .glass-card {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 6px;
    min-height: 0;
    padding: 56px 56px 90px;
  }

  /* ── Floating card variant ──────────────────────────────────────── */
  .glass-card--float {
    flex: none;
    margin: auto 0;
  }

  /* ── Slide number ─────────────────────────────────────────────────── */
  .slide-number {
    display: block;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 20px;
    opacity: 0.38;
    font-variant-numeric: tabular-nums;
  }

  /* ── Emoji ───────────────────────────────────────────────────────── */
  .emoji-icon {
    font-size: 64px;
    line-height: 1;
    display: block;
    margin-bottom: 20px;
    filter: drop-shadow(0 4px 16px rgba(0,0,0,0.22));
  }

  /* ── Title — MОЩНЫЙ ─────────────────────────────────────────────── */
  .slide-title {
    font-size: 88px;
    font-weight: 900;
    line-height: 0.94;
    letter-spacing: -3px;
    margin-bottom: 18px;
    text-wrap: balance;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* ── Subtitle ────────────────────────────────────────────────────── */
  .slide-subtitle {
    font-size: 34px;
    font-weight: 700;
    line-height: 1.32;
    letter-spacing: -0.02em;
    opacity: 0.68;
    margin-bottom: 0;
    text-wrap: balance;
  }

  /* ── Divider ─────────────────────────────────────────────────────── */
  .divider {
    width: 52px;
    height: 3px;
    border-radius: 99px;
    margin: 18px 0;
    opacity: 0.35;
  }

  /* ── Highlight box (body text container with left accent) ────────── */
  .highlight-box {
    border-left: 4px solid currentColor;
    padding: 22px 28px 22px 32px;
    margin-top: 24px;
    margin-bottom: 0;
    opacity: 1;
    background: rgba(128,128,128,0.035);
    border-radius: 0 16px 16px 0;
  }

  /* ── Body text — КРУПНЫЙ для мобильного чтения ──────────────────── */
  .slide-body {
    font-size: 38px;
    font-weight: 500;
    line-height: 1.58;
    letter-spacing: 0.005em;
    text-wrap: pretty;
    overflow-wrap: break-word;
  }

  /* ── Tag ─────────────────────────────────────────────────────────── */
  .tag {
    display: inline-block;
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.10em;
    padding: 12px 28px;
    border-radius: 100px;
    margin-top: 24px;
    align-self: flex-start;
  }

  /* ── Decorative background elements ─────────────────────────────── */
  .aurora-1, .aurora-2 {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .aurora-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px;
    pointer-events: none;
    z-index: 1;
    opacity: 0.45;
  }
  .grid-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }
  .scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    pointer-events: none;
    z-index: 1;
  }
  .scan-line-v {
    position: absolute;
    top: 0; bottom: 0;
    width: 1px;
    pointer-events: none;
    z-index: 1;
  }
  .corner-tl, .corner-tr, .corner-bl, .corner-br {
    position: absolute;
    width: 32px; height: 32px;
    pointer-events: none;
    z-index: 3;
  }
  .corner-tl { top: 24px; left: 24px; border-top: 2px solid; border-left: 2px solid; }
  .corner-tr { top: 24px; right: 24px; border-top: 2px solid; border-right: 2px solid; }
  .corner-bl { bottom: 24px; left: 24px; border-bottom: 2px solid; border-left: 2px solid; }
  .corner-br { bottom: 24px; right: 24px; border-bottom: 2px solid; border-right: 2px solid; }
  .glow-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
  .warm-blob-tl, .warm-blob-br, .warm-blob-tr { position: absolute; border-radius: 50%; filter: blur(72px); pointer-events: none; z-index: 0; }
  .top-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; z-index: 3; pointer-events: none; }
  .left-rule { position: absolute; top: 0; bottom: 0; left: 60px; width: 1px; z-index: 1; pointer-events: none; }
  .blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; z-index: 0; }
  .neon-line-h { position: absolute; left: 0; right: 0; height: 1px; pointer-events: none; z-index: 1; }
  .neon-line-v { position: absolute; top: 0; bottom: 0; width: 1px; pointer-events: none; z-index: 1; }
  .star-field { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
  .ink-rule { position: absolute; top: 0; bottom: 0; left: 0; width: 5px; z-index: 2; pointer-events: none; }
  .swiss-top { position: absolute; top: 0; left: 0; right: 0; height: 6px; z-index: 3; pointer-events: none; }
  .swiss-grid { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
  .gold-accent-br { position: absolute; bottom: -60px; right: -60px; width: 300px; height: 300px; border-radius: 50%; pointer-events: none; z-index: 0; }
  .accent-block, .accent-block-2 { position: absolute; pointer-events: none; z-index: 1; }
  .stripe { position: absolute; pointer-events: none; z-index: 0; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE FONTS BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function gFont(...families: string[]): string {
  const params = families
    .map(f => `family=${encodeURIComponent(f)}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&subset=cyrillic,latin&display=swap`;
}

// ─────────────────────────────────────────────────────────────────────────────
// THEMES
// ─────────────────────────────────────────────────────────────────────────────
export const THEMES: Record<ThemeId, ThemeDefinition> = {

  // ══════════════════════════════════════════════════════════════════════════
  // 1 — AURORA GLASSMORPHISM
  // Deep purple-blue, aurora gradients, frosted card
  // ══════════════════════════════════════════════════════════════════════════
  1: {
    id: 1,
    name: 'glassmorphism',
    label: 'Aurora Glassmorphism',
    googleFontsUrl: gFont('Golos Text:wght@400;600;700;800;900', 'JetBrains Mono:wght@700'),

    css: BASE_LAYOUT + `
      .slide {
        background: radial-gradient(ellipse 120% 80% at 15% 0%, #3B1F7A 0%, #0A0520 45%, #08031A 80%);
        font-family: 'Golos Text', sans-serif;
        color: #FFFFFF;
      }

      /* Aurora blobs */
      .aurora-1 {
        width: 700px; height: 600px;
        top: -200px; left: -150px;
        background: radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(79,70,229,0.25) 50%, transparent 70%);
      }
      .aurora-2 {
        width: 500px; height: 450px;
        bottom: -100px; right: -80px;
        background: radial-gradient(circle, rgba(236,72,153,0.35) 0%, rgba(124,58,237,0.18) 50%, transparent 70%);
      }
      .aurora-noise { opacity: 0.50; }
      .top-accent { background: linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6); opacity: 0.90; }

      /* Glass card */
      .glass-card {
        background: rgba(255,255,255,0.045);
        backdrop-filter: blur(28px) saturate(160%);
        -webkit-backdrop-filter: blur(28px) saturate(160%);
        border: 1px solid rgba(255,255,255,0.10);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        border-radius: 0;
        padding: 56px 56px 90px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
      }

      .slide-number { font-family: 'JetBrains Mono', monospace; color: #A78BFA; }
      .slide-title  { color: #FFFFFF; }
      .slide-subtitle { color: rgba(255,255,255,0.62); }
      .divider { background: linear-gradient(90deg, #8B5CF6, transparent); }
      .highlight-box { border-color: rgba(139,92,246,0.55); }
      .slide-body { color: rgba(255,255,255,0.82); }
      .tag {
        background: rgba(139,92,246,0.18);
        border: 1px solid rgba(139,92,246,0.35);
        color: #C4B5FD;
      }
      .slide-counter {
        background: rgba(255,255,255,0.06);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.10);
        color: rgba(255,255,255,0.55);
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 2 — NEO-BRUTALISM
  // Acid yellow background, floating white card, raw aggression
  // ══════════════════════════════════════════════════════════════════════════
  2: {
    id: 2,
    name: 'neo-brutalism',
    label: 'Neo-Brutalism',
    googleFontsUrl: gFont('Unbounded:wght@400;700;800;900', 'Manrope:wght@400;500;700'),

    css: BASE_LAYOUT + `
      .slide {
        background: #F2EF00;
        font-family: 'Unbounded', sans-serif;
        color: #0A0A0A;
        padding: 56px 52px;
      }

      /* Decoration */
      .accent-block {
        width: 260px; height: 260px;
        bottom: -40px; left: -40px;
        background: #FF2400;
        border-radius: 0;
        opacity: 0.88;
      }
      .accent-block-2 {
        width: 120px; height: 120px;
        top: 30px; right: 30px;
        background: #0A0A0A;
        border-radius: 0;
        opacity: 0.08;
      }
      .stripe.stripe-1 {
        top: 0; left: 0; right: 0;
        height: 8px;
        background: #0A0A0A;
      }
      .stripe.stripe-2 {
        bottom: 0; left: 0; right: 0;
        height: 8px;
        background: #0A0A0A;
      }

      /* Floating white card */
      .glass-card {
        background: #FFFFFF;
        border: 4px solid #0A0A0A;
        border-radius: 0;
        box-shadow: 12px 12px 0 #0A0A0A;
        padding: 56px 56px 90px;
        flex: none;
        margin: auto 0;
        font-family: 'Unbounded', sans-serif;
      }

      .slide-number { font-family: 'Unbounded', sans-serif; color: #FF2400; letter-spacing: 0.12em; }
      .slide-title  {
        font-size: 76px;
        letter-spacing: -2px;
        line-height: 0.94;
        color: #0A0A0A;
        text-transform: uppercase;
      }
      .slide-subtitle { font-family: 'Manrope', sans-serif; color: #444; font-size: 24px; }
      .divider { background: #0A0A0A; height: 4px; width: 64px; }
      .highlight-box { border-color: #FF2400; border-left-width: 4px; }
      .slide-body {
        font-family: 'Manrope', sans-serif;
        font-size: 36px;
        color: #222222;
        font-weight: 500;
        line-height: 1.55;
      }
      .tag {
        background: #0A0A0A;
        color: #F2EF00;
        border-radius: 0;
        font-family: 'Manrope', sans-serif;
      }
      .slide-counter {
        background: #0A0A0A;
        border: none;
        color: #F2EF00;
        border-radius: 0;
        font-family: 'Unbounded', sans-serif;
        font-size: 11px;
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 3 — WARM EDITORIAL
  // Cream background, dot-grid, peach radials — reference design
  // ══════════════════════════════════════════════════════════════════════════
  3: {
    id: 3,
    name: 'warm-editorial',
    label: 'Warm Editorial',
    googleFontsUrl: gFont('Onest:wght@400;500;700;800;900', 'Manrope:wght@400;500;600;700'),

    css: BASE_LAYOUT + `
      .slide {
        background: #F7F3EE;
        font-family: 'Onest', sans-serif;
        color: #0F0A05;
      }

      /* Peach radial blobs */
      .warm-blob-tl {
        width: 500px; height: 500px;
        top: -120px; left: -80px;
        background: radial-gradient(circle, rgba(255,179,140,0.52) 0%, rgba(255,150,100,0.20) 50%, transparent 70%);
      }
      .warm-blob-br {
        width: 420px; height: 420px;
        bottom: -80px; right: -60px;
        background: radial-gradient(circle, rgba(255,200,160,0.48) 0%, rgba(240,180,140,0.18) 50%, transparent 70%);
      }
      .warm-blob-tr {
        width: 300px; height: 300px;
        top: -50px; right: 80px;
        background: radial-gradient(circle, rgba(255,226,192,0.55) 0%, transparent 70%);
      }
      /* Refined dot-grid */
      .grid-overlay {
        background-image: radial-gradient(circle, rgba(140,90,40,0.17) 1.3px, transparent 1.3px);
        background-size: 30px 30px;
      }

      /* Full-height transparent card */
      .glass-card {
        background: transparent;
        padding: 56px 56px 90px;
      }

      .slide-number { font-family: 'JetBrains Mono', monospace; color: rgba(100,64,24,0.45); }
      .slide-title  {
        font-size: 96px;
        letter-spacing: -4px;
        line-height: 0.95;
        color: #0A0705;
        font-weight: 900;
      }
      .slide-subtitle { font-family: 'Manrope', sans-serif; color: rgba(45,28,10,0.75); }
      .divider { background: rgba(160,100,40,0.38); }
      .highlight-box { border-color: rgba(180,100,40,0.40); }
      .slide-body {
        font-family: 'Manrope', sans-serif;
        font-size: 38px;
        line-height: 1.58;
        color: #1F1208;
        font-weight: 500;
      }
      .tag {
        background: rgba(140,80,30,0.10);
        border: 1px solid rgba(140,80,30,0.22);
        color: rgba(100,55,15,0.80);
        font-family: 'Manrope', sans-serif;
      }
      .slide-counter {
        background: rgba(100,64,24,0.09);
        border: 1px solid rgba(100,64,24,0.16);
        color: rgba(80,52,20,0.60);
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 4 — MATRIX CYBERPUNK
  // Black, neon green, dot-grid, terminal aesthetic
  // ══════════════════════════════════════════════════════════════════════════
  4: {
    id: 4,
    name: 'cyberpunk',
    label: 'Matrix Cyberpunk',
    googleFontsUrl: gFont('JetBrains Mono:wght@400;600;700;800', 'Golos Text:wght@400;500;600;900'),

    css: BASE_LAYOUT + `
      .slide {
        background: #010B01;
        font-family: 'Golos Text', sans-serif;
        color: #FFFFFF;
      }

      /* Dot-grid overlay */
      .grid-overlay {
        background-image: radial-gradient(circle, rgba(0,255,65,0.18) 1px, transparent 1px);
        background-size: 36px 36px;
      }
      .scan-line   { top: 33%;  background: rgba(0,255,65,0.05); box-shadow: 0 0 80px 20px rgba(0,255,65,0.04); }
      .scan-line-v { left: 33%; background: rgba(0,255,65,0.04); }
      .corner-tl, .corner-tr, .corner-bl, .corner-br { border-color: rgba(0,255,65,0.55); }
      .top-accent { background: rgba(0,255,65,0.55); height: 2px; }

      /* Full-height card */
      .glass-card {
        background: rgba(0,255,65,0.025);
        border: 1px solid rgba(0,255,65,0.12);
        padding: 56px 56px 90px;
      }

      .slide-number { font-family: 'JetBrains Mono', monospace; color: #00FF41; opacity: 1; font-size: 12px; }
      .slide-title  {
        font-family: 'JetBrains Mono', monospace;
        font-size: 78px;
        letter-spacing: -1.5px;
        line-height: 1.0;
        color: #FFFFFF;
        font-weight: 800;
      }
      .slide-subtitle { font-family: 'JetBrains Mono', monospace; color: #00FF41; opacity: 0.72; font-size: 20px; letter-spacing: -0.5px; }
      .divider { background: linear-gradient(90deg, #00FF41, transparent); height: 2px; }
      .highlight-box { border-color: rgba(0,255,65,0.45); }
      .slide-body {
        font-size: 36px;
        line-height: 1.55;
        color: rgba(220,255,225,0.84);
        font-weight: 400;
      }
      .tag {
        background: rgba(0,255,65,0.10);
        border: 1px solid rgba(0,255,65,0.30);
        color: #00FF41;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
      }
      .slide-counter {
        background: rgba(0,255,65,0.08);
        border: 1px solid rgba(0,255,65,0.22);
        color: rgba(0,255,65,0.70);
        font-family: 'JetBrains Mono', monospace;
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 5 — OBSIDIAN PREMIUM
  // Near-black, gradient title, glow orbs — Apple × Vercel
  // ══════════════════════════════════════════════════════════════════════════
  5: {
    id: 5,
    name: 'apple-premium',
    label: 'Obsidian Premium',
    googleFontsUrl: gFont('Golos Text:wght@400;500;600;700;800;900', 'JetBrains Mono:wght@700'),

    css: BASE_LAYOUT + `
      .slide {
        background: linear-gradient(160deg, #07060F 0%, #0D0B1A 50%, #080614 100%);
        font-family: 'Golos Text', sans-serif;
        color: #FFFFFF;
      }

      /* Glow orbs */
      .glow-orb-1 {
        width: 600px; height: 500px;
        top: -150px; right: -100px;
        background: radial-gradient(circle, rgba(120,80,255,0.22) 0%, transparent 65%);
      }
      .glow-orb-2 {
        width: 450px; height: 400px;
        bottom: -80px; left: -80px;
        background: radial-gradient(circle, rgba(168,85,247,0.16) 0%, transparent 65%);
      }
      .glow-orb-3 {
        width: 300px; height: 300px;
        top: 40%; left: 30%;
        background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
      }
      .top-accent { background: linear-gradient(90deg, transparent, #7C3AED, #A78BFA, #7C3AED, transparent); height: 1px; }
      .grid-overlay {
        background-image: linear-gradient(rgba(255,255,255,0.020) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.020) 1px, transparent 1px);
        background-size: 64px 64px;
      }

      /* Full-height transparent card */
      .glass-card { padding: 56px 56px 90px; }

      .slide-number { font-family: 'JetBrains Mono', monospace; color: #A78BFA; }
      .slide-title  {
        font-size: 92px;
        letter-spacing: -4px;
        line-height: 0.96;
        background: linear-gradient(145deg, #FFFFFF 0%, #E0D8FF 50%, #C4B5FD 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 900;
      }
      .slide-subtitle { color: rgba(196,181,253,0.62); letter-spacing: -0.01em; }
      .divider { background: linear-gradient(90deg, #7C3AED, transparent); }
      .highlight-box { border-color: rgba(124,58,237,0.45); background: rgba(124,58,237,0.04); border-radius: 0 8px 8px 0; }
      .slide-body {
        font-size: 36px;
        line-height: 1.76;
        color: rgba(235,228,255,0.80);
        font-weight: 400;
      }
      .tag {
        background: rgba(124,58,237,0.15);
        border: 1px solid rgba(124,58,237,0.32);
        color: #C4B5FD;
      }
      .slide-counter {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.09);
        color: rgba(200,180,255,0.50);
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 6 — CHROME Y2K
  // Chromatic retro-futurism, holographic, acid
  // ══════════════════════════════════════════════════════════════════════════
  6: {
    id: 6,
    name: 'y2k-acid',
    label: 'Chrome Y2K',
    googleFontsUrl: gFont('Russo One:wght@400', 'Manrope:wght@400;500;600;700;800'),

    css: BASE_LAYOUT + `
      .slide {
        background: linear-gradient(135deg, #13003E 0%, #1A0050 30%, #2D0068 60%, #0D002A 100%);
        font-family: 'Russo One', sans-serif;
        color: #FFFFFF;
        padding: 52px 48px;
      }

      /* Chrome floating card */
      .glass-card {
        background: linear-gradient(145deg,
          rgba(255,255,255,0.12) 0%,
          rgba(255,255,255,0.06) 50%,
          rgba(255,255,255,0.10) 100%);
        backdrop-filter: blur(36px) saturate(200%) brightness(1.1);
        -webkit-backdrop-filter: blur(36px) saturate(200%) brightness(1.1);
        border: 1px solid rgba(255,255,255,0.22);
        border-bottom: 1px solid rgba(255,255,255,0.10);
        border-right: 1px solid rgba(255,255,255,0.10);
        border-radius: 28px;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.25),
          0 40px 80px rgba(0,0,0,0.55),
          0 0 0 1px rgba(255,255,255,0.05);
        padding: 56px 56px 90px;
        flex: none;
        margin: auto 0;
      }

      .blob.blob-1 {
        width: 500px; height: 400px;
        top: -100px; left: -100px;
        background: radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(139,92,246,0.18) 60%, transparent 80%);
      }
      .blob.blob-2 {
        width: 400px; height: 350px;
        bottom: -80px; right: -80px;
        background: radial-gradient(circle, rgba(236,72,153,0.45) 0%, rgba(168,85,247,0.15) 60%, transparent 80%);
      }
      .aurora-noise { opacity: 0.30; }

      .slide-number { color: rgba(255,255,255,0.40); font-family: 'Manrope', sans-serif; }
      .slide-title  {
        font-size: 82px;
        letter-spacing: -1px;
        line-height: 0.98;
        color: #FFFFFF;
        font-weight: 400;
        text-transform: uppercase;
        text-shadow: 0 0 60px rgba(168,85,247,0.55), 0 0 20px rgba(236,72,153,0.35);
      }
      .slide-subtitle { font-family: 'Manrope', sans-serif; color: rgba(255,255,255,0.58); font-size: 26px; }
      .divider { background: linear-gradient(90deg, #EC4899, #A855F7, transparent); }
      .highlight-box { border-color: rgba(168,85,247,0.55); }
      .slide-body {
        font-family: 'Manrope', sans-serif;
        font-size: 36px;
        line-height: 1.74;
        color: rgba(255,245,255,0.82);
        font-weight: 400;
      }
      .tag {
        font-family: 'Manrope', sans-serif;
        background: rgba(255,255,255,0.10);
        border: 1px solid rgba(255,255,255,0.22);
        color: rgba(255,255,255,0.80);
      }
      .slide-counter {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        color: rgba(255,255,255,0.45);
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 7 — SOFT GRADIENT
  // Lavender, floating white glass card, pastel
  // ══════════════════════════════════════════════════════════════════════════
  7: {
    id: 7,
    name: 'soft-gradient',
    label: 'Soft Gradient',
    googleFontsUrl: gFont('Onest:wght@400;500;600;700;800;900', 'Manrope:wght@400;500;600'),

    css: BASE_LAYOUT + `
      .slide {
        background: linear-gradient(145deg, #EDE9F8 0%, #F0EBF9 30%, #E8DFFA 60%, #EEE7FF 100%);
        font-family: 'Onest', sans-serif;
        color: #1A0F2E;
        padding: 56px 52px;
      }

      .warm-blob-tl {
        width: 480px; height: 420px;
        top: -80px; left: -80px;
        background: radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(139,92,246,0.12) 55%, transparent 75%);
      }
      .warm-blob-br {
        width: 400px; height: 380px;
        bottom: -60px; right: -60px;
        background: radial-gradient(circle, rgba(196,172,255,0.40) 0%, rgba(167,139,250,0.15) 55%, transparent 75%);
      }
      .top-accent { background: linear-gradient(90deg, #A78BFA, #C4B5FD, #A78BFA); height: 3px; opacity: 0.70; }

      /* Floating white glass card */
      .glass-card {
        background: rgba(255,255,255,0.72);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255,255,255,0.90);
        border-radius: 28px;
        box-shadow: 0 24px 72px rgba(100,60,200,0.12), 0 2px 0 rgba(255,255,255,0.80) inset;
        padding: 56px 56px 90px;
        flex: none;
        margin: auto 0;
      }

      .slide-number { color: rgba(100,60,160,0.38); }
      .slide-title  {
        font-size: 84px;
        letter-spacing: -3px;
        line-height: 0.97;
        color: #0F0820;
        font-weight: 900;
      }
      .slide-subtitle { font-family: 'Manrope', sans-serif; color: rgba(80,50,140,0.58); }
      .divider { background: linear-gradient(90deg, #A78BFA, transparent); }
      .highlight-box { border-color: rgba(124,58,237,0.30); background: rgba(139,92,246,0.04); border-radius: 0 8px 8px 0; }
      .slide-body {
        font-family: 'Manrope', sans-serif;
        font-size: 36px;
        line-height: 1.55;
        color: #2D1F4A;
        font-weight: 400;
      }
      .tag {
        font-family: 'Manrope', sans-serif;
        background: rgba(139,92,246,0.10);
        border: 1px solid rgba(139,92,246,0.22);
        color: rgba(100,55,200,0.80);
      }
      .slide-counter {
        background: rgba(139,92,246,0.08);
        border: 1px solid rgba(139,92,246,0.16);
        color: rgba(80,40,160,0.50);
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 8 — CUSTOM BRAND (placeholder)
  // ══════════════════════════════════════════════════════════════════════════
  8: {
    id: 8,
    name: 'custom-brand',
    label: 'Custom Brand',
    googleFontsUrl: gFont('Golos Text:wght@400;500;600;700;900', 'Manrope:wght@400;500;600'),
    css: BASE_LAYOUT + `
      .slide {
        background: #0F0F0F;
        font-family: 'Golos Text', sans-serif;
        color: #FFFFFF;
      }
      .glass-card { padding: 56px 56px 90px; }
      .slide-body { font-size: 36px; line-height: 1.55; color: rgba(255,255,255,0.80); }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 9 — INK & PAPER  [NEW]
  // Pure white, editorial serif energy, maximum readability, red accent
  // ══════════════════════════════════════════════════════════════════════════
  9: {
    id: 9,
    name: 'ink-paper',
    label: 'Ink & Paper',
    googleFontsUrl: gFont('Onest:wght@400;700;800;900', 'Manrope:wght@400;500;600;700'),

    css: BASE_LAYOUT + `
      .slide {
        background: #FFFFFF;
        font-family: 'Onest', sans-serif;
        color: #0A0A0A;
      }

      /* Red left rule — like a notebook margin */
      .ink-rule {
        background: #E53E3E;
        left: 72px;
        top: 88px;
        bottom: 80px;
      }

      /* Subtle top line */
      .top-accent {
        background: #E53E3E;
        height: 5px;
        right: auto;
        width: 120px;
        left: 0;
        top: 0;
      }

      /* Full-height transparent card */
      .glass-card {
        padding: 56px 56px 90px 100px; /* left indent past the red rule */
      }

      .slide-number {
        font-family: 'Manrope', monospace;
        color: #E53E3E;
        opacity: 1;
        font-size: 14px;
        letter-spacing: 0.20em;
      }
      .slide-title  {
        font-size: 96px;
        letter-spacing: -4.5px;
        line-height: 0.94;
        color: #0A0A0A;
        font-weight: 900;
        margin-top: 4px;
      }
      .slide-subtitle {
        font-family: 'Manrope', sans-serif;
        font-size: 26px;
        color: #555555;
        font-weight: 500;
        letter-spacing: -0.01em;
      }
      .divider { background: #E53E3E; height: 2px; width: 40px; }
      .highlight-box {
        border-color: #E53E3E;
        border-left-width: 2px;
        padding-left: 24px;
      }
      .slide-body {
        font-family: 'Manrope', sans-serif;
        font-size: 36px;
        line-height: 1.82;
        color: #1A1A1A;
        font-weight: 400;
        letter-spacing: 0.005em;
      }
      .tag {
        font-family: 'Manrope', sans-serif;
        background: #F5F5F5;
        border: 1px solid #DCDCDC;
        color: #333333;
      }
      .slide-counter {
        background: rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.10);
        color: rgba(0,0,0,0.40);
        font-family: 'Manrope', monospace;
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 10 — DEEP SPACE  [NEW]
  // Near-black blue, warm gold accents, luxury premium feel
  // ══════════════════════════════════════════════════════════════════════════
  10: {
    id: 10,
    name: 'deep-space',
    label: 'Deep Space',
    googleFontsUrl: gFont('Golos Text:wght@400;500;600;700;800;900', 'JetBrains Mono:wght@600;700'),

    css: BASE_LAYOUT + `
      .slide {
        background: radial-gradient(ellipse 130% 90% at 50% 0%, #0C1428 0%, #050D1E 45%, #030810 100%);
        font-family: 'Golos Text', sans-serif;
        color: #FFFFFF;
      }

      /* Star-field: tiny dots */
      .star-field {
        background-image:
          radial-gradient(circle 1px at 10% 15%, rgba(255,220,100,0.55) 0, transparent 1px),
          radial-gradient(circle 1px at 80% 10%, rgba(255,255,255,0.45) 0, transparent 1px),
          radial-gradient(circle 1px at 25% 75%, rgba(255,255,255,0.30) 0, transparent 1px),
          radial-gradient(circle 1px at 65% 55%, rgba(255,220,100,0.35) 0, transparent 1px),
          radial-gradient(circle 1px at 90% 80%, rgba(255,255,255,0.40) 0, transparent 1px),
          radial-gradient(circle 1px at 45% 35%, rgba(255,220,100,0.25) 0, transparent 1px),
          radial-gradient(circle 2px at 72% 28%, rgba(255,220,100,0.55) 0, transparent 2px),
          radial-gradient(circle 1px at 12% 48%, rgba(255,255,255,0.35) 0, transparent 1px),
          radial-gradient(circle 1px at 55% 88%, rgba(255,255,255,0.30) 0, transparent 1px),
          radial-gradient(circle 1px at 33% 20%, rgba(255,255,255,0.25) 0, transparent 1px),
          radial-gradient(circle 1px at 88% 45%, rgba(255,220,100,0.30) 0, transparent 1px),
          radial-gradient(circle 1px at 5% 90%, rgba(255,255,255,0.40) 0, transparent 1px);
      }

      /* Gold glow at bottom */
      .gold-accent-br {
        width: 500px; height: 500px;
        bottom: -180px; right: -100px;
        background: radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(217,119,6,0.08) 50%, transparent 70%);
        filter: blur(80px);
      }
      .glow-orb-1 {
        width: 450px; height: 380px;
        top: -80px; left: -80px;
        background: radial-gradient(circle, rgba(30,60,120,0.60) 0%, transparent 70%);
      }
      .top-accent  { background: linear-gradient(90deg, transparent, rgba(245,158,11,0.70), transparent); height: 1px; }

      /* Full-height card */
      .glass-card { padding: 56px 56px 90px; }

      .slide-number { font-family: 'JetBrains Mono', monospace; color: #F59E0B; opacity: 1; }
      .slide-title  {
        font-size: 92px;
        letter-spacing: -4px;
        line-height: 0.96;
        color: #FFFFFF;
        font-weight: 900;
      }
      .slide-subtitle { color: rgba(245,210,120,0.62); letter-spacing: -0.01em; }
      .divider { background: linear-gradient(90deg, #F59E0B, rgba(245,158,11,0.20), transparent); }
      .highlight-box {
        border-color: rgba(245,158,11,0.45);
        background: rgba(245,158,11,0.04);
        border-radius: 0 8px 8px 0;
        padding: 12px 0 12px 28px;
        margin-top: 32px;
      }
      .slide-body {
        font-size: 36px;
        line-height: 1.55;
        color: rgba(255,245,220,0.82);
        font-weight: 400;
        letter-spacing: 0.005em;
      }
      .tag {
        background: rgba(245,158,11,0.12);
        border: 1px solid rgba(245,158,11,0.30);
        color: #FCD34D;
      }
      .slide-counter {
        background: rgba(245,158,11,0.07);
        border: 1px solid rgba(245,158,11,0.18);
        color: rgba(245,200,80,0.55);
        font-family: 'JetBrains Mono', monospace;
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 11 — CONCRETE SWISS  [NEW]
  // Light gray, signal red, Swiss grid — maximum typographic precision
  // ══════════════════════════════════════════════════════════════════════════
  11: {
    id: 11,
    name: 'concrete-swiss',
    label: 'Concrete Swiss',
    googleFontsUrl: gFont('Unbounded:wght@400;700;800;900', 'Manrope:wght@400;500;600;700'),

    css: BASE_LAYOUT + `
      .slide {
        background: #EFEFED;
        font-family: 'Unbounded', sans-serif;
        color: #111111;
      }

      /* Red top bar — Swiss design hallmark */
      .swiss-top { background: #DC2626; }

      /* Subtle grid lines (Swiss grid system) */
      .swiss-grid {
        background-image:
          linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
        background-size: 108px 108px;
      }

      /* Full-height transparent card */
      .glass-card {
        padding: 56px 56px 90px;
      }

      .slide-number {
        font-family: 'Manrope', monospace;
        color: #DC2626;
        opacity: 1;
        font-size: 13px;
        letter-spacing: 0.22em;
      }
      .slide-title  {
        font-size: 88px;
        letter-spacing: -3px;
        line-height: 0.94;
        color: #111111;
        font-weight: 900;
        text-transform: uppercase;
      }
      .slide-subtitle {
        font-family: 'Manrope', sans-serif;
        font-size: 26px;
        font-weight: 600;
        color: #DC2626;
        letter-spacing: -0.01em;
        opacity: 1;
        text-transform: uppercase;
        font-size: 17px;
        letter-spacing: 0.08em;
      }
      .divider { background: #DC2626; height: 3px; width: 48px; border-radius: 0; }
      .highlight-box {
        border-color: #DC2626;
        border-left-width: 3px;
        padding-left: 24px;
        margin-top: 32px;
      }
      .slide-body {
        font-family: 'Manrope', sans-serif;
        font-size: 36px;
        line-height: 1.55;
        color: #1C1C1C;
        font-weight: 400;
        letter-spacing: 0.005em;
      }
      .tag {
        font-family: 'Manrope', sans-serif;
        background: transparent;
        border: 2px solid #111111;
        color: #111111;
        border-radius: 0;
        font-size: 11px;
        letter-spacing: 0.14em;
      }
      .slide-counter {
        background: #111111;
        border: none;
        color: #EFEFED;
        border-radius: 0;
        font-family: 'Manrope', monospace;
      }
    `,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 12 — SAKURA NEON  [NEW]
  // Pure black, pink + cyan neon, anime/tokyo night aesthetic
  // ══════════════════════════════════════════════════════════════════════════
  12: {
    id: 12,
    name: 'sakura-neon',
    label: 'Sakura Neon',
    googleFontsUrl: gFont('Golos Text:wght@400;500;600;700;800;900', 'JetBrains Mono:wght@500;700'),

    css: BASE_LAYOUT + `
      .slide {
        background: #050505;
        font-family: 'Golos Text', sans-serif;
        color: #FFFFFF;
      }

      /* Grid */
      .grid-overlay {
        background-image:
          linear-gradient(rgba(255,40,130,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.06) 1px, transparent 1px);
        background-size: 60px 60px;
      }

      /* Neon blobs */
      .neon-line-h {
        top: 42%;
        background: linear-gradient(90deg, transparent, rgba(255,40,130,0.35), rgba(0,229,255,0.35), transparent);
        height: 1px;
        box-shadow: 0 0 24px 2px rgba(255,40,130,0.18), 0 0 24px 2px rgba(0,229,255,0.18);
      }
      .neon-line-v {
        left: 45%;
        background: linear-gradient(180deg, transparent, rgba(0,229,255,0.20), transparent);
      }
      .blob.blob-1 {
        width: 600px; height: 400px;
        top: -100px; right: -100px;
        background: radial-gradient(circle, rgba(255,40,130,0.22) 0%, transparent 65%);
        filter: blur(70px);
      }
      .blob.blob-2 {
        width: 450px; height: 380px;
        bottom: -60px; left: -80px;
        background: radial-gradient(circle, rgba(0,229,255,0.20) 0%, transparent 65%);
        filter: blur(65px);
      }

      /* Card with neon border */
      .glass-card {
        border-top: 1px solid rgba(255,40,130,0.30);
        border-left: 1px solid rgba(0,229,255,0.22);
        border-right: 1px solid rgba(255,40,130,0.12);
        border-bottom: 1px solid rgba(0,229,255,0.12);
        background: rgba(255,255,255,0.025);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 56px 56px 90px;
      }

      .slide-number {
        font-family: 'JetBrains Mono', monospace;
        background: linear-gradient(90deg, #FF2882, #00E5FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 1;
        font-size: 12px;
        letter-spacing: 0.20em;
      }
      .slide-title  {
        font-size: 88px;
        letter-spacing: -3.5px;
        line-height: 0.96;
        font-weight: 900;
        background: linear-gradient(120deg, #FF2882 0%, #FFFFFF 45%, #00E5FF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 0 30px rgba(255,40,130,0.25));
      }
      .slide-subtitle {
        color: rgba(0,229,255,0.70);
        font-size: 26px;
        letter-spacing: -0.01em;
      }
      .divider { background: linear-gradient(90deg, #FF2882, #00E5FF, transparent); }
      .highlight-box {
        border-image: linear-gradient(180deg, #FF2882, #00E5FF) 1;
        border-color: #FF2882;
      }
      .slide-body {
        font-size: 36px;
        line-height: 1.55;
        color: rgba(240,248,255,0.82);
        font-weight: 400;
        letter-spacing: 0.01em;
      }
      .tag {
        background: rgba(255,40,130,0.10);
        border: 1px solid rgba(255,40,130,0.32);
        color: #FF6EB4;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
      }
      .slide-counter {
        background: rgba(0,229,255,0.06);
        border: 1px solid rgba(0,229,255,0.22);
        color: rgba(0,229,255,0.58);
        font-family: 'JetBrains Mono', monospace;
      }
    `,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getTheme(id: ThemeId): ThemeDefinition {
  const t = THEMES[id];
  if (!t) throw new Error(`Unknown theme id: ${id}. Valid: 1-12`);
  return t;
}

// ── Mobile readability enforcement — applied AFTER theme CSS ─────────────────
const READABILITY_BOOST = `
  .slide-body { font-size: 38px; font-weight: 500; }
`;

export function resolveThemeCSS(theme: ThemeDefinition, customCss?: string): string {
  return theme.css + '\n' + READABILITY_BOOST + (customCss ? '\n' + customCss : '');
}

// ─────────────────────────────────────────────────────────────────────────────
// BRAND COLOR OVERLAY  (used by aim_auto_brand_colors)
// ─────────────────────────────────────────────────────────────────────────────
export function generateBrandColorOverlay(
  primary: string,
  secondary: string,
  text: string = '#FFFFFF',
): string {
  return `
    /* ── Brand Color Overlay ── */
    .slide-title { color: ${text} !important; -webkit-text-fill-color: ${text} !important; }
    .slide-subtitle { color: ${text} !important; opacity: 0.70; }
    .slide-body { color: ${text} !important; opacity: 0.82; }
    .divider { background: ${primary} !important; }
    .highlight-box { border-color: ${primary} !important; }
    .top-accent { background: ${primary} !important; }
    .tag { background: color-mix(in srgb, ${primary} 16%, transparent) !important; border-color: color-mix(in srgb, ${primary} 40%, transparent) !important; color: ${primary} !important; }
    .slide-counter { border-color: color-mix(in srgb, ${text} 20%, transparent) !important; color: ${text} !important; opacity: 0.55; }
    .aurora-1 { background: radial-gradient(circle, color-mix(in srgb, ${primary} 50%, transparent) 0%, transparent 70%) !important; }
    .glow-orb-1 { background: radial-gradient(circle, color-mix(in srgb, ${primary} 25%, transparent) 0%, transparent 70%) !important; }
    .glow-orb-2 { background: radial-gradient(circle, color-mix(in srgb, ${secondary} 18%, transparent) 0%, transparent 70%) !important; }
    .step-num { border-color: color-mix(in srgb, ${primary} 45%, transparent) !important; }
  `.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// FONT CATALOGUE  (used by index.ts)
// ─────────────────────────────────────────────────────────────────────────────
const FONT_CATALOGUE = [
  'Golos Text', 'Onest', 'Manrope', 'Unbounded', 'JetBrains Mono',
  'Russo One', 'Jura', 'Inter', 'Roboto', 'Nunito', 'Playfair Display',
  'Cormorant Garamond', 'Montserrat', 'Raleway', 'Oswald', 'Exo 2',
  'Fira Code', 'Source Code Pro', 'PT Sans', 'PT Serif',
];

export function listAvailableFonts(): string[] {
  return FONT_CATALOGUE;
}

