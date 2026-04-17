/**
 * AIM Instagram Suite — Core: Slide Layouts v4 PREMIUM
 * 10 уникальных лейаутов. Premium CTA-баннер. Новая нумерация.
 */

export type SlideLayout =
  | 'standard'
  | 'hero-number'
  | 'grid-2x2'
  | 'good-bad'
  | 'before-after'
  | 'steps-3'
  | 'quote'
  | 'checklist'
  | 'comparison'
  | 'cta-final';

export interface LayoutBlock {
  label?: string;
  value: string;
  accent?: boolean;
}

export interface ExtendedSlideData {
  slideNumber: number;
  layout?: SlideLayout;
  title: string;
  subtitle?: string;
  body?: string;
  emoji?: string;
  tag?: string;
  ctaText?: string;
  blocks?: LayoutBlock[];
  leftBlocks?: LayoutBlock[];
  rightBlocks?: LayoutBlock[];
  heroNumber?: string;
  heroUnit?: string;
  quoteText?: string;
  quoteAuthor?: string;
  customHtml?: string;
}

// ── Premium CTA баннер (legacy, for layouts that use it inline) ───────────────
export function buildCtaBanner(ctaText?: string): string {
  if (!ctaText) return '';
  return `
    <div class="cta-banner" aria-label="Призыв к действию">
      <span class="cta-text">${escHtml(ctaText)}</span>
    </div>`;
}

// ── Legacy Slide Counter ──────────────────────────────────────────────────────
export function buildSlideCounter(num: number, total: number): string {
  const n = String(num).padStart(2, '0');
  const t = String(total).padStart(2, '0');
  return `<div class="slide-counter" aria-label="Слайд ${num} из ${total}">
    <span class="slide-counter-current">${n}</span>
    <span class="slide-counter-sep">/</span>
    <span class="slide-counter-total">${t}</span>
  </div>`;
}

// ── UNIFIED FOOTER: CTA + Counter на одной линии внизу ────────────────────────
export function buildSlideFooter(num: number, total: number, ctaText?: string): string {
  const n = String(num).padStart(2, '0');
  const t = String(total).padStart(2, '0');
  return `<div class="slide-footer">
    <span class="footer-cta">${ctaText ? escHtml(ctaText) : ''}</span>
    <span class="footer-counter">
      <span class="footer-counter-current">${n}</span>
      <span class="footer-counter-sep">/</span>
      <span class="footer-counter-total">${t}</span>
    </span>
  </div>`;
}

