# 🔬 Архитектура и Техническая документация (Under the Hood)

Этот раздел предназначен для разработчиков, которые хотят доработать AIM Instagram Suite, интегрировать новые инструменты или добавить поддержку новых форматов. 

## 📦 Архитектура ядра (\`src/core/\`)

Все основные абстракции находятся в ядре и вызываются 13-ю MCP-инструментами (в папке \`src/tools/\`).

| Модуль | Файл | Зависимость | Отвечает за |
|---|---|---|---|
| **FFmpeg Wrapper** | \`core/ffmpeg.ts\` | \`ffmpeg-static\` | Транскодирование видео -> аудио, детекция смены сцен (Scene Detection), извлечение кадров JPEG. |
| **Whisper Wrapper** | \`core/whisper.ts\` | \`nodejs-whisper\` | Локальная транскрибация скачанного WAV, возврат сегментов с timecodes. |
| **yt-dlp Wrapper** | \`core/ytdlp.ts\` | \`yt-dlp\` (bin) | Парсинг и скачивание MP4 по URL из TikTok, IG, FB, VK. |
| **Image Grid** | \`core/imageGrid.ts\` | \`sharp\` | Склейка кадров видео в сетки 3x3 для экономии токенов GPT-4 Vision. |
| **HTML Renderer** | \`core/htmlRenderer.ts\` | \`puppeteer\` | Запуск headless Chromium, рендеринг DOM, auto-fit текста, захват PNG. |
| **Design System** | \`core/designSystem.ts\` | - | Структурирование 8 тем, парсинг Base CSS, шрифтов и Color Overlays. |
| **Slide Layouts** | \`core/slideLayouts.ts\` | - | 10 HTML-шаблонов для каруселей, обёртка текстов в структуры. |
| **Viral Structures** | \`core/viralStructures.ts\` | - | База 12 структур вирусных воронок (AIDA, Hook-Retain-Reward и др.). |
| **Media Processor** | \`core/mediaProcessor.ts\`| - | Центральный пайплайн интеграции мультимедиа: 다운 -> Whisper -> FFmpeg -> Vision. |

---

## ⚙️ Пайплайны данных

Здесь описано, как перемещаются данные при вызове инструментов.

### 🎬 Видео-инструменты
*(Касается: \`aim_evaluate_video\`, \`aim_analyze_viral_reels\`, \`aim_analyze_hook\`, \`aim_extract_pacing\`)*

1. Запрос приходит на сервер с URL или локальным \`videoPath\`.
2. Если это URL, \`ytdlp.ts\` скачивает видео во временную папку.
3. \`ffmpeg.ts\` изолирует аудиодорожку (WAV 16kHz) 
4. \`whisper.ts\` локально распознаёт голос в текст с привязкой по секундам.
5. \`ffmpeg.ts\` выполняет поиск ключевых кадров (scene > 0.3).
6. \`imageGrid.ts\` сшивает кадры в единый коллаж для Vision.
7. Claude Server получает JSON: \`{ transcript, gridBase64 }\` и проводит аналитику нейросетью.

*Для \`aim_analyze_hook\` видео аппаратно обрезается (\`-t 5\`) до первых 5 секунд в FFmpeg до начала всего пайплайна.*

### 🎨 Рендер каруселей
*(Касается: \`aim_render_premium_carousel\`, \`aim_auto_brand_colors\`)*

1. LLM генерирует \`slidesData\` массив (включая эмодзи, лейаут, тексты).
2. Вызывается \`htmlRenderer.ts\` с \`themeId\`. Подгружается Google Font и CSS темы из \`designSystem\`.
3. Если запрошены цвета бренда, \`autoBrandColors\` вычисляет WCAG 2.1 контраст и создаёт CSS-оверлей.
4. Puppeteer поднимает headless-вкладку 1080x1350, инжектит HTML.
5. Срабатывает скрипт \`auto-fit\`, который подгоняет размер текста под контейнеры, чтобы избежать горизонтальных вылетов (scrollWidth) и вертикальных (scrollHeight).
6. Делается \`.screenshot()\`, PNG картинки записываются в диск `outputDir/`.

---

## 🛠 NPM Зависимости

- **@modelcontextprotocol/sdk** (v1.10.2): Реализация протокола Stdio/SSE для связи с Claude Desktop.
- **ffmpeg-static**: Нативный бинарник. Устраняет необходимость просить пользователя устанавливать FFmpeg через ОС.
- **nodejs-whisper**: C++ порт Whisper (whisper.cpp). При первом старте качает модель \`tiny\`.
- **puppeteer**: Движок рендера на базе Chromium.
- **sharp**: Самый быстрый парсер изображений на C++ (используется для генерации коллажей).

## 🚀 Настройка локальной среды для разработки (Dev Mode)

1. Клонируйте репозиторий.
2. \`npm install\` (Будут скачаны Chromium, yt-dlp.exe и ffmpeg).
3. Используйте \`npm run build\` (TypeScript \`tsc\`).
4. Для отладки рендера запустите тестовый скрипт:
   \`\`\`bash
   npx tsx test_render.ts
   \`\`\`
   Все генерации упадут в папку \`carousel_test\`.
5. Для отладки MCP сервера используйте стандартный инспектор:
   \`\`\`bash
   npx @modelcontextprotocol/inspector node build/index.js
   \`\`\`
