"use strict";
/**
 * AIM Instagram Suite — Tool: aim_render_premium_carousel
 * v2: поддержка 10 лейаутов, CTA-баннер, globalCta.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderPremiumCarouselSchema = void 0;
exports.renderPremiumCarousel = renderPremiumCarousel;
exports.listAvailableThemes = listAvailableThemes;
const fs = __importStar(require("fs"));
const zod_1 = require("zod");
const designSystem_js_1 = require("../core/designSystem.js");
const htmlRenderer_js_1 = require("../core/htmlRenderer.js");
const LAYOUT_IDS = [
    'standard', 'hero-number', 'grid-2x2', 'good-bad',
    'before-after', 'steps-3', 'quote', 'checklist', 'comparison', 'cta-final',
];
exports.RenderPremiumCarouselSchema = zod_1.z.object({
    slidesData: zod_1.z.union([
        zod_1.z.string().describe('JSON-строка с массивом слайдов'),
        zod_1.z.array(zod_1.z.object({
            slideNumber: zod_1.z.number().optional(),
            layout: zod_1.z.enum(LAYOUT_IDS).optional(),
            title: zod_1.z.string(),
            subtitle: zod_1.z.string().optional(),
            body: zod_1.z.string().optional(),
            emoji: zod_1.z.string().optional(),
            tag: zod_1.z.string().optional(),
            ctaText: zod_1.z.string().optional(),
            heroNumber: zod_1.z.string().optional(),
            heroUnit: zod_1.z.string().optional(),
            quoteText: zod_1.z.string().optional(),
            quoteAuthor: zod_1.z.string().optional(),
            blocks: zod_1.z.array(zod_1.z.object({ label: zod_1.z.string().optional(), value: zod_1.z.string(), accent: zod_1.z.boolean().optional() })).optional(),
            leftBlocks: zod_1.z.array(zod_1.z.object({ label: zod_1.z.string().optional(), value: zod_1.z.string(), accent: zod_1.z.boolean().optional() })).optional(),
            rightBlocks: zod_1.z.array(zod_1.z.object({ label: zod_1.z.string().optional(), value: zod_1.z.string(), accent: zod_1.z.boolean().optional() })).optional(),
            customHtml: zod_1.z.string().optional(),
        })).describe('Массив объектов слайдов'),
    ]),
    theme: zod_1.z.union([
        zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3), zod_1.z.literal(4),
        zod_1.z.literal(5), zod_1.z.literal(6), zod_1.z.literal(7), zod_1.z.literal(8),
        zod_1.z.literal(9), zod_1.z.literal(10), zod_1.z.literal(11), zod_1.z.literal(12),
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
    format: zod_1.z.enum(['square', 'portrait']).default('square')
        .describe('square=1080x1080 | portrait=1080x1350'),
    outputDir: zod_1.z.string().describe('Папка для PNG (напр. C:\\Users\\Alina\\Desktop\\carousel)'),
    globalCta: zod_1.z.string().optional()
        .describe('CTA-текст на каждый слайд снизу (напр. "Напиши СЛОВО — пришлю в директ")'),
    brandColorOverlay: zod_1.z.string().optional().describe('CSS из aim_auto_brand_colors'),
    customCssOverlay: zod_1.z.string().optional().describe('Кастомный CSS (для темы 8)'),
});
async function renderPremiumCarousel(input) {
    const { slidesData, theme, format, outputDir, globalCta, brandColorOverlay, customCssOverlay } = input;
    // ── Парсинг слайдов ─────────────────────────────────────────────────────────
    let slides;
    try {
        let raw;
        if (typeof slidesData === 'string') {
            let cleanData = slidesData.trim();
            // Убираем обертки ```json и ```
            if (cleanData.startsWith('```')) {
                cleanData = cleanData.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
            }
            const parsed = JSON.parse(cleanData);
            raw = Array.isArray(parsed) ? parsed : (parsed.slides ?? parsed);
        }
        else {
            raw = slidesData;
        }
        slides = raw.map((s, i) => ({ ...s, slideNumber: s.slideNumber ?? i + 1 }));
    }
    catch (e) {
        return JSON.stringify({
            error: 'Не удалось разобрать slidesData. Убедитесь что это валидный JSON.',
            hint: 'Сначала используй aim_draft_carousel_structure для создания структуры.',
            parseError: String(e),
        });
    }
    if (slides.length === 0)
        return JSON.stringify({ error: 'Массив слайдов пустой.' });
    // ── Тема ────────────────────────────────────────────────────────────────────
    const themeDefinition = (0, designSystem_js_1.getTheme)(theme);
    if (!themeDefinition)
        return JSON.stringify({ error: `Тема ${theme} не найдена` });
    if (theme === 8 && !customCssOverlay) {
        // Custom Brand — uses base of theme 1 if no overlay provided
    }
    // ── Проверяем папку ─────────────────────────────────────────────────────────
    try {
        if (!fs.existsSync(outputDir))
            fs.mkdirSync(outputDir, { recursive: true });
    }
    catch (e) {
        return JSON.stringify({
            error: `Не удалось создать папку: ${outputDir}`,
            detail: String(e),
        });
    }
    console.error(`[AIM] Рендеринг ${slides.length} слайдов | тема ${themeDefinition.label}`);
    console.error(`[AIM] Формат: ${format} | CTA: ${globalCta ?? 'нет глобального'}`);
    // ── Рендер ──────────────────────────────────────────────────────────────────
    try {
        const result = await (0, htmlRenderer_js_1.renderCarousel)(slides, {
            theme: themeDefinition,
            format: format,
            outputDir,
            globalCta,
            brandColorOverlay,
            customCssOverlay,
        });
        const layoutsUsed = [...new Set(slides.map(s => s.layout ?? 'standard'))];
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return JSON.stringify({
            error: `Ошибка рендеринга: ${message}`,
            hint: 'Проверьте что Puppeteer установлен (npm install). Google Chrome скачивается автоматически.',
            outputDir,
        });
    }
}
function listAvailableThemes() {
    const themes = Object.values(designSystem_js_1.THEMES).map(t => ({
        id: t.id,
        name: t.label,
        fonts: t.googleFontsUrl.match(/family=([^&:]+)/g)?.map(f => f.replace('family=', '').replace(/\+/g, ' ')) ?? [],
    }));
    return JSON.stringify({
        availableThemes: themes,
        availableLayouts: [
            { id: 'standard', description: 'Классика: эмодзи → заголовок → текст → тег' },
            { id: 'hero-number', description: 'Большая цифра/статистика по центру (120px)' },
            { id: 'grid-2x2', description: '4 блока сеткой 2×2 — идеально для сравнений и фактов' },
            { id: 'good-bad', description: 'Сплит ✅ Правильно / ❌ Ошибка бок о бок' },
            { id: 'before-after', description: 'ДО → ПОСЛЕ (вертикальный сплит)' },
            { id: 'steps-3', description: 'Три шага в ряд с пронумерованными кругами' },
            { id: 'quote', description: 'Полноэкранная цитата с большими кавычками' },
            { id: 'checklist', description: 'Вертикальный чек-лист с иконками' },
            { id: 'comparison', description: 'Таблица сравнения A vs B' },
            { id: 'cta-final', description: 'Финальный слайд с большим CTA-призывом' },
        ],
    }, null, 2);
}
//# sourceMappingURL=renderPremiumCarousel.js.map