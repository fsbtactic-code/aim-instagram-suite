/**
 * AIM Instagram Suite — MCP Server Entry Point v1.3.0
 * 14 инструментов: Video Analysis + CarouselStudio + Virality Score + Carousel Intelligence + Style Creator
 * Транспорт: stdio (совместим с `claude mcp add`)
 */

/**
 * AIM MCP - Integrated Communication Guard
 * Pre-emptively protects stdout from pollution and handles multi-chunk JSON-RPC.
 */
(function bootstrap() {
  let isInRpc = false;

  // 1. Silence shelljs (used by nodejs-whisper)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const shelljs = require('shelljs');
    if (shelljs && shelljs.exec) {
      const _exec = shelljs.exec;
      shelljs.exec = function(cmd: string, opts: any, cb: any) {
        if (typeof opts === 'function') { cb = opts; opts = { silent: true }; }
        else { opts = { ...(opts || {}), silent: true }; }
        return _exec.call(this, cmd, opts, cb);
      };
    }
  } catch (e) { /* ignore */ }

  // 2. Silence child_process (for native binaries)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cp = require('child_process');
    const _spawn = cp.spawn;
    cp.spawn = function(cmd: string, args: any, opts: any) {
      if (!opts) opts = {};
      if (opts.stdio === 'inherit') opts.stdio = ['ignore', 'ignore', 'pipe'];
      return _spawn.call(this, cmd, args, opts);
    };
  } catch(e) {}

  // 4. Override process.stdout.write with Stack-Trace Guard
  const _ow = process.stdout.write.bind(process.stdout);
  process.stdout.write = function() {
    const args = Array.prototype.slice.call(arguments);
    const chunk = args[0];
    const enc = typeof args[1] === 'string' ? args[1] : undefined;
    const stack = new Error().stack || '';
    
    // Only allow writes originating from MCP SDK or our bootstrap
    const isMcpMsg = stack.includes('StdioServerTransport') || 
                     stack.includes('server.js') || 
                     stack.includes('JSONRPC') ||
                     stack.includes('bootstrap');

    if (isMcpMsg) {
      return _ow.apply(process.stdout, args as any);
    }

    // Otherwise it's garbage (Whisper logs, scrapers, etc) -> redirect to stderr
    const str = typeof chunk === 'string' ? chunk : Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
    if (str.trim() === '') return true;

    process.stderr.write(`STDOUT_LOG: ${str}\n`);
    const cbIndex = typeof args[args.length - 1] === 'function' ? args.length - 1 : -1;
    if (cbIndex >= 0) {
        (args[cbIndex] as Function)();
    }
    return true;
  } as any;

  // 5. Override console to force stderr
  console.log   = (...args) => process.stderr.write(`[LOG] ${args.join(' ')}\n`);
  console.warn  = (...args) => process.stderr.write(`[WARN] ${args.join(' ')}\n`);
  console.info  = (...args) => process.stderr.write(`[INFO] ${args.join(' ')}\n`);
  console.debug = (...args) => process.stderr.write(`[DBG] ${args.join(' ')}\n`);
})();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// ── Video Analysis Tools ──────────────────────────────────────────────────────
import { evaluateVideo } from './tools/evaluateVideo.js';
import { analyzeViralReels } from './tools/analyzeViralReels.js';
import { generateScript } from './tools/generateScript.js';
import { analyzeHook } from './tools/analyzeHook.js';
import { extractPacing } from './tools/extractPacing.js';

// ── Carousel Studio Tools ─────────────────────────────────────────────────────
import { draftCarouselStructure } from './tools/draftCarouselStructure.js';
import { renderPremiumCarousel } from './tools/renderPremiumCarousel.js';
import { autoBrandColors } from './tools/autoBrandColors.js';

// ── Intelligence & Analysis Tools ─────────────────────────────────────────────
import { scoreVirality } from './tools/scoreVirality.js';
import { scoreCarouselVirality } from './tools/scoreCarouselVirality.js';
import { analyzeCarousel } from './tools/analyzeCarousel.js';
import { localizeCarousel } from './tools/localizeCarousel.js';
import { listViralStructures, getViralStructure, structureToSlides } from './core/viralStructures.js';
import { listAvailableFonts } from './core/designSystem.js';
import { createStyle } from './tools/createStyle.js';

