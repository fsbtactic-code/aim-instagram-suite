/**
 * AIM Instagram Suite — Core: Slide Layouts
 * 10 уникальных лейаутов слайдов для каруселей.
 * Каждый лейаут — отдельный HTML-шаблон с CSS-классами.
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
      <span class="cta-arrow">👆</span>
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
  const { title, subtitle, heroNumber, heroUnit, ctaText } = slide;
  return `
    <div class="glass-card layout-hero-number">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      <div class="hero-stat">
        <span class="hero-num">${escHtml(heroNumber ?? '?')}</span>
        ${heroUnit ? `<span class="hero-unit">${escHtml(heroUnit)}</span>` : ''}
      </div>
      <h1 class="slide-title hero-title">${escHtml(title)}</h1>
      ${subtitle ? `<p class="slide-subtitle">${escHtml(subtitle)}</p>` : ''}
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
      <h1 class="slide-title">${escHtml(title)}</h1>
      <div class="grid2x2">${cells}</div>
      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 4: Good / Bad (split: ✅ Хорошо / ❌ Плохо) ──────────────────────
export function renderGoodBad(slide: ExtendedSlideData): string {
  const { title, leftBlocks = [], rightBlocks = [], ctaText } = slide;
  const leftCells = leftBlocks.map(b => `<li class="gb-item gb-good">✅ ${escHtml(b.value)}</li>`).join('');
  const rightCells = rightBlocks.map(b => `<li class="gb-item gb-bad">❌ ${escHtml(b.value)}</li>`).join('');
  return `
    <div class="glass-card layout-good-bad">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      <h1 class="slide-title">${escHtml(title)}</h1>
      <div class="gb-split">
        <div class="gb-col">
          <div class="gb-header good-header">✅ Правильно</div>
          <ul class="gb-list">${leftCells}</ul>
        </div>
        <div class="gb-divider"></div>
        <div class="gb-col">
          <div class="gb-header bad-header">❌ Ошибка</div>
          <ul class="gb-list">${rightCells}</ul>
        </div>
      </div>
      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 5: Before / After (верхний / нижний split) ───────────────────────
export function renderBeforeAfter(slide: ExtendedSlideData): string {
  const { title, leftBlocks = [], rightBlocks = [], ctaText } = slide;
  const beforeText = leftBlocks.map(b => escHtml(b.value)).join(' · ');
  const afterText  = rightBlocks.map(b => escHtml(b.value)).join(' · ');
  return `
    <div class="glass-card layout-before-after">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      <h1 class="slide-title">${escHtml(title)}</h1>
      <div class="ba-container">
        <div class="ba-section ba-before">
          <div class="ba-label">ДО</div>
          <p class="ba-text">${beforeText || '—'}</p>
        </div>
        <div class="ba-arrow">➜</div>
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
      <h1 class="slide-title">${escHtml(title)}</h1>
      <div class="steps-row">${steps}</div>
      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 7: Quote (полноэкранная цитата) ───────────────────────────────────
export function renderQuote(slide: ExtendedSlideData): string {
  const { quoteText, quoteAuthor, ctaText } = slide;
  return `
    <div class="glass-card layout-quote">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      <div class="quote-mark">"</div>
      <blockquote class="quote-text">${nl2br(quoteText ?? slide.title)}</blockquote>
      ${quoteAuthor ? `<div class="quote-author">— ${escHtml(quoteAuthor)}</div>` : ''}
      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 8: Checklist (вертикальный) ───────────────────────────────────────
export function renderChecklist(slide: ExtendedSlideData): string {
  const { title, subtitle, blocks = [], ctaText } = slide;
  const items = blocks.map(b => `
    <div class="check-item ${b.accent ? 'check-item--accent' : ''}">
      <span class="check-mark">${b.accent ? '🔥' : '☐'}</span>
      <span class="check-text">${nl2br(b.value)}</span>
    </div>`).join('');
  return `
    <div class="glass-card layout-checklist">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      <h1 class="slide-title">${escHtml(title)}</h1>
      ${subtitle ? `<p class="slide-subtitle">${escHtml(subtitle)}</p>` : ''}
      <div class="checklist">${items}</div>
      ${buildCtaBanner(ctaText)}
    </div>`;
}

// ── ЛЕЙАУТ 9: Comparison Table (A vs B таблица) ──────────────────────────────
export function renderComparison(slide: ExtendedSlideData): string {
  const { title, leftBlocks = [], rightBlocks = [], blocks = [], ctaText } = slide;
  // blocks[0].label = заголовок A, blocks[1].label = заголовок B
  const headerA = blocks[0]?.label ?? 'Вариант A';
  const headerB = blocks[1]?.label ?? 'Вариант B';
  const maxRows = Math.max(leftBlocks.length, rightBlocks.length);
  const rows = Array.from({ length: maxRows }, (_, i) => `
    <tr>
      <td class="cmp-cell cmp-a">${escHtml(leftBlocks[i]?.value ?? '—')}</td>
      <td class="cmp-cell cmp-b">${escHtml(rightBlocks[i]?.value ?? '—')}</td>
    </tr>`).join('');
  return `
    <div class="glass-card layout-comparison">
      <span class="slide-number">${pad(slide.slideNumber)}</span>
      <h1 class="slide-title">${escHtml(title)}</h1>
      <table class="cmp-table">
        <thead>
          <tr>
            <th class="cmp-head cmp-ha">${escHtml(headerA)}</th>
            <th class="cmp-head cmp-hb">${escHtml(headerB)}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
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
   AIM LAYOUT SYSTEM — 10 лейаутов для слайдов карусели
   ══════════════════════════════════════════════════════ */

