import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { renderPremiumCarousel } from '../src/tools/renderPremiumCarousel.js';
import { THEMES } from '../src/core/designSystem.js';

// Три универсальных слайда для демо
const DEFAULTS = [
  {
    slideNumber: 1,
    layout: 'hero-number',
    emoji: "🚀",
    title: "Идеально",
    subtitle: "AIM Instagram Suite",
    body: "Автоматический дизайн карточек в один клик прямо из вашего промпта."
  },
  {
    slideNumber: 2,
    layout: 'comparison',
    emoji: "⚖️",
    title: "Разница очевидна",
    blocks: [{label: "Без ИИ"}, {label: "С AIM Suite"}],
    leftBlocks: [
      {value: "Часы работы в редакторе"},
      {value: "Поиск референсов"}
    ],
    rightBlocks: [
      {value: "3 секунды на рендер"},
      {value: "10 готовых лейаутов"}
    ]
  },
  {
    slideNumber: 3,
    layout: 'checklist',
    emoji: "✨",
    title: "Что внутри?",
    blocks: [
      {value: "Умный перенос длинных текстов", accent: true},
      {value: "Кириллические премиум шрифты"},
      {value: "10 проверенных шаблонов (лейаутов)"}
    ]
  }
];

const CUSTOM_TEXTS = {
  1: [ // Glassmorphism
    { ...DEFAULTS[0], layout: 'standard', emoji: '🔮', title: 'Глассморфизм', subtitle: 'Мягкий свет и матовое стекло', body: 'Тренд моушн-дизайна 2024 года с прозрачными подложками.' },
    DEFAULTS[1],
    DEFAULTS[2]
  ],
  2: [ // Neo-Brutalism
    { ...DEFAULTS[0], layout: 'quote', title: 'ДЕЛАЙ БЫСТРО. ДЕЛАЙ ГРЯЗНО. НО КРАСИВО.', subtitle: 'Neo-Brutalism Theme' },
    { slideNumber: 2, layout: 'good-bad', emoji: '💥', title: 'Брутализм в деле', blocks: [{value: "Скучный белый фон\n(Как у всех)", accent: false}, {value: "Резкие тени и кислотные акценты\n(Взрывает ленту)", accent: true}] },
    { slideNumber: 3, layout: 'checklist', emoji: '🏴‍☠️', title: 'Чеклист бунтаря', blocks: [{value: "Жесткие рамки", accent: true}, {value: "Контрастные цвета"}, {value: "Необычная сетка"}] }
  ],
  3: [ // Minimalist
    { ...DEFAULTS[0], layout: 'hero-number', emoji: '🤍', title: 'Минимум', body: 'Никаких лишних деталей, только контент' },
    { slideNumber: 2, layout: 'grid-2x2', emoji: '🖼', title: 'Сетка', blocks: [{value:"Простотат"}, {value:"Осознанность"}, {value:"Читабельность"}, {value:"Конверсия"}] },
    { slideNumber: 3, layout: 'cta-final', title: 'Оставь комментарий' }
  ],
  4: [ // Cyberpunk
    { ...DEFAULTS[0], layout: 'hero-number', emoji: '🟩', title: 'Cyber', subtitle: 'Neon glow effect' },
    DEFAULTS[1],
    { slideNumber: 3, layout: 'steps-3', emoji: '👾', title: 'Взлом системы', blocks: [{label: "1. Init"}, {label: "2. Fetch"}, {label: "3. Render"}] }
  ],
  5: [ // Apple
    { ...DEFAULTS[0], layout: 'before-after', emoji: '🍏', title: 'Эволюция', subtitle: 'Think Different', blocks: [{value: "Сложные интерфейсы", accent:false}, {value: "Одна кнопка Render", accent:true}] },
    DEFAULTS[1],
    DEFAULTS[2]
  ],
  6: [ // Y2K
    { ...DEFAULTS[0], layout: 'standard', emoji: '💿', title: 'Y2K Vibes' },
    { slideNumber: 2, layout: 'grid-2x2', emoji: '🌐', title: 'Интернет 2000-х', blocks: [{label:"Acid"}, {label:"Chrome"}, {label:"Retro"}, {label:"Vaporwave"}] },
    DEFAULTS[2]
  ],
  7: [ // EdTech
    { ...DEFAULTS[0], layout: 'checklist', emoji: '📘', title: 'Обучение' },
    { slideNumber: 2, layout: 'good-bad', emoji: '📖', title: 'Как учить', blocks: [{value: "Сложные термины", accent:false}, {value: "Понятные схемы", accent:true}] },
    { slideNumber: 3, layout: 'quote', title: 'Образование будущего — это микролернинг.', subtitle: 'EdTech Theme' }
  ],
  8: [ // Brand (using default colors for preview)
    { ...DEFAULTS[0], layout: 'hero-number', emoji: '🎨', title: 'Свой Цвет', subtitle: 'Custom Brand' },
    DEFAULTS[1],
    DEFAULTS[2]
  ]
};

async function stitchImagesHorizontal(paths: string[], outPath: string) {
  // Assuming each image is 1080x1350
  const width = 1080;
  const height = 1350;
  const totalWidth = width * paths.length;

  const compositeImages = paths.map((p, index) => ({
    input: p,
    top: 0,
    left: index * width
  }));

  await sharp({
    create: {
      width: totalWidth,
      height: height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite(compositeImages)
  .png()
  .toFile(outPath);
}

async function run() {
  const assetsDir = path.join(process.cwd(), 'assets', 'previews');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const tempDir = path.join(process.cwd(), 'temp_previews');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  for (const t of Object.values(THEMES)) {
    console.log(`\nRendering Theme: ${t.label} (ID: ${t.id})`);
    
    // Create specific text for theme or use default
    // @ts-ignore
    const slidesData = CUSTOM_TEXTS[t.id] || DEFAULTS;
    
    const resString = await renderPremiumCarousel({
      slidesData,
      theme: t.id,
      format: 'portrait',
      outputDir: tempDir,
      globalCta: 'github.com/fsbtactic-code/aim-instagram-suite',
      brandColorOverlay: t.id === 8 ? '--color-primary: #FF5722; --color-secondary: #03A9F4; --color-bg: #E0F7FA;' : undefined
    });

    const parsed = JSON.parse(resString);
    if (parsed.error) {
      console.error(`Error rendering theme ${t.id}:`, parsed.error);
      continue;
    }

    const slidePaths = parsed.files as string[];
    const outFileName = `preview_theme_${t.id}_${t.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
    const outPath = path.join(assetsDir, outFileName);

    await stitchImagesHorizontal(slidePaths, outPath);
    console.log(`Saved stitched preview: ${outPath}`);

    // Clean up temp pngs
    slidePaths.forEach(p => fs.unlinkSync(p));
  }
  
  if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
  console.log("All previews generated in assets/previews/!");
}

run();
