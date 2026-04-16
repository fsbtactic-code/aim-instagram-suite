/**
 * AIM Instagram Suite — Core: Slide Layouts v3
 * 10 уникальных лейаутов слайдов для каруселей.
 * 
 * v3: Правильная типографическая шкала.
 *     Все размеры подогнаны под 1080px ширину без autoFit zoom.
 */

export type SlideLayout =
  | 'standard'      // Классика: эмодзи → заголовок → текст
  | 'hero-number'   // Большая цифра / статистика по центру
  | 'grid-2x2'      // 4 блока сеткой 2×2
  | 'good-bad'      // Левый / правый split: ✅ Хорошо / ❌ Плохо
  | 'before-after'  // Верхний / нижний split: ДО / ПОСЛЕ
  | 'steps-3'       // Три пронумерованных шага в ряд
  | 'quote'         // Полноэкранная цитата / pull quote
  | 'checklist'     // Вертикальный чек-лист
  | 'comparison'    // Таблица сравнения A vs B
  | 'cta-final';    // Финальный слайд с большим CTA

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
  /** CTA-поле — показывается внизу каждого слайда */
  ctaText?: string;
  /** Для grid-2x2, steps-3, checklist — массив блоков */
  blocks?: LayoutBlock[];
  /** Для comparison — левая колонка */
  leftBlocks?: LayoutBlock[];
  /** Для comparison — правая колонка */
  rightBlocks?: LayoutBlock[];
  /** Для hero-number */
  heroNumber?: string;
  heroUnit?: string;
  /** Для quote */
  quoteText?: string;
  quoteAuthor?: string;
  customHtml?: string;
}

// ── CTA баннер (персистентный — на каждом слайде) ────────────────────────────
export function buildCtaBanner(ctaText?: string, defaultCta?: string): string {
  const text = ctaText ?? defaultCta ?? '';
  if (!text) return '';
  return `
    <div class="cta-banner" aria-label="Призыв к действию">
      <span class="cta-text">${escHtml(text)}</span>
    </div>`;
}

