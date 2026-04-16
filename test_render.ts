import { renderCarousel } from './src/core/htmlRenderer.js';
import { getTheme } from './src/core/designSystem.js';

const slides = [
  {
    slideNumber: 1,
    layout: 'standard' as const,
    title: 'Почему 90% стартапов проваливаются',
    subtitle: 'Исследование 2024 года',
    body: 'Главная причина — не продукт, а отсутствие product-market fit. Команды тратят месяцы на разработку, не проверив спрос.',
    emoji: '📊',
    tag: 'Аналитика',
  },
  {
    slideNumber: 2,
    layout: 'hero-number' as const,
    title: 'Единственная метрика',
    heroNumber: '72',
    heroUnit: '%',
    subtitle: 'стартапов умирают из-за отсутствия PMF',
  },
  {
    slideNumber: 3,
    layout: 'checklist' as const,
    title: 'Признаки Product-Market Fit',
    blocks: [
      { value: 'Органический рост без рекламы', accent: true },
      { value: 'Retention выше 40% на 3 месяц' },
      { value: 'NPS score больше 50' },
      { value: 'Клиенты рекомендуют друзьям' },
      { value: 'Очередь на waitlist растёт' },
    ],
  },
  {
    slideNumber: 4,
    layout: 'comparison' as const,
    title: 'Разница очевидна',
    subtitle: 'Без ИИ vs С AIM Suite',
    blocks: [
      { label: 'Без ИИ', value: '' },
      { label: 'С AIM Suite', value: '' },
    ],
    leftBlocks: [
      { value: 'Часы работы в редакторе' },
      { value: 'Поиск референсов' },
      { value: 'Ручная верстка' },
    ],
    rightBlocks: [
      { value: '3 секунды на рендер' },
      { value: '10 готовых лейаутов' },
      { value: 'Автоматическая типографика' },
    ],
  },
  {
    slideNumber: 5,
    layout: 'good-bad' as const,
    title: 'Частые ошибки',
    emoji: '⚖️',
    leftBlocks: [
      { value: 'Тестировать гипотезу' },
      { value: 'MVP за неделю' },
      { value: 'Цифры, не мнения' },
    ],
    rightBlocks: [
      { value: 'Планировать год' },
      { value: 'Идеальный продукт' },
      { value: 'Интуиция вместо данных' },
    ],
  },
  {
    slideNumber: 6,
    layout: 'steps-3' as const,
    title: 'Три шага к PMF',
    emoji: '🚀',
    blocks: [
      { label: 'Шаг 1', value: 'Поговори с 50 клиентами лично' },
      { label: 'Шаг 2', value: 'Запусти MVP за 2 недели' },
      { label: 'Шаг 3', value: 'Измерь retention и NPS' },
    ],
  },
  {
    slideNumber: 7,
    layout: 'quote' as const,
    quoteText: 'Product-market fit — это когда рынок сам вытягивает продукт из ваших рук',
    quoteAuthor: 'Marc Andreessen',
    title: '',
  },
  {
    slideNumber: 8,
    layout: 'cta-final' as const,
    title: 'Хочешь найти свой PMF?',
    subtitle: 'Скачай бесплатный гайд из 47 вопросов для CustDev',
    emoji: '🎯',
    ctaText: 'Напиши ГАЙД в директ →',
  },
];

async function main() {
  // Test Theme 5 (Apple Premium)
  console.log('=== Theme 5: Apple Premium ===');
  await renderCarousel(slides, {
    theme: getTheme(5),
    format: 'square',
    outputDir: 'C:/Users/Alina/Desktop/aimvideo/test_output_v3/theme5',
  });

  // Test Theme 1 (Glassmorphism)
  console.log('=== Theme 1: Glassmorphism ===');
  await renderCarousel(slides, {
    theme: getTheme(1),
    format: 'square',
    outputDir: 'C:/Users/Alina/Desktop/aimvideo/test_output_v3/theme1',
  });

  // Test Theme 2 (Neo-Brutalism)
  console.log('=== Theme 2: Neo-Brutalism ===');
  await renderCarousel(slides, {
    theme: getTheme(2),
    format: 'square',
    outputDir: 'C:/Users/Alina/Desktop/aimvideo/test_output_v3/theme2',
  });

  console.log('All themes rendered!');
}

main().catch(e => { console.error(e); process.exit(1); });