/* CTA Banner — персистентный на каждом слайде */
.cta-banner {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255,255,255,0.15);
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,0.95);
  letter-spacing: 0.02em;
  z-index: 10;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}
.cta-banner--large {
  font-size: 22px;
  padding: 20px 32px;
  background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08));
  border-radius: 16px;
  position: relative;
  margin-top: 24px;
  bottom: auto;
  left: auto;
  right: auto;
  border: 1px solid rgba(255,255,255,0.3);
}
.cta-arrow { font-size: 20px; }
.cta-text { flex: 1; text-align: center; }

/* Отступ для glass-card чтобы CTA не перекрывал контент */
.glass-card { padding-bottom: 56px; }
.layout-cta-final .glass-card,
.glass-card.layout-cta-final { padding-bottom: 24px; }

/* ── LAYOUT: Hero Number ─────────────────────────────── */
.layout-hero-number {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.hero-stat {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 20px 0 16px;
}
.hero-num {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -4px;
}
.hero-unit {
  font-size: 36px;
  font-weight: 700;
  opacity: 0.7;
  color: inherit;
  -webkit-text-fill-color: currentColor;
}
.hero-title { font-size: 28px !important; text-align: center; }

/* ── LAYOUT: Grid 2×2 ───────────────────────────────── */
.layout-grid2x2 .slide-title { font-size: 28px; margin-bottom: 20px; }
.grid2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  flex: 1;
}
.grid-cell {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.grid-cell--accent {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.3);
}
.grid-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
}
.grid-value {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
}

/* ── LAYOUT: Good / Bad ─────────────────────────────── */
.layout-good-bad .slide-title { font-size: 28px; margin-bottom: 16px; }
.gb-split {
  display: flex;
  gap: 0;
  width: 100%;
  flex: 1;
  align-items: stretch;
}
.gb-col { flex: 1; display: flex; flex-direction: column; gap: 8px; padding: 12px; }
.gb-divider {
  width: 2px;
  background: rgba(255,255,255,0.15);
  align-self: stretch;
  margin: 8px 0;
}
.gb-header {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 4px;
}
.good-header { background: rgba(34,197,94,0.2); color: #86efac; border: 1px solid rgba(34,197,94,0.3); }
.bad-header  { background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }
.gb-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.gb-item {
  font-size: 15px;
  line-height: 1.4;
  padding: 8px 10px;
  border-radius: 8px;
}
.gb-good { background: rgba(34,197,94,0.1); color: rgba(255,255,255,0.9); }
.gb-bad  { background: rgba(239,68,68,0.1);  color: rgba(255,255,255,0.75); }

/* ── LAYOUT: Before / After ─────────────────────────── */
.layout-before-after .slide-title { font-size: 26px; }
.ba-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: stretch;
}
.ba-arrow {
  text-align: center;
  font-size: 28px;
  opacity: 0.5;
  transform: rotate(90deg);
}
.ba-section {
  flex: 1;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ba-before { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); }
.ba-after  { background: rgba(34,197,94,0.12);  border: 1px solid rgba(34,197,94,0.3); }
.ba-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.7;
}
.ba-before .ba-label { color: #fca5a5; }
.ba-after  .ba-label { color: #86efac; }
.ba-text { font-size: 17px; font-weight: 600; line-height: 1.5; }

/* ── LAYOUT: Steps-3 ────────────────────────────────── */
.layout-steps3 .slide-title { font-size: 26px; margin-bottom: 16px; }
.steps-row {
  display: flex;
  gap: 12px;
  width: 100%;
  flex: 1;
  align-items: stretch;
}
.step-card {
  flex: 1;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}
.step-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  flex-shrink: 0;
}
.step-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.65;
}
.step-body { font-size: 15px; line-height: 1.4; }

/* ── LAYOUT: Quote ──────────────────────────────────── */
.layout-quote {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.quote-mark {
  font-size: 120px;
  line-height: 0.6;
  opacity: 0.15;
  font-family: Georgia, serif;
  margin-bottom: 16px;
  margin-top: 24px;
}
.quote-text {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.4;
  font-style: italic;
  max-width: 90%;
  flex: 1;
  display: flex;
  align-items: center;
}
.quote-author {
  font-size: 16px;
  opacity: 0.6;
  margin-top: 16px;
  font-style: normal;
}

/* ── LAYOUT: Checklist ──────────────────────────────── */
.layout-checklist .slide-title { font-size: 28px; }
.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  flex: 1;
  overflow: hidden;
}
.check-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
}
.check-item--accent {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.22);
}
.check-mark { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.check-text { font-size: 16px; line-height: 1.4; }

/* ── LAYOUT: Comparison Table ───────────────────────── */
.layout-comparison .slide-title { font-size: 26px; margin-bottom: 14px; }
.cmp-table {
  width: 100%;
  border-collapse: collapse;
  flex: 1;
}
.cmp-head {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 10px 14px;
  text-align: center;
  border-radius: 10px 10px 0 0;
}
.cmp-ha { background: rgba(99,102,241,0.25); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.3); }
.cmp-hb { background: rgba(245,158,11,0.2); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
.cmp-cell {
  font-size: 15px;
  padding: 10px 14px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  vertical-align: middle;
  line-height: 1.35;
}
.cmp-a { background: rgba(99,102,241,0.06); }
.cmp-b { background: rgba(245,158,11,0.06); }

/* ── LAYOUT: CTA Final ──────────────────────────────── */
.layout-cta-final {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 24px !important;
}
.cta-main-title {
  font-size: 36px !important;
  text-align: center;
  max-width: 90%;
}
.emoji-large { font-size: 64px !important; margin-bottom: 12px; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function escHtml(t: string): string {
  return t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function nl2br(t: string): string {
  return escHtml(t).replace(/\n/g, '<br>');
}

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}