// ============================================================
// Схемы входных параметров — Video Tools
// ============================================================

const EvaluateVideoSchema = z.object({
  videoPath: z.string().describe('Абсолютный путь к локальному видеофайлу (mp4, mov, avi)'),
});

const AnalyzeViralReelsSchema = z.object({
  url: z.string().url().describe('Ссылка на Instagram Reel, TikTok или YouTube Shorts'),
  outputMdPath: z.string().describe('Путь для сохранения .md отчёта (например: /Desktop/viral.md)'),
});

const GenerateScriptSchema = z.object({
  referenceMdPath: z.string().describe('Путь к .md файлу с отчётом aim_analyze_viral_reels'),
  targetTopic: z.string().describe('Тема/ниша для нового сценария (например: "фитнес для занятых мам")'),
});

const AnalyzeHookSchema = z.object({
  videoPath: z.string().optional().describe('Путь к локальному видеофайлу'),
  url: z.string().url().optional().describe('Ссылка на видео для анализа хука'),
}).refine(data => data.videoPath || data.url, {
  message: 'Укажите videoPath или url',
});

const ExtractPacingSchema = z.object({
  videoPath: z.string().optional().describe('Путь к локальному видеофайлу'),
  url: z.string().url().optional().describe('Ссылка на видео для анализа ритма'),
  slowThresholdSec: z.number().optional().default(4).describe('Порог провисания в секундах (default: 4)'),
}).refine(data => data.videoPath || data.url, {
  message: 'Укажите videoPath или url',
});

// ============================================================
// Схемы входных параметров — Carousel Tools
// ============================================================

const DraftCarouselSchema = z.object({
  topic: z.string().describe('Тема карусели'),
  slideCount: z.number().min(3).max(15).default(7).describe('Количество слайдов (3-15)'),
  toneOfVoice: z.enum(['educational', 'motivational', 'professional', 'casual', 'provocative'])
    .default('educational').describe('Тон подачи'),
});

const RenderCarouselSchema = z.object({
  slidesData: z.union([z.string(), z.array(z.any())]).describe('JSON-строка или массив слайдов'),
  theme: z.union([
    z.literal('1'), z.literal('2'), z.literal('3'), z.literal('4'),
    z.literal('5'), z.literal('6'), z.literal('7'), z.literal('8'),
    z.literal(1), z.literal(2), z.literal(3), z.literal(4),
    z.literal(5), z.literal(6), z.literal(7), z.literal(8),
  ]).transform(v => Number(v)).describe('Номер темы 1-8'),
  format: z.enum(['square', 'portrait']).default('square').describe('square=1080x1080, portrait=1080x1350'),
  outputDir: z.string().describe('Папка для сохранения PNG'),
  globalCta: z.string().optional().describe('Текст CTA-баннера'),
  brandColorOverlay: z.string().optional().describe('CSS из aim_auto_brand_colors'),
  customCssOverlay: z.string().optional().describe('Кастомный CSS'),
});