// ── ЛЕЙАУТ 1: Standard ────────────────────────────────────────────────────────
export function renderStandard(slide: ExtendedSlideData): string {
  const { title, subtitle, body, emoji, tag, ctaText } = slide;
  return `
    <div class="glass-card layout-standard">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      ${emoji ? `<span class="emoji-icon" role="img">${escHtml(emoji)}</span>` : ''}
      <h1 class="slide-title">${escHtml(title)}</h1>
      ${subtitle ? `<p class="slide-subtitle">${escHtml(subtitle)}</p><div class="divider"></div>` : ''}
      ${body ? `<div class="highlight-box"><p class="slide-body">${nl2br(body)}</p></div>` : ''}
      ${tag ? `<span class="tag">${escHtml(tag)}</span>` : ''}

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 2: Hero Number (большая цифра) ────────────────────────────────────
export function renderHeroNumber(slide: ExtendedSlideData): string {
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

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 3: Grid 2×2 (4 блока сеткой) ─────────────────────────────────────
export function renderGrid2x2(slide: ExtendedSlideData): string {
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

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 4: Good / Bad (split: ✅ Хорошо / ❌ Плохо) ──────────────────────
export function renderGoodBad(slide: ExtendedSlideData): string {
  const { title, blocks = [], leftBlocks, rightBlocks, ctaText } = slide;
  // Support both: blocks array (2 items) or leftBlocks/rightBlocks
  let goodItems: string[] = [];
  let badItems: string[] = [];
  
  if (leftBlocks && leftBlocks.length > 0) {
    goodItems = leftBlocks.map(b => escHtml(b.value));
    badItems = (rightBlocks || []).map(b => escHtml(b.value));
  } else if (blocks.length >= 2) {
    // blocks[0] = good content, blocks[1] = bad content
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

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 5: Before / After (верхний / нижний split) ───────────────────────
export function renderBeforeAfter(slide: ExtendedSlideData): string {
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

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 6: Steps-3 (три шага) ─────────────────────────────────────────────
export function renderSteps3(slide: ExtendedSlideData): string {
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

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 7: Quote (полноэкранная цитата) ───────────────────────────────────
export function renderQuote(slide: ExtendedSlideData): string {
  const { quoteText, quoteAuthor, subtitle, ctaText } = slide;
  return `
    <div class="glass-card layout-quote">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      <div class="quote-mark">"</div>
      <blockquote class="quote-text">${nl2br(quoteText ?? slide.title)}</blockquote>
      ${quoteAuthor || subtitle ? `<div class="quote-author">— ${escHtml(quoteAuthor || subtitle || '')}</div>` : ''}

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 8: Checklist (вертикальный) ───────────────────────────────────────
export function renderChecklist(slide: ExtendedSlideData): string {
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

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 9: Comparison Table (A vs B таблица) ──────────────────────────────
export function renderComparison(slide: ExtendedSlideData): string {
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

      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 10: CTA Final (финальный слайд) ───────────────────────────────────
export function renderCtaFinal(slide: ExtendedSlideData): string {
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
    </div>`;
}

// ── Диспетчер лейаутов ────────────────────────────────────────────────────────
export function renderSlideLayout(slide: ExtendedSlideData): string {
  const layout = slide.layout ?? 'standard';
  switch (layout) {
    case 'hero-number':  return renderHeroNumber(slide);
    case 'grid-2x2':     return renderGrid2x2(slide);
    case 'good-bad':     return renderGoodBad(slide);
    case 'before-after': return renderBeforeAfter(slide);
    case 'steps-3':      return renderSteps3(slide);
    case 'quote':        return renderQuote(slide);
    case 'checklist':    return renderChecklist(slide);
    case 'comparison':   return renderComparison(slide);
    case 'cta-final':    return renderCtaFinal(slide);
    default:             return renderStandard(slide);
  }
}

/** CSS для всех лейаутов — подключается поверх темы */
export const LAYOUTS_CSS = `
/* ══════════════════════════════════════════════════════
   AIM LAYOUT SYSTEM v3 — Правильные размеры для 1080px
   ══════════════════════════════════════════════════════ */

/* Spacer removed — content centers via justify-content: center on .glass-card */

/* CTA Banner — тонкий watermark внизу */
.cta-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 400;
  color: inherit;
  opacity: 0.3;
  letter-spacing: 0.03em;
  margin-top: auto;
  white-space: nowrap;
}
.cta-banner--large {
  font-size: 28px;
  font-weight: 600;
  padding: 24px 36px;
  opacity: 0.75;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  border-radius: 20px;
  margin-top: 28px;
  border: 1px solid rgba(255,255,255,0.15);
  white-space: normal;
  text-align: center;
}
.cta-text { text-align: center; }

/* ── LAYOUT: Hero Number ─────────────────────────────── */
.layout-hero-number {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.hero-stat {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}
.hero-num {
  font-size: 160px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, currentColor 0%, rgba(255,255,255,0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -3px;
}
.hero-unit {
  font-size: 48px;
  font-weight: 700;
  opacity: 0.6;
}

/* ── LAYOUT: Grid 2×2 ───────────────────────────────── */
.grid2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  flex: 1;
  margin-top: 16px;
}
.grid-cell {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}
.grid-cell--accent {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.2);
}
.grid-label {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.5;
}
.grid-value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.35;
  word-wrap: break-word;
}

/* ── LAYOUT: Good / Bad ─────────────────────────────── */
.gb-split {
  display: flex;
  gap: 0;
  width: 100%;
  flex: 1;
  align-items: stretch;
  margin-top: 16px;
}
.gb-col { flex: 1; display: flex; flex-direction: column; gap: 12px; padding: 16px; }
.gb-divider {
  width: 1px;
  background: rgba(255,255,255,0.12);
  align-self: stretch;
  margin: 12px 0;
}
.gb-header {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
}
.good-header { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
.bad-header  { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
.gb-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.gb-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 22px;
  line-height: 1.4;
  padding: 14px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}
.gb-icon { font-size: 20px; font-weight: 900; flex-shrink: 0; margin-top: 2px; }
.gb-text { flex: 1; min-width: 0; }
.gb-good { background: rgba(34,197,94,0.08); }
.gb-good .gb-icon { color: #4ade80; }
.gb-bad  { background: rgba(239,68,68,0.08); }
.gb-bad .gb-icon { color: #f87171; }

/* ── LAYOUT: Before / After ─────────────────────────── */
.ba-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1;
  justify-content: center;
  margin-top: 16px;
}
.ba-arrow {
  text-align: center;
  font-size: 32px;
  opacity: 0.4;
}
.ba-section {
  flex: 1;
  border-radius: 20px;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ba-before { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); }
.ba-after  { background: rgba(34,197,94,0.08);  border: 1px solid rgba(34,197,94,0.2); }
.ba-label {
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
}
.ba-before .ba-label { color: #f87171; }
.ba-after  .ba-label { color: #4ade80; }
.ba-text { font-size: 24px; font-weight: 500; line-height: 1.5; word-wrap: break-word; }

/* ── LAYOUT: Steps-3 ────────────────────────────────── */
.steps-row {
  display: flex;
  gap: 16px;
  width: 100%;
  flex: 1;
  align-items: stretch;
  margin-top: 16px;
}
.step-card {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  min-width: 0;
}
.step-num {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
  flex-shrink: 0;
}
.step-label {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.6;
}
.step-body { font-size: 20px; line-height: 1.4; word-wrap: break-word; min-width: 0; }

/* ── LAYOUT: Quote ──────────────────────────────────── */
.layout-quote {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.quote-mark {
  font-size: 140px;
  line-height: 0.7;
  opacity: 0.12;
  font-family: Georgia, serif;
  margin-bottom: 12px;
}
.quote-text {
  font-size: 44px;
  font-weight: 600;
  line-height: 1.4;
  font-style: italic;
  max-width: 95%;
  flex: 1;
  display: flex;
  align-items: center;
}
.quote-author {
  font-size: 22px;
  opacity: 0.5;
  margin-top: 20px;
  font-style: normal;
}

/* ── LAYOUT: Checklist ──────────────────────────────── */
.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  flex: 1;
  justify-content: center;
  margin-top: 12px;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
}
.check-item--accent {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.18);
}
.check-mark { font-size: 24px; flex-shrink: 0; }
.check-text { font-size: 24px; line-height: 1.35; flex: 1; min-width: 0; word-wrap: break-word; }

/* ── LAYOUT: Comparison Table ───────────────────────── */
.cmp-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  flex: 1;
  margin-top: 12px;
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
}
.cmp-head {
  flex: 1;
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 14px 20px;
  text-align: center;
  border-radius: 14px;
}
.cmp-card {
  flex: 1;
  font-size: 22px;
  padding: 16px 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  word-wrap: break-word;
  min-width: 0;
}
.cmp-ha { background: rgba(99,102,241,0.2); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.3); }
.cmp-hb { background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.25); }
.cmp-a { background: rgba(99,102,241,0.05); border: 1px solid rgba(99,102,241,0.12); }
.cmp-b { background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.12); }

/* ── LAYOUT: CTA Final ──────────────────────────────── */
.layout-cta-final {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.cta-main-title {
  font-size: 56px !important;
  text-align: center;
  max-width: 95%;
}
.emoji-large { font-size: 72px !important; margin-bottom: 16px; }
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