// ── ЛЕЙАУТ 1: Standard ────────────────────────────────────────────────────────
export function renderStandard(slide: ExtendedSlideData, total: number): string {
  const { title, subtitle, body, emoji, tag, ctaText } = slide;
  return `
    <div class="glass-card layout-standard">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${emoji ? `<span class="emoji-icon" role="img">${escHtml(emoji)}</span>` : ''}
      <h1 class="slide-title">${escHtml(title)}</h1>
      ${subtitle ? `<p class="slide-subtitle">${escHtml(subtitle)}</p>` : ''}
      <div class="spacer"></div>
      ${body ? `<div class="highlight-box"><p class="slide-body">${nl2br(body)}</p></div>` : ''}
      ${tag ? `<span class="tag">${escHtml(tag)}</span>` : ''}
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 2: Hero Number ─────────────────────────────────────────────────────
export function renderHeroNumber(slide: ExtendedSlideData, total: number): string {
  const { title, subtitle, body, heroNumber, heroUnit, emoji, ctaText } = slide;
  return `
    <div class="glass-card layout-hero-number">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${emoji ? `<span class="emoji-icon" role="img">${escHtml(emoji)}</span>` : ''}
      <div class="hero-stat">
        <span class="hero-num">${escHtml(heroNumber ?? title ?? '?')}</span>
        ${heroUnit ? `<span class="hero-unit">${escHtml(heroUnit)}</span>` : ''}
      </div>
      ${subtitle ? `<p class="slide-subtitle">${escHtml(subtitle)}</p>` : ''}
      ${body ? `<p class="slide-body" style="text-align:center;">${nl2br(body)}</p>` : ''}
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 3: Grid 2×2 ───────────────────────────────────────────────────────
export function renderGrid2x2(slide: ExtendedSlideData, total: number): string {
  const { title, blocks = [], ctaText } = slide;
  const cells = blocks.slice(0, 4).map(b => `
    <div class="grid-cell ${b.accent ? 'grid-cell--accent' : ''}">
      ${b.label ? `<span class="grid-label">${escHtml(b.label)}</span>` : ''}
      <p class="grid-value">${nl2br(b.value)}</p>
    </div>`).join('');
  return `
    <div class="glass-card layout-grid2x2">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${slide.emoji ? `<span class="emoji-icon" role="img">${escHtml(slide.emoji)}</span>` : ''}
      <h1 class="slide-title">${escHtml(title)}</h1>
      <div class="grid2x2">${cells}</div>
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 4: Good / Bad ─────────────────────────────────────────────────────
export function renderGoodBad(slide: ExtendedSlideData, total: number): string {
  const { title, blocks = [], leftBlocks, rightBlocks, ctaText } = slide;
  let goodItems: string[] = [];
  let badItems: string[] = [];

  if (leftBlocks && leftBlocks.length > 0) {
    goodItems = leftBlocks.map(b => escHtml(b.value));
    badItems = (rightBlocks || []).map(b => escHtml(b.value));
  } else if (blocks.length >= 2) {
    goodItems = [nl2br(blocks[0]?.value || '')];
    badItems = [nl2br(blocks[1]?.value || '')];
  }

  const goodCells = goodItems.map(t => `<li class="gb-item gb-good"><span class="gb-icon">✓</span><span class="gb-text">${t}</span></li>`).join('');
  const badCells = badItems.map(t => `<li class="gb-item gb-bad"><span class="gb-icon">✗</span><span class="gb-text">${t}</span></li>`).join('');

  return `
    <div class="glass-card layout-good-bad">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${slide.emoji ? `<span class="emoji-icon" role="img">${escHtml(slide.emoji)}</span>` : ''}
      <h1 class="slide-title">${escHtml(title)}</h1>
      <div class="gb-split">
        <div class="gb-col">
          <div class="gb-header good-header">✅ Правильно</div>
          <ul class="gb-list">${goodCells}</ul>
        </div>
        <div class="gb-divider"></div>
        <div class="gb-col">
          <div class="gb-header bad-header">❌ Ошибка</div>
          <ul class="gb-list">${badCells}</ul>
        </div>
      </div>
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 5: Before / After ─────────────────────────────────────────────────
export function renderBeforeAfter(slide: ExtendedSlideData, total: number): string {
  const { title, blocks = [], leftBlocks, rightBlocks, ctaText } = slide;
  let beforeText = '';
  let afterText = '';

  if (leftBlocks && leftBlocks.length > 0) {
    beforeText = leftBlocks.map(b => escHtml(b.value)).join('<br>');
    afterText = (rightBlocks || []).map(b => escHtml(b.value)).join('<br>');
  } else if (blocks.length >= 2) {
    beforeText = nl2br(blocks[0]?.value || '');
    afterText = nl2br(blocks[1]?.value || '');
  }

  return `
    <div class="glass-card layout-before-after">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${slide.emoji ? `<span class="emoji-icon" role="img">${escHtml(slide.emoji)}</span>` : ''}
      <h1 class="slide-title">${escHtml(title)}</h1>
      <div class="ba-container">
        <div class="ba-section ba-before">
          <div class="ba-label">ДО</div>
          <p class="ba-text">${beforeText || '—'}</p>
        </div>
        <div class="ba-arrow">↓</div>
        <div class="ba-section ba-after">
          <div class="ba-label">ПОСЛЕ</div>
          <p class="ba-text">${afterText || '—'}</p>
        </div>
      </div>
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 6: Steps-3 ────────────────────────────────────────────────────────
export function renderSteps3(slide: ExtendedSlideData, total: number): string {
  const { title, blocks = [], ctaText } = slide;
  const steps = blocks.slice(0, 3).map((b, i) => `
    <div class="step-card">
      <div class="step-num">${i + 1}</div>
      ${b.label ? `<div class="step-label">${escHtml(b.label)}</div>` : ''}
      <p class="step-body">${nl2br(b.value)}</p>
    </div>`).join('');
  return `
    <div class="glass-card layout-steps3">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${slide.emoji ? `<span class="emoji-icon" role="img">${escHtml(slide.emoji)}</span>` : ''}
      <h1 class="slide-title">${escHtml(title)}</h1>
      <div class="steps-row">${steps}</div>
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 7: Quote ──────────────────────────────────────────────────────────
export function renderQuote(slide: ExtendedSlideData, total: number): string {
  const { quoteText, quoteAuthor, subtitle, ctaText } = slide;
  return `
    <div class="glass-card layout-quote">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      <div class="quote-mark">"</div>
      <blockquote class="quote-text">${nl2br(quoteText ?? slide.title)}</blockquote>
      ${quoteAuthor || subtitle ? `<div class="quote-author">— ${escHtml(quoteAuthor || subtitle || '')}</div>` : ''}
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 8: Checklist ───────────────────────────────────────────────────────
export function renderChecklist(slide: ExtendedSlideData, total: number): string {
  const { title, subtitle, blocks = [], ctaText } = slide;
  const items = blocks.map(b => `
    <div class="check-item ${b.accent ? 'check-item--accent' : ''}">
      <span class="check-mark">${b.accent ? '🔥' : '☑'}</span>
      <span class="check-text">${nl2br(b.value)}</span>
    </div>`).join('');
  return `
    <div class="glass-card layout-checklist">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${slide.emoji ? `<span class="emoji-icon" role="img">${escHtml(slide.emoji)}</span>` : ''}
      <h1 class="slide-title">${escHtml(title)}</h1>
      ${subtitle ? `<p class="slide-subtitle">${escHtml(subtitle)}</p>` : ''}
      <div class="checklist">${items}</div>
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 9: Comparison ─────────────────────────────────────────────────────
export function renderComparison(slide: ExtendedSlideData, total: number): string {
  const { title, subtitle, leftBlocks = [], rightBlocks = [], blocks = [], ctaText } = slide;
  const headerA = blocks[0]?.label ?? 'Вариант A';
  const headerB = blocks[1]?.label ?? 'Вариант B';
  const maxRows = Math.max(leftBlocks.length, rightBlocks.length);
  const rows = Array.from({ length: maxRows }, (_, i) => `
    <div class="cmp-row">
      <div class="cmp-card cmp-a">${escHtml(leftBlocks[i]?.value ?? '—')}</div>
      <div class="cmp-card cmp-b">${escHtml(rightBlocks[i]?.value ?? '—')}</div>
    </div>`).join('');
  return `
    <div class="glass-card layout-comparison">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${slide.emoji ? `<span class="emoji-icon" role="img">${escHtml(slide.emoji)}</span>` : ''}
      <h1 class="slide-title">${escHtml(title)}</h1>
      ${subtitle ? `<p class="slide-subtitle">${escHtml(subtitle)}</p>` : ''}
      <div class="cmp-list">
        <div class="cmp-header-row">
          <div class="cmp-head cmp-ha">${escHtml(headerA)}</div>
          <div class="cmp-head cmp-hb">${escHtml(headerB)}</div>
        </div>
        ${rows}
      </div>
    </div>
    ${buildSlideFooter(slide.slideNumber, total, ctaText)}`;
}

// ── ЛЕЙАУТ 10: CTA Final ─────────────────────────────────────────────────────
export function renderCtaFinal(slide: ExtendedSlideData, total: number): string {
  const { title, subtitle, body, emoji, ctaText } = slide;
  return `
    <div class="glass-card layout-cta-final">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${emoji ? `<span class="emoji-icon emoji-large" role="img">${escHtml(emoji)}</span>` : ''}
      <h1 class="slide-title cta-main-title">${escHtml(title)}</h1>
      ${subtitle ? `<p class="slide-subtitle">${escHtml(subtitle)}</p>` : ''}
      ${body ? `<div class="highlight-box"><p class="slide-body">${nl2br(body)}</p></div>` : ''}
      ${ctaText
        ? `<div class="cta-banner cta-banner--large">
             <span class="cta-text">${escHtml(ctaText)}</span>
           </div>`
        : ''}
    </div>
    ${buildSlideFooter(slide.slideNumber, total)}`;
}

// ── Диспетчер лейаутов ────────────────────────────────────────────────────────
export function renderSlideLayout(slide: ExtendedSlideData, total: number = 1): string {
  const layout = slide.layout ?? 'standard';
  switch (layout) {
    case 'hero-number':  return renderHeroNumber(slide, total);
    case 'grid-2x2':     return renderGrid2x2(slide, total);
    case 'good-bad':     return renderGoodBad(slide, total);
    case 'before-after': return renderBeforeAfter(slide, total);
    case 'steps-3':      return renderSteps3(slide, total);
    case 'quote':        return renderQuote(slide, total);
    case 'checklist':    return renderChecklist(slide, total);
    case 'comparison':   return renderComparison(slide, total);
    case 'cta-final':    return renderCtaFinal(slide, total);
    default:             return renderStandard(slide, total);
  }
}

/** CSS для всех лейаутов — premier версия */
export const LAYOUTS_CSS = `
/* ══════════════════════════════════════════════════════
   AIM LAYOUT SYSTEM v5 — ZERO WHITESPACE
   ══════════════════════════════════════════════════════ */

/* ── UNIFIED FOOTER: CTA + Counter on ОДНОЙ ЛИНИИ ─────────────────── */
.slide-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 42px 32px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.02em;
  opacity: 0.58;
  color: inherit;
}
.slide-footer .footer-cta { flex: 1; font-size: 18px; }
.slide-footer .footer-counter {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: 0.85;
  white-space: nowrap;
  background: rgba(128,128,128,0.08);
  padding: 7px 18px;
  border-radius: 100px;
}
.footer-counter-current { font-weight: 800; }
.footer-counter-sep { opacity: 0.4; margin: 0 2px; }
.footer-counter-total { opacity: 0.55; }

/* LEGACY slide-counter support (for backward compat) */
.slide-counter {
  position: absolute;
  bottom: 28px;
  right: 36px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0,0,0,0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 100px;
  padding: 6px 16px;
  z-index: 10;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  color: inherit;
  opacity: 0.65;
}
/* Для светлых тем */
[data-theme="warm-editorial"] .slide-counter,
[data-theme="soft-gradient"] .slide-counter,
[data-theme="ink-paper"] .slide-counter,
[data-theme="concrete-swiss"] .slide-counter {
  background: rgba(0,0,0,0.07);
  border-color: rgba(0,0,0,0.12);
  color: rgba(0,0,0,0.45);
}
[data-theme="warm-editorial"] .slide-footer,
[data-theme="soft-gradient"] .slide-footer,
[data-theme="ink-paper"] .slide-footer,
[data-theme="concrete-swiss"] .slide-footer {
  color: rgba(0,0,0,0.40);
}

/* ── LAYOUT: Standard — spacer fills gap, body at bottom ───────────── */
.layout-standard { justify-content: flex-start; }
.layout-standard .spacer { flex: 1; min-height: 24px; max-height: 140px; }
.layout-standard .slide-subtitle { font-size: 28px; opacity: 0.55; margin: 4px 0 0; letter-spacing: 0.02em; }

.slide-counter-current { font-weight: 800; opacity: 1; }
.slide-counter-sep { opacity: 0.4; margin: 0 1px; }
.slide-counter-total { opacity: 0.5; }

/* ── CTA Banner ─────────────────────────────────────────────────────────── */
.cta-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 15px;
  font-weight: 500;
  color: inherit;
  opacity: 0.38;
  letter-spacing: 0.02em;
  margin-top: auto;
  padding-top: 20px;
  white-space: nowrap;
}
.cta-banner--large {
  font-size: 36px;
  font-weight: 800;
  padding: 32px 48px;
  opacity: 0.90;
  background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
  border-radius: 24px;
  margin-top: 36px;
  border: 2px solid rgba(255,255,255,0.20);
  white-space: normal;
  text-align: center;
  letter-spacing: 0.01em;
}
.cta-text { text-align: center; }

/* ── LAYOUT: Hero Number ─────────────────────────────────────────────── */
.layout-hero-number {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.hero-stat {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin: 24px 0;
}
.hero-num {
  font-size: 240px;
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -10px;
  color: currentColor;
  opacity: 0.88;
}
.hero-unit {
  font-size: 64px;
  font-weight: 800;
  opacity: 0.6;
}
/* Hero number — dark themes: gradient glow */
[data-theme="glassmorphism"] .hero-num,
[data-theme="cyberpunk"] .hero-num,
[data-theme="apple-premium"] .hero-num,
[data-theme="y2k-acid"] .hero-num,
[data-theme="deep-space"] .hero-num,
[data-theme="sakura-neon"] .hero-num {
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 60px rgba(255,255,255,0.15));
}
/* Hero number — light themes: solid dark */
[data-theme="neo-brutalism"] .hero-num,
[data-theme="warm-editorial"] .hero-num,
[data-theme="soft-gradient"] .hero-num,
[data-theme="ink-paper"] .hero-num,
[data-theme="concrete-swiss"] .hero-num,
[data-theme="edtech-trust"] .hero-num {
  color: #1a1a1a;
  background: none;
  opacity: 1;
  -webkit-text-fill-color: #1a1a1a;
  filter: none;
}

/* ── LAYOUT: Grid 2×2 ───────────────────────────────────────────────── */
.grid2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
  flex: 1;
  margin-top: 16px;
  min-height: 0;
}
.grid-cell {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}
[data-theme="warm-editorial"] .grid-cell,
[data-theme="soft-gradient"] .glass-card .grid-cell {
  background: rgba(255,255,255,0.72);
  border-color: rgba(0,0,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.grid-cell--accent {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.20);
}
.grid-label {
  font-size: 17px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.55;
}
.grid-value {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.32;
  word-wrap: break-word;
}

/* ── LAYOUT: Good / Bad ─────────────────────────────────────────────── */
.gb-split {
  display: flex;
  gap: 0;
  width: 100%;
  margin-top: 16px;
  min-height: 0;
}
.gb-col { flex: 1; display: flex; flex-direction: column; gap: 12px; padding: 12px; }
.gb-divider {
  width: 1px;
  background: rgba(255,255,255,0.10);
  align-self: stretch;
  margin: 8px 0;
}
[data-theme="warm-editorial"] .gb-divider,
[data-theme="soft-gradient"] .gb-divider { background: rgba(0,0,0,0.08); }
.gb-header {
  font-size: 22px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 16px 18px;
  border-radius: 16px;
  text-align: center;
}
.good-header { background: rgba(34,197,94,0.14); color: #22c55e; border: 1px solid rgba(34,197,94,0.22); }
.bad-header  { background: rgba(239,68,68,0.14); color: #ef4444; border: 1px solid rgba(239,68,68,0.22); }
.gb-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.gb-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 36px;
  line-height: 1.38;
  padding: 20px 22px;
  border-radius: 18px;
  word-wrap: break-word;
  font-weight: 500;
}
.gb-icon { font-size: 26px; font-weight: 900; flex-shrink: 0; margin-top: 5px; }
.gb-text { flex: 1; min-width: 0; }
.gb-good { background: rgba(34,197,94,0.07); }
.gb-good .gb-icon { color: #22c55e; }
.gb-bad  { background: rgba(239,68,68,0.07); }
.gb-bad .gb-icon  { color: #ef4444; }

/* ── LAYOUT: Before / After ─────────────────────────────────────────── */
.ba-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: 16px;
  min-height: 0;
}
.ba-arrow {
  text-align: center;
  font-size: 30px;
  opacity: 0.35;
  margin: 4px 0;
}
.ba-section {
  border-radius: 22px;
  padding: 32px 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ba-before { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18); }
.ba-after  { background: rgba(34,197,94,0.07);  border: 1px solid rgba(34,197,94,0.18); }
.ba-label {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.85;
}
.ba-before .ba-label { color: #ef4444; }
.ba-after  .ba-label { color: #22c55e; }
.ba-text { font-size: 38px; font-weight: 600; line-height: 1.42; word-wrap: break-word; }

/* ── LAYOUT: Steps-3 ────────────────────────────────────────────────── */
.steps-row {
  display: flex;
  gap: 14px;
  width: 100%;
  margin-top: 16px;
  min-height: 0;
}
.step-card {
  flex: 1;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 24px;
  padding: 32px 18px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  min-width: 0;
}
[data-theme="warm-editorial"] .step-card,
[data-theme="soft-gradient"] .step-card {
  background: rgba(255,255,255,0.72);
  border-color: rgba(0,0,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.step-num {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05));
  border: 2px solid rgba(255,255,255,0.20);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 900;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}
.step-label {
  font-size: 19px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.58;
}
.step-body { font-size: 36px; font-weight: 600; line-height: 1.35; word-wrap: break-word; min-width: 0; }

/* ── LAYOUT: Quote ──────────────────────────────────────────────────── */
.layout-quote {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.quote-mark {
  font-size: 160px;
  line-height: 0.65;
  opacity: 0.12;
  font-family: Georgia, serif;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 30px rgba(255,255,255,0.05));
}
.quote-text {
  font-size: 58px;
  font-weight: 600;
  line-height: 1.32;
  font-style: italic;
  max-width: 95%;
  flex: 1;
  display: flex;
  align-items: center;
}
.quote-author {
  font-size: 26px;
  opacity: 0.45;
  margin-top: 20px;
  font-style: normal;
  letter-spacing: 0.02em;
}

/* ── LAYOUT: Checklist ──────────────────────────────────────────────── */
.checklist {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
  min-height: 0;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 26px 28px;
  background: rgba(255,255,255,0.045);
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.07);
}
[data-theme="warm-editorial"] .check-item,
[data-theme="soft-gradient"] .check-item {
  background: rgba(255,255,255,0.72);
  border-color: rgba(0,0,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
[data-theme="ink-paper"] .check-item,
[data-theme="concrete-swiss"] .check-item {
  background: rgba(255,255,255,0.55);
  border-color: rgba(0,0,0,0.06);
  box-shadow: 0 3px 16px rgba(0,0,0,0.04);
}
.check-item--accent {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.18);
}
.check-mark { font-size: 32px; flex-shrink: 0; }
.check-text { font-size: 38px; font-weight: 600; line-height: 1.32; flex: 1; min-width: 0; word-wrap: break-word; }

/* ── LAYOUT: Comparison Table ───────────────────────────────────────── */
.cmp-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 100%;
  flex: 1;
  margin-top: 12px;
  min-height: 0;
}
.cmp-header-row {
  display: flex;
  gap: 10px;
  width: 100%;
}
.cmp-row {
  display: flex;
  gap: 10px;
  width: 100%;
  flex: 1;
  min-height: 0;
}
.cmp-head {
  flex: 1;
  font-size: 22px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 16px 18px;
  text-align: center;
  border-radius: 16px;
}
.cmp-card {
  flex: 1;
  font-size: 32px;
  font-weight: 500;
  padding: 18px 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  word-wrap: break-word;
  min-width: 0;
}
.cmp-ha { background: rgba(99,102,241,0.18); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.28); }
.cmp-hb { background: rgba(245,158,11,0.14); color: #fcd34d; border: 1px solid rgba(245,158,11,0.24); }
.cmp-a { background: rgba(99,102,241,0.05); border: 1px solid rgba(99,102,241,0.12); }
.cmp-b { background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.12); }

/* ── LAYOUT: CTA Final ──────────────────────────────────────────────── */
.layout-cta-final {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.cta-main-title {
  font-size: 100px !important;
  letter-spacing: -3.5px !important;
  text-align: center;
  max-width: 95%;
}
.emoji-large {
  font-size: 100px !important;
  margin-bottom: 28px;
  filter: drop-shadow(0 0 36px rgba(255,255,255,0.20));
}
/* CTA banner for light themes */
[data-theme="warm-editorial"] .cta-banner--large,
[data-theme="soft-gradient"] .cta-banner--large {
  background: rgba(0,0,0,0.06);
  border-color: rgba(0,0,0,0.10);
  color: #1a1a1a;
}

/* ═══════════════════════════════════════════════════════════
   WARM EDITORIAL — Premium elevated card overrides
   ═══════════════════════════════════════════════════════════ */
[data-theme="warm-editorial"] .highlight-box {
  background: rgba(255,255,255,0.55);
  border-radius: 0 18px 18px 0;
  padding: 24px 28px 24px 30px;
  box-shadow: 0 3px 14px rgba(0,0,0,0.04);
}
[data-theme="warm-editorial"] .step-num {
  background: rgba(255,255,255,0.85);
  border-color: rgba(140,80,30,0.20);
  box-shadow: 0 3px 12px rgba(0,0,0,0.06);
  color: #8B5E1A;
}
[data-theme="warm-editorial"] .gb-good { background: rgba(34,197,94,0.05); }
[data-theme="warm-editorial"] .gb-bad { background: rgba(239,68,68,0.05); }
[data-theme="warm-editorial"] .ba-before { background: rgba(239,68,68,0.045); border-color: rgba(239,68,68,0.12); }
[data-theme="warm-editorial"] .ba-after { background: rgba(34,197,94,0.045); border-color: rgba(34,197,94,0.12); }
[data-theme="warm-editorial"] .footer-counter {
  background: rgba(140,80,30,0.08);
}

/* ═══════ SOFT GRADIENT — Elevated card overrides ═══════ */
[data-theme="soft-gradient"] .highlight-box {
  background: rgba(255,255,255,0.45);
  border-radius: 0 18px 18px 0;
  padding: 24px 28px 24px 30px;
  box-shadow: 0 3px 14px rgba(100,60,200,0.04);
}

/* ═══════ INK & PAPER + SWISS — Card overrides ═══════ */
[data-theme="ink-paper"] .grid-cell,
[data-theme="ink-paper"] .step-card,
[data-theme="concrete-swiss"] .grid-cell,
[data-theme="concrete-swiss"] .step-card {
  background: rgba(255,255,255,0.55);
  border-color: rgba(0,0,0,0.06);
  box-shadow: 0 3px 16px rgba(0,0,0,0.04);
}
[data-theme="ink-paper"] .highlight-box {
  background: rgba(0,0,0,0.02);
  border-radius: 0 12px 12px 0;
}
[data-theme="concrete-swiss"] .highlight-box {
  background: rgba(0,0,0,0.025);
  border-radius: 0;
}
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function escHtml(t?: string | null): string {
  if (!t) return '';
  return t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function nl2br(t?: string | null): string {
  if (!t) return '';
  return escHtml(t).replace(/\n/g, '<br>');
}

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}