const BrandColorsSchema = z.object({
  baseTheme: z.union([
    z.literal('1'), z.literal('2'), z.literal('3'), z.literal('4'),
    z.literal('5'), z.literal('6'), z.literal('7'), z.literal('8'),
    z.literal(1), z.literal(2), z.literal(3), z.literal(4),
    z.literal(5), z.literal(6), z.literal(7), z.literal(8),
  ]).transform(v => Number(v)).describe('Номер базовой темы (1-8)'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe('Основной цвет HEX'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe('Вторичный цвет HEX'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#FFFFFF').describe('Цвет текста HEX'),
});

// ============================================================
// Схемы входных параметров — Intelligence Tools
// ============================================================

const ScoreViralitySchema = z.object({
  videoPath: z.string().optional().describe('Путь к локальному видеофайлу'),
  url: z.string().url().optional().describe('Ссылка на видео'),
  context: z.string().optional().describe('Ниша и целевая аудитория (необязательно)'),
}).refine(data => data.videoPath || data.url, { message: 'Укажите videoPath или url' });

const ScoreCarouselViralitySchema = z.object({
  url: z.string().url().optional().describe('Ссылка на карусель Instagram'),
  slidesDir: z.string().optional().describe('Путь к папке с PNG/JPG слайдами'),
  context: z.string().optional().describe('Ниша, целевая аудитория'),
  goal: z.enum(['sales', 'subscribers', 'reach', 'engagement', 'trust']).optional()
    .describe('Цель карусели: sales/subscribers/reach/engagement/trust'),
}).refine(data => data.url || data.slidesDir, { message: 'Укажите url или slidesDir' });

const AnalyzeCarouselSchema = z.object({
  url: z.string().url().describe('Ссылка на пост-карусель в Instagram/VK'),
  outputMdPath: z.string().optional().describe('Путь для сохранения .md отчёта (необязательно)'),
});

const LocalizeCarouselSchema = z.object({
  url: z.string().url().describe('Ссылка на карусель для копирования/локализации'),
  mode: z.enum(['copy', 'localize', 'adapt']).describe('copy=рерайт | localize=перевод на RU | adapt=адаптация под новую тему'),
  targetTopic: z.string().optional().describe('Новая тема (только для mode=adapt)'),
  slideCount: z.number().optional().describe('Количество слайдов в новой карусели'),
  designTheme: z.number().min(1).max(8).optional().describe('Тема дизайна 1-8'),
  outputDir: z.string().optional().describe('Папка для авторендера PNG (необязательно)'),
});

const CreateStyleSchema = z.object({
  step: z.union([
    z.literal('1'), z.literal('2'), z.literal('3'), z.literal('4'), z.literal('5'),
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ]).transform(v => Number(v)).optional()
    .describe('Шаг мастера (1=настроение, 2=цвета, 3=шрифт, 4=подача, 5=генерация). Пропусти для старта.'),
  mood: z.enum(['luxury','energetic','minimal','warm','dark','playful']).optional(),
  colorBase: z.enum(['dark','light','contrast']).optional(),
  primaryHex: z.string().optional().describe('Основной цвет HEX, например #C9A84C'),
  secondaryHex: z.string().optional().describe('Вторичный цвет HEX'),
  fontStyle: z.enum(['serif','modern','bold','handwritten','mono']).optional(),
  contentDensity: z.enum(['minimal','balanced','rich']).optional(),
  emojiUsage: z.enum(['none','subtle','expressive']).optional(),
  customWishes: z.string().optional().describe('Дополнительные пожелания к стилю свободным текстом'),
  styleName: z.string().optional().describe('Название стиля'),
  saveToPath: z.string().optional().describe('Путь для сохранения JSON стиля'),
});

const ViralStructureSchema = z.object({
  structureId: z.enum([
    'open-loop', 'listicle', 'before-after', 'myth-busting', 'step-by-step',
    'case-study', 'hot-take', 'checklist-audit', 'a-vs-b', 'day-in-life', 'faq', 'story-arc',
  ]).optional().describe('ID структуры (пусто = показать все 12)'),
  topic: z.string().optional().describe('Тема для адаптации шаблона'),
});

// ============================================================
// Определения инструментов (MCP Tools)
// ============================================================

const TOOLS: Tool[] = [

  // ── 🎨 STYLE CREATOR ──────────────────────────────────────────────────────

  {
    name: 'aim_create_style',
    description: `🎨 Интерактивный мастер создания кастомного стиля карусели.
Ведёт пользователя через 5 шагов: настроение → цвета → шрифт → подача → генерация.
В итоге создаёт готовый CSS-стиль и JSON-конфиг, который применяется в aim_render_premium_carousel.

КАК ИСПОЛЬЗОВАТЬ:
1. Вызови без параметров или с step=1 — начнёт опрос
2. После каждого шага показывай пользователю варианты и жди выбора
3. Передавай ответы в следующий шаг
4. На шаге 5 — получишь готовый brandColorOverlay для рендера`,
    inputSchema: {
      type: 'object',
      properties: {
        step:           { type: 'string', enum: ['1','2','3','4','5'], description: 'Текущий шаг (1-5). Пропусти для начала.' },
        mood:           { type: 'string', enum: ['luxury','energetic','minimal','warm','dark','playful'] },
        colorBase:      { type: 'string', enum: ['dark','light','contrast'] },
        primaryHex:     { type: 'string', description: 'HEX цвет, например #C9A84C' },
        secondaryHex:   { type: 'string', description: 'HEX цвет' },
        fontStyle:      { type: 'string', enum: ['serif','modern','bold','handwritten','mono'] },
        contentDensity: { type: 'string', enum: ['minimal','balanced','rich'] },
        emojiUsage:     { type: 'string', enum: ['none','subtle','expressive'] },
        customWishes:   { type: 'string', description: 'Дополнительные пожелания к стилю' },
        styleName:      { type: 'string', description: 'Название стиля' },
        saveToPath:     { type: 'string', description: 'Путь для сохранения JSON файла стиля' },
      },
      required: [],
    },
  },

  // ── 🎬 VIDEO ANALYSIS ─────────────────────────────────────────────────────

  {
    name: 'aim_evaluate_video',
    description: `🎬 Оценка виральности видео перед публикацией.
Анализирует удержание внимания, силу хука, эмоциональный резонанс и потенциал виральности.
Пайплайн: Whisper (транскрибация) → Adaptive Scene Detection → Image Grid → Claude Vision.
Экономия токенов: все кадры склеиваются в одну сетку 3x3 (768px JPEG 70%).`,
    inputSchema: {
      type: 'object',
      properties: {
        videoPath: { type: 'string', description: 'Абсолютный путь к локальному видеофайлу (mp4, mov, avi)' },
      },
      required: ['videoPath'],
    },
  },

  {
    name: 'aim_analyze_viral_reels',
    description: `🕵️ Реверс-инжиниринг успешного контента конкурентов.
Скачивает видео по ссылке, транскрибирует, анализирует структуру и сохраняет отчёт в .md файл.
Поддерживает: Instagram, TikTok, YouTube, VKontakte, Twitter/X.`,
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Ссылка на Instagram Reel, TikTok или YouTube Shorts' },
        outputMdPath: { type: 'string', description: 'Путь для сохранения .md отчёта' },
      },
      required: ['url', 'outputMdPath'],
    },
  },

  {
    name: 'aim_generate_script',
    description: `✍️ Генерация сценария по структуре успешного контента.
Читает .md отчёт из aim_analyze_viral_reels и адаптирует успешную структуру под новую тему/нишу.`,
    inputSchema: {
      type: 'object',
      properties: {
        referenceMdPath: { type: 'string', description: 'Путь к .md файлу, созданному aim_analyze_viral_reels' },
        targetTopic: { type: 'string', description: 'Тема/ниша для нового сценария' },
      },
      required: ['referenceMdPath', 'targetTopic'],
    },
  },

  {
    name: 'aim_analyze_hook',
    description: `🪝 Оценка и усиление хука (первые 5 секунд видео).
Анализирует только начало видео и даёт 5 конкретных вариантов усиления.`,
    inputSchema: {
      type: 'object',
      properties: {
        videoPath: { type: 'string', description: 'Путь к локальному видеофайлу (ИЛИ url)' },
        url: { type: 'string', description: 'Ссылка на видео (ИЛИ videoPath)' },
      },
    },
  },

  {
    name: 'aim_extract_pacing',
    description: `⏱️ Детектор скуки — анализ ритма монтажа.
Определяет таймкоды смен кадра и провисания (где зритель засыпает).`,
    inputSchema: {
      type: 'object',
      properties: {
        videoPath: { type: 'string', description: 'Путь к локальному видеофайлу (ИЛИ url)' },
        url: { type: 'string', description: 'Ссылка на видео (ИЛИ videoPath)' },
        slowThresholdSec: { type: 'number', description: 'Порог "провисания" в секундах (default: 4)' },
      },
    },
  },

  // ── 🔥 VIRALITY & INTELLIGENCE ────────────────────────────────────────────

  {
    name: 'aim_score_carousel_virality',
    description: `📊 Индекс Виральности КАРУСЕЛИ (0-100) — 6 критериев специфичных для carousel-формата.

КРИТЕРИИ И ВЕСА (отличаются от видео!):
🎯 Первый слайд/Хук (25%) — останавливает ли скролл?
🔀 Воронка/Структура (22%) — AIDA, momentum, прогрессия
🎨 Дизайн и читаемость (18%) — единый стиль, типографика
💡 Ценность контента (17%) — save-фактор, уникальность
❤️ Триггеры и эмоции (10%) — FOMO, Social Proof, Identity
📢 Последний слайд/CTA (8%) — конкретность призыва

Анализирует save-rate, share-rate, completion rate.
Вместо хэштегов — LSI и семантические ключевые слова для caption.
Принимает URL карусели или папку с PNG-файлами.`,
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Ссылка на Instagram-карусель (ИЛИ slidesDir)' },
        slidesDir: { type: 'string', description: 'Путь к папке со слайдами PNG/JPG (ИЛИ url)' },
        context: { type: 'string', description: 'Ниша и целевая аудитория' },
        goal: {
          type: 'string',
          enum: ['sales', 'subscribers', 'reach', 'engagement', 'trust'],
          description: 'Цель: sales/subscribers/reach/engagement/trust',
        },
      },
    },
  },

  {
    name: 'aim_score_virality',
    description: `📊 Индекс Виральности ВИДЕО (0-100) по 7 взвешенным критериям.
Для каруселей используй aim_score_carousel_virality.

КРИТЕРИИ И ВЕСА:
🪝 Хук (25%) — первые 3 секунды, паттерн, петля интриги
⚡ Динамика (20%) — темп, провисания, B-Roll
🎵 Звук (15%) — музыка, качество речи, ритм
💡 Ценность (15%) — плотность insights, уникальность
❤️ Эмоции (12%) — триггеры, идентификация, трансформация
🎨 Визуал (8%) — освещение, субтитры, стиль
📢 CTA (5%) — наличие, конкретность, своевременность

Анализирует корреляции между критериями.
Даёт Топ-3 правки с прогнозом прироста индекса.
Принимает локальный файл или URL.`,
    inputSchema: {
      type: 'object',
      properties: {
        videoPath: { type: 'string', description: 'Путь к локальному видеофайлу (ИЛИ url)' },
        url: { type: 'string', description: 'Ссылка на видео (ИЛИ videoPath)' },
        context: { type: 'string', description: 'Ниша и целевая аудитория (необязательно, улучшает точность)' },
      },
    },
  },

  {
    name: 'aim_analyze_carousel',
    description: `🔍 Реверс-инжиниринг чужой карусели Instagram.
Скачивает все слайды, склеивает в коллаж-ленту, анализирует воронку и триггеры.

Выдаёт пословный разбор каждого слайда:
- Роль в воронке продаж (AIDA)
- Психологический триггер (FOMO/Proof/Curiosity/etc.)
- Архетип структуры карусели
- Шаблон для «кражи» структуры

Пример: "Разбери эту карусель [ссылка]. Что на каждом слайде цепляет?"`,
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Ссылка на пост-карусель (Instagram, VK)' },
        outputMdPath: { type: 'string', description: 'Путь для сохранения .md отчёта (необязательно)' },
      },
      required: ['url'],
    },
  },

  {
    name: 'aim_localize_carousel',
    description: `🌍 Скопировать/локализовать/адаптировать чужую карусель.

РЕЖИМЫ:
• copy — рерайт структуры (те же триггеры, другой текст)
• localize — перевод на русский с культурной адаптацией под РФ/СНГ
• adapt — адаптация под твою тему/нишу (та же формула, новый контент)

Опционально: сразу рендерит в PNG через Puppeteer.

Пример: "Возьми эту карусель [ссылка] и сделай такую же про мой фитнес-бизнес"`,
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Ссылка на оригинальную карусель' },
        mode: {
          type: 'string',
          enum: ['copy', 'localize', 'adapt'],
          description: 'copy = рерайт | localize = перевод на RU | adapt = новая тема',
        },
        targetTopic: { type: 'string', description: 'Новая тема/ниша (только для mode=adapt)' },
        slideCount: { type: 'number', description: 'Количество слайдов (по умолчанию как в оригинале)' },
        designTheme: { type: 'number', description: 'Тема дизайна 1-8 для авторендера' },
        outputDir: { type: 'string', description: 'Папка для PNG (если хочешь сразу отрендерить)' },
      },
      required: ['url', 'mode'],
    },
  },

  {
    name: 'aim_viral_structure',
    description: `📐 Библиотека из 12 доказанных вирусных структур каруселей.

БАЗОВЫЕ СТРУКТУРЫ:
• open-loop       — Открытая петля: интрига + развязка (max вовлечённость)
• listicle        — Список-гид: N советов (max сохранения)
• before-after    — До/После + Система (трансформационные продажи)
• myth-busting    — Мифы vs Реальность (max охват)
• step-by-step    — Пошаговый гайд (max время сессии)

ПРОДВИНУТЫЕ СТРУКТУРЫ:
• case-study      — Разбор кейса с цифрами (max доверие + продажи)
• hot-take        — Горячий тейк / Спорное мнение (max комментарии)
• checklist-audit — Аудит / Чек-лист (max сохранения, многократный возврат)
• a-vs-b          — A vs B сравнение (аудитория выбирает стороны)
• day-in-life     — День из жизни / Рутина (лайфстайл + аспирация)
• faq             — Вопросы и ответы (trust building + engagement loop)
• story-arc       — Трёхактная история (narrative + max эмпатия)

Каждая структура: роль + триггер + формула для каждого слайда.
Вызови без structureId чтобы увидеть все 12. С structureId — детальный шаблон.`,
    inputSchema: {
      type: 'object',
      properties: {
        structureId: {
          type: 'string',
          enum: ['open-loop', 'listicle', 'before-after', 'myth-busting', 'step-by-step'],
          description: 'ID структуры (пусто = показать все 5)',
        },
        topic: { type: 'string', description: 'Тема для адаптации шаблона (необязательно)' },
      },
    },
  },

  // ── 🎨 CAROUSEL STUDIO ────────────────────────────────────────────────────

  {
    name: 'aim_draft_carousel_structure',
    description: `📝 ШАГ 1: Создание контентной структуры карусели.
Генерирует JSON-воронку с заголовками, текстом и эмодзи для каждого слайда.
Поддерживает 5 тонов: educational / motivational / professional / casual / provocative.

Пример: "Сделай карусель про 7 привычек успешных людей в мотивационном стиле"`,
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Тема карусели' },
        slideCount: { type: 'number', description: 'Количество слайдов (3-15, рекомендуется 7-10)' },
        toneOfVoice: {
          type: 'string',
          enum: ['educational', 'motivational', 'professional', 'casual', 'provocative'],
          description: 'Тон подачи',
        },
      },
      required: ['topic'],
    },
  },

  {
    name: 'aim_render_premium_carousel',
    description: `🎨 ШАГ 2: Рендер карусели в PNG через Puppeteer.
Принимает JSON слайдов и тему, рендерит PNG файлы 1080x1080 или 1080x1350.

ТЕМЫ:
1 = ✨ Glassmorphism — матовое стекло, фиолетовый
2 = 💥 Neo-Brutalism — кислотный, чёрные тени
3 = 🤍 Minimalist Elegance — журнальный, бежевый
4 = 💚 Dark Cyberpunk — неон, сетка кода
5 = 🍎 Apple Premium — чёрный, белый градиент
6 = 🌈 Y2K / Acid — ретро-футуризм, хром
7 = 🔵 EdTech / Trust — синий, корпоративный
8 = 🎯 Custom Brand — кастомный

Все темы поддерживают кириллицу (Google Fonts + Bunny Fonts, 18+ шрифтов).`,
    inputSchema: {
      type: 'object',
      properties: {
        slidesData: { description: 'JSON-строка или массив слайдов (с поддержкой layout, blocks, leftBlocks и т.д.)' },
        theme: { type: 'string', enum: ['1', '2', '3', '4', '5', '6', '7', '8'], description: 'Номер темы 1-8' },
        format: { type: 'string', enum: ['square', 'portrait'], description: 'square=1080x1080, portrait=1080x1350' },
        outputDir: { type: 'string', description: 'Папка для PNG (например: C:\\Users\\Alina\\Desktop\\carousel)' },
        globalCta: { type: 'string', description: 'Текст CTA-баннера на каждый слайд. Например: "Напиши СЛОВО в директ"' },
        brandColorOverlay: { type: 'string', description: 'CSS из aim_auto_brand_colors (опционально)' },
        customCssOverlay: { type: 'string', description: 'Кастомный CSS для темы 8 (опционально)' },
      },
      required: ['slidesData', 'theme', 'outputDir'],
    },
  },

  {
    name: 'aim_auto_brand_colors',
    description: `🎨 Настройка бренд-цветов темы. Включает проверку контрастности WCAG AA.

Пример: "Сделай тему Neo-Brutalism в цветах бренда: основной #E91E63, дополнительный #FF9800"`,
    inputSchema: {
      type: 'object',
      properties: {
        baseTheme: { type: 'string', enum: ['1', '2', '3', '4', '5', '6', '7', '8'], description: 'Номер базовой темы' },
        primaryColor: { type: 'string', description: 'Основной цвет HEX (#FF5722)' },
        secondaryColor: { type: 'string', description: 'Вторичный цвет HEX (#FFC107)' },
        textColor: { type: 'string', description: 'Цвет текста HEX (default: #FFFFFF)' },
      },
      required: ['baseTheme', 'primaryColor', 'secondaryColor'],
    },
  },
];

