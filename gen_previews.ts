import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const THEMES = [
  { id: 1, name: 'glassmorphism' },
  { id: 2, name: 'neo_brutalism' },
  { id: 3, name: 'minimalist_elegance' },
  { id: 4, name: 'dark_cyberpunk' },
  { id: 5, name: 'apple_premium' },
  { id: 6, name: 'y2k_acid' },
  { id: 7, name: 'edtech_trust' },
];

async function createPreview(themeId: number, themeName: string) {
  const dir = path.resolve(`test_output_v3/all_themes/theme${themeId}`);
  const slides = ['slide_01.png', 'slide_02.png', 'slide_03.png'];
  
  // Check files exist
  for (const s of slides) {
    if (!fs.existsSync(path.join(dir, s))) {
      console.error(`Missing: ${path.join(dir, s)}`);
      return;
    }
  }

  const GAP = 24;
  const SLIDE_W = 540;
  const SLIDE_H = 540;
  const TOTAL_W = SLIDE_W * 3 + GAP * 2;
  const TOTAL_H = SLIDE_H;

  // Resize each slide to 540px
  const resized = await Promise.all(
    slides.map(s =>
      sharp(path.join(dir, s))
        .resize(SLIDE_W, SLIDE_H)
        .toBuffer()
    )
  );

  // Composite into a single strip
  const output = await sharp({
    create: {
      width: TOTAL_W,
      height: TOTAL_H,
      channels: 4,
      background: { r: 18, g: 18, b: 24, alpha: 1 },
    },
  })
    .composite([
      { input: resized[0], left: 0, top: 0 },
      { input: resized[1], left: SLIDE_W + GAP, top: 0 },
      { input: resized[2], left: (SLIDE_W + GAP) * 2, top: 0 },
    ])
    .png()
    .toFile(path.resolve(`assets/previews/preview_theme_${themeId}_${themeName}.png`));

  console.log(`✅ Theme ${themeId} (${themeName}) → preview saved`);
}

async function main() {
  for (const t of THEMES) {
    await createPreview(t.id, t.name);
  }
  console.log('All previews generated!');
}

main().catch(e => { console.error(e); process.exit(1); });
