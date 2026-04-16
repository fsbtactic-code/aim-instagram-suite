import { renderPremiumCarousel } from './src/tools/renderPremiumCarousel.js';
import * as fs from 'fs';

async function run() {
  try {
    const data = JSON.parse(fs.readFileSync('test_carousel.json', 'utf8'));
    console.log("Starting render...");
    const result = await renderPremiumCarousel({ 
      slidesData: data.slides, 
      theme: 2, // Dark Cyberpunk / Neon
      format: 'portrait',
      outputDir: 'C:\\Users\\Alina\\Desktop\\carousel_test',
      globalCta: 'github.com/fsbtactic-code/aim-instagram-suite'
    });
    console.log("Render Result:", result);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
