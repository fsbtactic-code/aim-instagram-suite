import { renderCarousel } from './src/core/htmlRenderer.js';
import { getTheme } from './src/core/designSystem.js';

const testSlides = [
  {
    slideNumber: 1,
    layout: 'standard' as const,
    title: 'Почему 90% стартапов проваливаются',
    subtitle: 'Исследование 2024',
    body: 'Главная причина — не продукт, а отсутствие product-market fit.',
    emoji: '📊',
    tag: 'Аналитика',
  },
  {
    slideNumber: 2,
    layout: 'hero-number' as const,
    heroNumber: '72',
    heroUnit: '%',
    title: '72%',
    subtitle: 'стартапов умирают из-за отсутствия PMF',
  },
  {
    slideNumber: 3,
    layout: 'checklist' as const,
    title: 'Признаки PMF',
    blocks: [
      { value: 'Органический рост без рекламы', accent: true },
      { value: 'Retention выше 40% на 3 месяц' },
      { value: 'NPS score больше 50' },
      { value: 'Клиенты рекомендуют друзьям' },
    ],
  },
];

async function main() {
  const themeNames = [
    'Glassmorphism', 'Neo-Brutalism', 'Minimalist', 'Cyberpunk', 
    'Apple Premium', 'Y2K Acid', 'EdTech'
  ];
  
  for (let i = 1; i <= 7; i++) {
    console.log(`=== Theme ${i}: ${themeNames[i-1]} ===`);
    try {
      await renderCarousel(testSlides, {
        theme: getTheme(i),
        format: 'square',
        outputDir: `C:/Users/Alina/Desktop/aimvideo/test_output_v3/all_themes/theme${i}`,
      });
    } catch (e) {
      console.error(`Theme ${i} FAILED:`, e);
    }
  }
  console.log('All 7 themes rendered!');
}

main().catch(e => { console.error(e); process.exit(1); });
