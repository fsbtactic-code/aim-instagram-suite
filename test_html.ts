import { renderCarousel } from './src/core/htmlRenderer.js';
import * as fs from 'fs';

async function run() {
  const data = JSON.parse(fs.readFileSync('test_carousel.json', 'utf8'));
  const htmlSlides = renderCarousel(data.slides, {
    format: 'portrait',
    theme: 5,
    outputDir: './', // Not actually used by HTML generator directly, but required by options
    globalCta: 'github.com/fsbtactic-code/aim-instagram-suite'
  });
  
  if (htmlSlides.htmlList) {
    fs.writeFileSync('test_slide_4.html', htmlSlides.htmlList[3]);
    fs.writeFileSync('test_slide_7.html', htmlSlides.htmlList[6]);
    console.log('HTML saved.');
  } else {
    // looking at how renderCarousel works... wait, does it return HTML list?
    console.log("Returned from renderCarousel is an object:", htmlSlides);
  }
}

run();
