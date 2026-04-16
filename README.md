<div align="center">
  <img src="assets/logo.svg" alt="AIM Instagram Suite Logo" width="100%">
  
  # 🎯 AIM Instagram Suite (v1.2.0)
  
  **Локальный AI-ассистент (MCP Server) для анализа, реверс-инжиниринга и генерации вирусного контента в Instagram (Reels & Carousels).**
  
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Puppeteer](https://img.shields.io/badge/Puppeteer-Local_Render-40B5A4?logo=puppeteer&logoColor=white)](https://pptr.dev/)
  [![Local FFmpeg](https://img.shields.io/badge/FFmpeg-Zero_API-007808?logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)

  [Read in English 🇬🇧](README.en.md)
</div>

---

## ⚡ Что это такое?

**AIM Instagram Suite** — это набор из 13 инструментов (tools), работающих как локальный сервер [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). Он подключается к Claude Desktop или вашему IDE (Cursor, Windsurf) и позволяет AI-агенту автономно анализировать видео, скачивать Reels и карусели, оценивать их виральность и автоматически рендерить новые посты в премиум-дизайне прямо у вас на компьютере. **Без платных API и сторонних сервисов.**

## 🛠 Установка

### Вариант 1 — Claude Code CLI (рекомендуется, одна команда)

Клонируй репо и зарегистрируй MCP одной командой:

```bash
git clone https://github.com/fsbtactic-code/aim-instagram-suite.git
cd aim-instagram-suite
npm install
claude mcp add aim-instagram-suite -- npx tsx "$(pwd)/src/index.ts"
```

> **Windows PowerShell:**
> ```powershell
> git clone https://github.com/fsbtactic-code/aim-instagram-suite.git
> cd aim-instagram-suite
> npm install
> claude mcp add aim-instagram-suite -- npx tsx "$PWD\src\index.ts"
> ```

После этого перезапусти Claude Code. Slash-команды `/project:aim-*` появятся автоматически — файлы уже в `.claude/commands/`.

---

### Вариант 2 — Claude Desktop (ручная настройка)

1. Склонируй и установи зависимости:
```bash
git clone https://github.com/fsbtactic-code/aim-instagram-suite.git
cd aim-instagram-suite
npm install
```

2. Открой конфиг Claude Desktop:
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

3. Добавь сервер в `mcpServers` (замени путь на свой):
```json
{
  "mcpServers": {
    "aim-instagram-suite": {
      "command": "npx",
      "args": ["tsx", "C:\\путь\\к\\aim-instagram-suite\\src\\index.ts"]
    }
  }
}
```

4. Полностью перезапусти Claude Desktop (не просто сверни — закрой через трей).

> ⚠️ **Важно:** не используй `node dist/index.js` — build не нужен. Сервер запускается напрямую через `npx tsx src/index.ts`.

---

### Вариант 3 — Авто-установка промптом (для Cursor / Windsurf)

Вставь этот промпт в чат своего AI-агента:

> Склонируй репозиторий `https://github.com/fsbtactic-code/aim-instagram-suite.git` в папку на рабочем столе.
> Перейди в папку, выполни `npm install`.
> Добавь MCP сервер с командой `npx tsx` и аргументом — абсолютный путь к `src/index.ts` в склонированной папке.
> Перезапусти IDE и подтверди что сервер `aim-instagram-suite` подключён (должно появиться 13 инструментов `aim_`).

---

> 💡 **Slash-команды `/project:aim-*`** работают только в **Claude Code CLI** (не в Claude Desktop).
> В Claude Desktop инструменты вызываются напрямую в чате: *"используй aim_draft_carousel_structure..."*

---



## 🚀 Примеры промптов для Claude

Просто скопируйте и вставьте эти фразы в чат с Claude (когда подключен MCP сервер):

### 1. Анализ конкурентов и "Кража" структуры
> 💬 *"Разбери эту карусель конкурента: [ссылка на Instagram]. Распиши мне, какие триггеры они используют на каждом слайде для активации FOMO (синдрома упущенной выгоды). Сохрани анализ в файл конкурент.md"*

> 💬 *"Скачай и проанализируй вот этот вирусный Reel: [ссылка на TikTok/Reel]. Сделай реверс-инжиниринг его монтажа (найди 'провисания' с помощью детектора скуки) и вытащи его транскрипт."*

### 2. Оценка вашего контента перед публикацией (Индекс Виральности)
> 💬 *"Я снял новое видео C:/Users/МоиВидео/reel.mp4. Прогони его через AIM Score Video. Моя ниша — 'Инвестиции для новичков'. Дай мне индекс виральности и топ-3 конкретных совета, как улучшить хук в первые 3 секунды."*

> 💬 *"Проверь виральность этих PNG-картинок (моя новая карусель). Папка: C:/Users/Carousel. Какова оценка дизайна, читаемости и CTA?"*

### 3. Автоматическая генерация и рендер Каруселей
> 💬 *"Сделай новую карусель про '5 ошибок выгорания на фрилансе'. Используй структуру 'day-in-life' (день из жизни). Затем отрендери её в теме Neo-Brutalism (тема 2) в формате 1080x1350 и сохрани в папку C:/Users/Render."*

> 💬 *"Сгенерируй карусель-кейс 'Как я заработал первый миллион'. Обязательно используй лейауты 'хорошо-плохо' и табличную 'сравнение A vs B'. На каждом слайде добавь CTA: 'Напиши слово ДЕНЬГИ в Директ'. Отрендери в теме Apple Premium (5)."*

---

## 🧩 Архитектура: Модули (13 Инструментов)

### 🎬 Видео-аналитика
* `aim_evaluate_video` — Расчёт Индекса Виральности ВИДЕО (Хук, Динамика, Эмоции).
* `aim_analyze_viral_reels` — Скачивание и реверс-инжиниринг вирусных видео.
* `aim_generate_script` — Генератор сценариев на основе успешных конкурентов.
* `aim_analyze_hook` — Изолированный аудит плотности и силы первых 5 секунд (Хука).
* `aim_extract_pacing` — Машинный "Детектор скуки", ищущий провисания по ритму кадров.

### 🖼 Carousel Studio (Новое в 1.2!)
* `aim_score_carousel_virality` — Мультифакторная оценка каруселей (Воронка, Читаемость, Save-фактор).
* `aim_analyze_carousel` — Скачивает карусели конкурентов, клеит в коллаж, читает текст.
* `aim_localize_carousel` — Автоматический перевод и адаптация зарубежных каруселей-миллионников.
* `aim_viral_structure` — Библиотека из 12 научных шаблонов (Case Study, Hot Take, Checklist, Story Arc и др.).
* `aim_draft_carousel_structure` — AI-генератор JSON-структуры с эмодзи и разбивкой по ролям.
* `aim_render_premium_carousel` — **Puppeteer-Движок.** Сам рисует вашу карусель из JSON в готовые PNG-картинки с использованием 10 уникальных лейаутов (сетки, таблички, До/После) и 8 премиум-стилей (Glassmorphism, Cyberpunk, Neo-Brutalism).
* `aim_auto_brand_colors` — Адаптация тем рендера под ваши корпоративные HEX-цвета.

---

## ⌨️ Slash Commands (Skills) — поддерживаемые платформы

Все 13 инструментов доступны как slash-команды. Файлы уже включены в репозиторий — просто скопируйте в нужное место.

| Платформа | Формат | Директория в репо | Вызов |
|---|---|---|---|
| **Claude Code** | `.md` | `.claude/commands/` | `/project:aim-*` |
| **Gemini CLI / Antigravity** | `.toml` | `.gemini/commands/aim/` | `/aim:*` |
| **Cursor** | `.mdc` | `.cursor/rules/` | Авто-контекст |
| **GitHub Copilot** | `.md` | `.github/` | Авто-контекст |
| **Windsurf** | rules | `.windsurfrules` | Авто-контекст |

### Быстрая установка

**Claude Code** — команды работают сразу (файлы в `.claude/commands/`):
```
/project:aim-evaluate-video
/project:aim-draft-carousel
/project:aim-render-carousel
/project:aim-score-video
# и т.д. для всех 13 инструментов
```

**Gemini / Antigravity** — скопировать глобально:
```powershell
# Windows
Copy-Item .gemini\commands\aim $HOME\.gemini\commands\ -Recurse -Force
```
```bash
# macOS / Linux
cp -r .gemini/commands/aim ~/.gemini/commands/
```
Команды: `/aim:evaluate_video`, `/aim:draft_carousel`, `/aim:render_carousel` и т.д.

**Cursor / Windsurf / Copilot** — подробная инструкция в [`SKILLS_SETUP.md`](SKILLS_SETUP.md).

---

## 🎨 Система дизайна и Лейауты

Наш движок рендеринга `htmlRenderer` включает **10 умных лейаутов**:
1. `standard` (Текст + Эмодзи)
2. `hero-number` (Большая цифра по центру)
3. `grid-2x2` (4 блока сеткой сравнения)
4. `good-bad` (Сплит ✅ Правильно vs ❌ Ошибка)
5. `before-after` (ДО / ПОСЛЕ по вертикали)
6. `steps-3` (Три шага в ряд)
7. `quote` (Полноэкранная цитата)
8. `checklist` (Чек-лист с галочками)
9. `comparison` (Таблица сравнения A vs B)
10. `cta-final` (Финал с большим призывом)

А также поддерживает персистентный CTA-баннер на каждом слайде: *"Напиши слово X..."*

---

## 📦 Полный справочник MCP-инструментов

### 🎬 Видео-аналитика

| Инструмент | Входные параметры | Что делает |
|---|---|---|
| `aim_evaluate_video` | `videoPath` | Полный анализ видео: хук, удержание, эмоции, индекс виральности (0-100). Использует FFmpeg → кадровая сетка → Vision. |
| `aim_analyze_viral_reels` | `url`, `outputMdPath` | Скачивает видео (Instagram/TikTok/YouTube/VK), транскрибирует через Whisper, делает реверс-инжиниринг структуры, сохраняет .md отчёт. |
| `aim_generate_script` | `referenceMdPath`, `targetTopic` | Читает .md отчёт из `aim_analyze_viral_reels` и адаптирует успешную структуру под новую тему/нишу. |
| `aim_analyze_hook` | `videoPath` или `url` | Изолированный анализ хука (первые 5 секунд) + 5 вариантов усиления с указанием триггеров. |
| `aim_extract_pacing` | `videoPath` или `url`, `slowThresholdSec?` | Детектор скуки: таймкоды смен кадра, провисания, оценка динамики монтажа. |

### 📊 Оценка виральности

| Инструмент | Входные параметры | Что делает |
|---|---|---|
| `aim_score_virality` | `videoPath` или `url`, `context?` | Индекс Виральности ВИДЕО (0-100) по 7 критериям: Хук 25%, Динамика 20%, Звук 15%, Ценность 15%, Эмоции 12%, Визуал 8%, CTA 5%. |
| `aim_score_carousel_virality` | `url` или `slidesDir`, `context?`, `goal?` | Индекс Виральности КАРУСЕЛИ (0-100) по 6 carousel-специфичным критериям. Анализирует save-rate и share-rate. |

### 🔍 Анализ каруселей конкурентов

| Инструмент | Входные параметры | Что делает |
|---|---|---|
| `aim_analyze_carousel` | `url`, `outputMdPath?` | Скачивает все слайды, склеивает в коллаж, анализирует AIDA-воронку и психологические триггеры каждого слайда. |
| `aim_localize_carousel` | `url`, `mode`, `targetTopic?`, `slideCount?`, `designTheme?`, `outputDir?` | Три режима: `copy` (рерайт), `localize` (перевод на RU), `adapt` (адаптация под новую нишу). Опционально — авторендер в PNG. |
| `aim_viral_structure` | `structureId?`, `topic?` | Библиотека из 12 доказанных структур каруселей. Без `structureId` — список всех. С ID — детальный шаблон слайдов. |

### 🎨 Carousel Studio (создание и рендер)

| Инструмент | Входные параметры | Что делает |
|---|---|---|
| `aim_draft_carousel_structure` | `topic`, `slideCount?` (3-15), `toneOfVoice?` | ШАГ 1: Генерирует JSON-структуру карусели с заголовками, текстом и эмодзи. Поддерживает 5 тонов подачи. |
| `aim_render_premium_carousel` | `slidesData`, `theme` (1-8), `outputDir`, `format?`, `globalCta?`, `brandColorOverlay?` | ШАГ 2: Рендерит PNG через Puppeteer. 8 тем дизайна, 10 лейаутов, кириллица, размеры 1080×1080 или 1080×1350. |
| `aim_auto_brand_colors` | `baseTheme` (1-8), `primaryColor`, `secondaryColor`, `textColor?` | Генерирует CSS-оверлей бренд-цветов с проверкой контрастности WCAG AA. Передаётся в `aim_render_premium_carousel`. |

### 🎨 Темы дизайна (aim_render_premium_carousel)

| # | Название | Стиль |
|---|---|---|
| 1 | ✨ Glassmorphism | Матовое стекло, фиолетовый градиент |
| 2 | 💥 Neo-Brutalism | Кислотные цвета, чёрные тени |
| 3 | 🤍 Minimalist Elegance | Журнальный, бежевый |
| 4 | 💚 Dark Cyberpunk | Неон, сетка кода |
| 5 | 🍎 Apple Premium | Чёрный/белый градиент |
| 6 | 🌈 Y2K / Acid | Ретро-футуризм, хром |
| 7 | 🔵 EdTech / Trust | Синий, корпоративный |
| 8 | 🎯 Custom Brand | Под бренд через `aim_auto_brand_colors` |

---

## ⚠️ Предупреждения и приватность
* **Zero APIs**: Вся работа (FFmpeg транскодинг, склейка кадров, Puppeteer рендер, скачивание `yt-dlp`) выполняется строго локально.
* Единственный внешний процесс — Python Whisper (если установлен локально) или OCR/Vision анализ, который запускается самим Claude. Мы не сохраняем ваши данные.

---

## 🔬 Как это работает изнутри — библиотеки и пайплайны

### Архитектура ядра (`src/core/`)

| Модуль | Файл | Библиотека / Бинарник | Что делает |
|---|---|---|---|
| **FFmpeg wrapper** | `core/ffmpeg.ts` | `ffmpeg-static` (npm) | Извлекает аудио в WAV, детектирует смены сцен, вырезает хук, возвращает таймкоды |
| **Whisper wrapper** | `core/whisper.ts` | `nodejs-whisper` (npm) | Транскрибирует аудио локально, возвращает сегменты с таймкодами |
| **yt-dlp wrapper** | `core/ytdlp.ts` | `yt-dlp` (бинарник, скачивается `postinstall`) | Скачивает видео по URL (Instagram/TikTok/YouTube/VK/Twitter) |
| **Image Grid** | `core/imageGrid.ts` | `sharp` (npm) | Склеивает кадры в одну сетку 3×3 (768px JPEG 70%) для экономии токенов Vision |
| **HTML Renderer** | `core/htmlRenderer.ts` | `puppeteer` (npm) | Открывает headless Chrome, рендерит HTML → скриншот PNG 1080px |
| **Design System** | `core/designSystem.ts` | встроенный TypeScript | 8 тем: CSS переменные, Google Fonts URL, цвета, типографика |
| **Slide Layouts** | `core/slideLayouts.ts` | встроенный TypeScript | 10 HTML-шаблонов лейаутов (grid, quote, checklist и др.) |
| **Viral Structures** | `core/viralStructures.ts` | встроенный TypeScript | База из 12 структур каруселей с шаблонами слайдов |
| **Media Processor** | `core/mediaProcessor.ts` | координирует все модули | Главный пайплайн: URL/файл → скачать → Whisper → FFmpeg Scene → Grid → base64 |

---

### Пайплайны по инструментам

#### 🎬 Видео-инструменты (`aim_evaluate_video`, `aim_analyze_viral_reels`, `aim_analyze_hook`, `aim_extract_pacing`, `aim_score_virality`)

```
Входные данные (videoPath или URL)
        │
        ▼
[ytdlp.ts] ── если URL → yt-dlp скачивает MP4 во временную папку os.tmpdir()
        │
        ▼
[ffmpeg.ts] extractAudio() ── ffmpeg-static → WAV 16kHz моно (требование Whisper)
        │
        ▼
[whisper.ts] transcribe() ── nodejs-whisper → транскрипт с таймкодами по сегментам
        │
        ▼
[ffmpeg.ts] extractSceneFrames() ── FFmpeg filter select='gt(scene,0.3)' → JPEG кадры
        │
        ▼
[imageGrid.ts] buildGrid() ── sharp склеивает кадры в сетку 3×3, 768px, JPEG 70%
        │
        ▼
Результат → JSON { transcript, gridBase64, timecodes } → передаётся Claude Vision
```

**Экономия токенов**: вместо N отдельных картинок — ровно 1 сетка. Транскрипт идёт первым (text-first), чтобы Vision-запрос был контекстным.

**Для `aim_analyze_hook`**: видео обрезается до первых 5 секунд (`ffmpeg -t 5`) перед пайплайном.

**Для `aim_extract_pacing`**: используется упрощённый пайплайн без сохранения кадров — только `detectSceneTimecodes()` с `ffmpeg showinfo` → анализ интервалов между склейками → поиск `slowSpots` (интервалы > порога).

---

#### 🎨 Carousel Render (`aim_render_premium_carousel`)

```
slidesData (JSON массив слайдов)
        │
        ▼
[slideLayouts.ts] → выбирает HTML-шаблон по полю layout каждого слайда
        │
        ▼
[designSystem.ts] → применяет тему (CSS переменные + Google Fonts URL)
        │         → если brandColorOverlay — переопределяет цвета темы
        ▼
[htmlRenderer.ts] renderCarousel() → для каждого слайда:
        │   1. Формирует полный HTML-документ (тема + лейаут + CTA-баннер)
        │   2. Puppeteer: page.setContent(html)
        │   3. page.screenshot({ type: 'png', clip: { 1080×1080 или 1080×1350 } })
        │   4. Сохраняет PNG в outputDir/slide_01.png ... slide_N.png
        ▼
Результат → список путей к PNG файлам
```

**Шрифты**: загружаются через Google Fonts / Bunny Fonts CDN непосредственно при рендере в Puppeteer. Поддерживается 18+ кириллических шрифтов (Inter, Montserrat, Raleway, Oswald и др.).

**CTA-баннер** (`globalCta`): добавляется как абсолютно позиционированный HTML-блок поверх каждого слайда через CSS `position: absolute; bottom: 0`.

---

#### 🔍 Анализ каруселей конкурентов (`aim_analyze_carousel`, `aim_localize_carousel`, `aim_score_carousel_virality`)

```
URL карусели (Instagram / VK)
        │
        ▼
[ytdlp.ts] yt-dlp --write-all-thumbnails → скачивает все слайды как изображения
        │
        ▼
[imageGrid.ts] buildGrid() ── sharp склеивает все слайды в вертикальную ленту-коллаж
        │
        ▼
Результат → JSON { collage: { base64 } } → Claude Vision анализирует все слайды сразу
```

---

#### 📝 Генерация структуры (`aim_draft_carousel_structure`)

```
topic + toneOfVoice + slideCount
        │
        ▼
[draftCarouselStructure.ts] ── чистый TypeScript, без внешних библиотек
        │   Формирует prompt с инструкцией для Claude:
        │   - выбрать структуру воронки (AIDA)
        │   - назначить роль каждому слайду
        │   - предложить лейаут и эмодзи
        ▼
JSON-массив слайдов → готов для aim_render_premium_carousel
```

---

#### 🎨 Бренд-цвета (`aim_auto_brand_colors`)

```
baseTheme + primaryColor + secondaryColor
        │
        ▼
[autoBrandColors.ts] ── встроенный TypeScript
        │   1. Вычисляет относительную яркость (WCAG 2.1 формула)
        │   2. Проверяет контрастность: ratio = (L1+0.05)/(L2+0.05) >= 4.5 (AA)
        │   3. Если не проходит — корректирует textColor автоматически
        ▼
Возвращает CSS-строку: --color-primary: #E91E63; --color-secondary: #FF9800; ...
→ Передаётся в aim_render_premium_carousel через brandColorOverlay
```

---

### npm-зависимости (production)

| Пакет | Версия | Для чего |
|---|---|---|
| `@modelcontextprotocol/sdk` | ^1.10.2 | MCP Server (StdioTransport, Tool handlers) |
| `ffmpeg-static` | ^5.2.0 | Bundled FFmpeg бинарник (кросс-платформенный) |
| `nodejs-whisper` | ^0.2.2 | Локальная транскрибация через OpenAI Whisper |
| `puppeteer` | ^24.41.0 | Headless Chrome для рендера HTML → PNG |
| `sharp` | ^0.33.5 | Склейка изображений в сетку (Image Grid, коллажи) |
| `zod` | ^3.23.8 | Валидация входных параметров всех инструментов |

### Внешние бинарники (скачиваются автоматически при `npm install`)

| Бинарник | Скрипт | Назначение |
|---|---|---|
| `yt-dlp` (`.exe` на Windows) | `scripts/postinstall.js` | Скачивание видео по URL с 1000+ платформ |
| Chromium | `puppeteer` postinstall | Headless браузер для рендера каруселей |
| Whisper модель | `nodejs-whisper` | Локальная speech-to-text модель (tiny/base) |

---

## Разработчик
Создано с любовью для автоматизации Инстаграм-рутины.
[fsbtactic-code](https://github.com/fsbtactic-code)