// ============================================================
// Инициализация MCP Server
// ============================================================

const server = new Server(
  { name: 'aim-instagram-suite', version: '1.2.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: string;

    switch (name) {

      // ── Video Tools ──────────────────────────────────────────────────────
      case 'aim_evaluate_video': {
        const parsed = EvaluateVideoSchema.parse(args);
        result = await evaluateVideo(parsed);
        break;
      }
      case 'aim_analyze_viral_reels': {
        const parsed = AnalyzeViralReelsSchema.parse(args);
        result = await analyzeViralReels(parsed);
        break;
      }
      case 'aim_generate_script': {
        const parsed = GenerateScriptSchema.parse(args);
        result = await generateScript(parsed);
        break;
      }
      case 'aim_analyze_hook': {
        const parsed = AnalyzeHookSchema.parse(args);
        result = await analyzeHook(parsed);
        break;
      }
      case 'aim_extract_pacing': {
        const parsed = ExtractPacingSchema.parse(args);
        result = await extractPacing(parsed);
        break;
      }

      // ── Carousel Studio Tools ────────────────────────────────────────────
      case 'aim_draft_carousel_structure': {
        const parsed = DraftCarouselSchema.parse(args);
        result = draftCarouselStructure(parsed);
        break;
      }
      case 'aim_render_premium_carousel': {
        const parsed = RenderCarouselSchema.parse(args);
        result = await renderPremiumCarousel(parsed as any);
        break;
      }
      case 'aim_auto_brand_colors': {
        const parsed = BrandColorsSchema.parse(args);
        result = autoBrandColors(parsed as any);
        break;
      }

      // ── Intelligence & Analysis ──────────────────────────────────────────
      case 'aim_score_carousel_virality': {
        const parsed = ScoreCarouselViralitySchema.parse(args);
        result = await scoreCarouselVirality(parsed);
        break;
      }

      case 'aim_score_virality': {
        const parsed = ScoreViralitySchema.parse(args);
        result = await scoreVirality(parsed);
        break;
      }
      case 'aim_analyze_carousel': {
        const parsed = AnalyzeCarouselSchema.parse(args);
        result = await analyzeCarousel(parsed);
        break;
      }
      case 'aim_localize_carousel': {
        const parsed = LocalizeCarouselSchema.parse(args);
        result = await localizeCarousel(parsed);
        break;
      }
      case 'aim_viral_structure': {
        const parsed = ViralStructureSchema.parse(args);
        if (parsed.structureId) {
          const structure = getViralStructure(parsed.structureId);
          if (!structure) {
            result = JSON.stringify({ error: `Структура "${parsed.structureId}" не найдена` });
          } else {
            const slides = structureToSlides(structure);
            result = JSON.stringify({
              tool: 'aim_viral_structure',
              structure: {
                id: structure.id,
                name: structure.name,
                description: structure.description,
                targetAudience: structure.targetAudience,
                engagementMechanic: structure.engagementMechanic,
                optimalSlideCount: structure.optimalSlideCount,
                slides: structure.slides,
              },
              templateSlides: slides,
              topic: parsed.topic ?? null,
              nextStep: parsed.topic
                ? `Передай templateSlides в aim_draft_carousel_structure с topic="${parsed.topic}" для генерации контента`
                : 'Укажи topic чтобы адаптировать шаблон, или передай templateSlides напрямую в aim_render_premium_carousel',
            }, null, 2);
          }
        } else {
          const all = listViralStructures();
          result = JSON.stringify({
            tool: 'aim_viral_structure',
            availableStructures: all.map(s => ({
              id: s.id, name: s.name, description: s.description,
              targetAudience: s.targetAudience, engagementMechanic: s.engagementMechanic,
              slideCount: s.slides.length,
            })),
            availableFonts: listAvailableFonts().length + ' кириллических шрифтов в библиотеке',
            usage: 'Вызови снова с structureId чтобы получить детальный шаблон',
          }, null, 2);
        }
        break;
      }

      case 'aim_create_style': {
        const parsed = CreateStyleSchema.parse(args);
        result = await createStyle(parsed as Parameters<typeof createStyle>[0]);
        break;
      }

      default:
        return {
          content: [{ type: 'text', text: `Неизвестный инструмент: ${name}` }],
          isError: true,
        };
    }

    // Парсим результат — он может содержать base64 картинку
    const parsedResult = JSON.parse(result);
    const content: Array<{ type: string; text?: string; data?: string; mimeType?: string }> = [];
    const textOnly = { ...parsedResult };

    // Извлекаем массивы base64 изображений (из видео-инструментов)
    let imagesToPush: Array<{ base64: string; mimeType: string }> = [];

    // Читаем массив gridImages
    const extractGridImages = (obj: any): boolean => {
      if (obj?.gridImages && Array.isArray(obj.gridImages)) {
        obj.gridImages.forEach((img: any) => {
          if (img.base64) {
            imagesToPush.push({ base64: img.base64, mimeType: img.mimeType ?? 'image/jpeg' });
            img.base64 = '[base64 image attached]';
          }
        });
        return true;
      }
      return false;
    };

    if (parsedResult.visualAnalysis?.gridImages) {
      extractGridImages(parsedResult.visualAnalysis);
    } else if (parsedResult.visualAnalysis?.visualContext?.gridImages) {
      extractGridImages(parsedResult.visualAnalysis.visualContext);
    } else if (parsedResult.visualHook?.gridImages) {
      extractGridImages(parsedResult.visualHook);
    } else if (parsedResult.visualContext?.gridImages) {
      extractGridImages(parsedResult.visualContext);
    } else if (parsedResult.originalCollage?.base64) {
      imagesToPush.push({ base64: parsedResult.originalCollage.base64, mimeType: parsedResult.originalCollage.mimeType ?? 'image/jpeg' });
      textOnly.originalCollage = { ...parsedResult.originalCollage, base64: '[base64 image attached]' };
    } else if (parsedResult.stylePreview?.base64) {
      imagesToPush.push({ base64: parsedResult.stylePreview.base64, mimeType: parsedResult.stylePreview.mimeType ?? 'image/jpeg' });
      textOnly.stylePreview = { ...parsedResult.stylePreview, base64: '[base64 image attached]' };
    }

    imagesToPush = [];
    content.push({ type: 'text', text: JSON.stringify(textOnly, null, 2) });

    if (imagesToPush.length > 0) {
      imagesToPush.forEach(img => {
        content.push({ type: 'image', data: img.base64, mimeType: img.mimeType });
      });
    }

    return { content };
} catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[AIM] Ошибка в ${name}:`, message);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: message,
          tool: name,
          hint: name.startsWith('aim_render')
            ? 'Убедитесь что Puppeteer установлен: npm install'
            : name.includes('carousel') || name.includes('virality')
              ? 'Убедитесь что yt-dlp установлен (npm install) и аккаунт публичный'
              : 'Убедитесь что ffmpeg-static, nodejs-whisper и yt-dlp установлены (npm install)',
        }, null, 2),
      }],
      isError: true,
    };
  }
});

// ============================================================
// Запуск сервера
// ============================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[AIM] 🚀 AIM Instagram Suite v3.1.0. Инструментов: ${TOOLS.length}`);
  console.error('[AIM] 🎬 Video:     aim_evaluate_video · aim_analyze_viral_reels · aim_generate_script · aim_analyze_hook · aim_extract_pacing');
  console.error('[AIM] 🎨 Carousel:  aim_draft_carousel_structure · aim_render_premium_carousel · aim_auto_brand_colors · aim_create_style');
  console.error('[AIM] 🔥 Intel:     aim_score_virality · aim_score_carousel_virality · aim_analyze_carousel · aim_localize_carousel · aim_viral_structure');
}

main().catch((err) => {
  console.error('[AIM] Критическая ошибка:', err);
  process.exit(1);
});
