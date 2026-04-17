import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { randomUUID } from 'crypto';
import puppeteer from 'puppeteer';
import { fetchIqsavedConnectToken, fetchIqsavedCarouselItems, canonicalInstagramUrlFromInput, buildIqsavedImageDownloadUrl } from './iqsaved.js';

export interface InstagramMedia {
  url: string; // The direct MP4 or JPG link
  isVideo: boolean;
}

/**
 * Загрузка медиа по прямой ссылке с сохранением во временный файл
 */
export async function downloadFileFast(url: string, destDir: string, extension: string): Promise<string> {
  const filePath = path.join(destDir, `${randomUUID()}.${extension}`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath);
    res.body.pipe(fileStream);
    res.body.on('error', (err: any) => reject(err));
    fileStream.on('finish', () => resolve(filePath));
  });
}

/**
 * Получение прямых ссылок на MP4/JPG через Cobalt API (Zero-Ad Community API)
 */
async function fetchViaCobalt(url: string): Promise<InstagramMedia[]> {
  try {
    const res = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        url: url,
        filenamePattern: 'nerd'
      })
    });
    
    if (!res.ok) {
      throw new Error(`Cobalt HTTP ${res.status}`);
    }
    
    const data = await res.json() as any;
    if (data.status === 'error') {
      throw new Error(`Cobalt API Error: ${data.text || data.error?.code}`);
    }

    // Если это карусель, Cobalt возвращает picker
    if (data.status === 'picker' && Array.isArray(data.picker)) {
      return data.picker.map((item: any) => ({
        url: item.url,
        isVideo: item.type === 'video'
      }));
    }

    // Обычное видео / одно фото
    if (data.url) {
      return [{
        url: data.url,
        isVideo: data.url.includes('.mp4') || !data.url.includes('.jpg')
      }];
    }
    
    throw new Error('Unknown Cobalt response format');
  } catch (error) {
    console.error('[AIM] Cobalt failed:', error);
    return [];
  }
}

/**
 * Получение медиа через открытый API IQSaved (быстро и стабильно для каруселей)
 */
async function fetchViaIqsaved(url: string): Promise<InstagramMedia[]> {
  try {
    const canonical = canonicalInstagramUrlFromInput(url);
    if (!canonical) return [];
    
    const token = await fetchIqsavedConnectToken();
    const items = await fetchIqsavedCarouselItems(canonical.postUrl, token);
    
    const mediaLinks: InstagramMedia[] = [];
    for (const item of items) {
      if (item.downloadLink && item.downloadLink.length > 0) {
        // Обычно самая тяжелая версия - последняя в массиве downloadLink
        const dl = item.downloadLink[item.downloadLink.length - 1];
        if (dl.value) {
            const isVid = dl.filename?.includes('.mp4') || item.type === 'video';
            const proxyUrl = buildIqsavedImageDownloadUrl(dl.value, dl.filename || (isVid ? 'video.mp4' : 'slide.jpg'));
            mediaLinks.push({
               url: proxyUrl,
               isVideo: isVid
            });
        }
      }
    }
    console.error(`[AIM] IQSaved API успешно извлек файлов: ${mediaLinks.length}`);
    return mediaLinks;
  } catch (error: any) {
    console.error('[AIM] IQSaved API failed:', error.message);
    return [];
  }
}

/**
 * Получение ссылок через коммерческий RapidAPI (около 100 запросов бесплатно)
 * Для тех случаев, когда бесплатные сервисы лежат
 */
async function fetchViaRapidAPI(url: string, apiKey: string): Promise<InstagramMedia[]> {
  // Реализация под популярный "Instagram Scraper API" на RapidAPI (пример endpoint)
  // Мы оставляем скелет для пользователя, если он предоставит ключ.
  try {
    const res = await fetch(`https://instagram-scraper-api2.p.rapidapi.com/v1/dl_insta?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
      }
    });

    if (!res.ok) throw new Error(`RapidAPI HTTP ${res.status}`);
    const data = await res.json() as any;
    
    if (data?.data && Array.isArray(data.data)) {
         return data.data.map((item: any) => ({
             url: item.url,
             isVideo: item.is_video
         }));
    }
    return [];
  } catch (error) {
    console.error('[AIM] RapidAPI failed:', error);
    return [];
  }
}

/**
 * Извлечение через Puppeteer используя список сторонних сервисов (igram, iqsaved, fastdl)
 */
async function fetchViaWebScraper(url: string): Promise<InstagramMedia[]> {
  console.error('[AIM] Запускаем Puppeteer Web Scraper...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
  });
  
  try {
    const page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(type) && !req.url().includes('fastdl') && !req.url().includes('igram') && !req.url().includes('iqsaved')) {
        req.abort();
      } else {
        req.continue();
      }
    });
    const scrapers = [
      {
        name: 'iqsaved.com',
        url: 'https://iqsaved.com/ru',
        input: 'input',
        submit: 'button[type="submit"]',
        waitCondition: () => ((globalThis as any).document.querySelectorAll('a[href*="cdn.iqsaved.com"], .download-button').length > 0) || ((globalThis as any).document.querySelectorAll('.error, .alert').length > 0)
      },
      {
        name: 'igram.world',
        url: 'https://igram.world/ru',
        input: '#search-form-input',
        submit: '.search-form__button',
        waitCondition: () => ((globalThis as any).document.querySelectorAll('a[href*=".mp4"], a[download], .output-list a, .download-wrapper a').length > 0) || ((globalThis as any).document.querySelectorAll('.error-msg, .alert-danger, .msg-error').length > 0)
      },
      {
        name: 'fastdl.app',
        url: 'https://fastdl.app/ru',
        input: 'input[name="url"], input[type="text"]',
        submit: 'button[type="submit"], button.btn-primary',
        waitCondition: () => ((globalThis as any).document.querySelectorAll('a[href*=".mp4"], a[href*=".jpg"], a[download], .download-bottom a, .output-list a').length > 0) || ((globalThis as any).document.querySelectorAll('.error-msg, .alert-danger').length > 0)
      }
    ];

    for (const scraper of scrapers) {
      console.error(`[AIM] Пробуем скрапер: ${scraper.name}`);
      try {
        await page.goto(scraper.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const inputHandle = await page.$(scraper.input) || await page.$('input');
        if (inputHandle) {
          await inputHandle.type(url);
          await page.click(scraper.submit);

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await page.waitForFunction(scraper.waitCondition, { timeout: 20000 });

          const isError = await page.$('.error-msg, .alert-danger, .error, .alert');
          if (isError) {
            console.error(`[AIM] ${scraper.name} вернул ошибку, пробуем следующий...`);
            continue;
          }

          const mediaLinks: InstagramMedia[] = await page.evaluate(() => {
            const results: any[] = [];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const buttons = document.querySelectorAll('a[href*=".mp4"], a[href*=".jpg"], a[download], a.button, .download-bottom a, a.download-button, .output-list a');
            
            buttons.forEach((btn: any) => {
              let href = btn.getAttribute('href');
              const text = btn.textContent?.toLowerCase() || '';
              if (href && !href.includes('javascript:') && !href.includes('#')) {
                if (href.startsWith('//')) href = 'https:' + href;
                if (href.startsWith('/')) href = (globalThis as any).window.location.origin + href;
                
                if (href.startsWith('http') && (text.includes('download') || text.includes('скачать') || href.includes('.mp4') || href.includes('.jpg') || href.includes('cdn.'))) {
                   const isVid = text.includes('video') || text.includes('видео') || href.includes('.mp4');
                   if (!results.find(r => r.url === href)) {
                       results.push({ url: href, isVideo: isVid });
                   }
                }
              }
            });
            return results as any;
          }) as InstagramMedia[];

          if (mediaLinks.length > 0) {
             console.error(`[AIM] ${scraper.name} успешно извлек файлов: ${mediaLinks.length}`);
             return mediaLinks;
          }
        }
      } catch (e: any) {
         console.error(`[AIM] Ошибка в скрапере ${scraper.name}: ${e.message}`);
      }
    }

    return [];
  } catch (error: any) {
    console.error('[AIM] Puppeteer scraping failed:', error.message);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Главный фасад для парсинга инстаграма через сторонние сервисы с жестким анти-провалом
 */
export async function scrapeInstagramMedia(url: string): Promise<InstagramMedia[]> {
  const rapidApiKey = process.env.AIM_IG_API_KEY;
  let media: InstagramMedia[] = [];

  // [ШАГ 0] Premium Method (Если есть ключ)
  if (rapidApiKey) {
    try {
      console.error('[AIM] Использование RapidAPI для загрузки (Premium Method)...');
      media = await fetchViaRapidAPI(url, rapidApiKey);
      if (media && media.length > 0) return media;
      console.error('[AIM] RapidAPI вернул пустой массив, откат к IQSaved API...');
    } catch (e: any) {
      console.error('[AIM] RapidAPI упал:', e.message);
    }
  }

  // [ШАГ 1] ПРИОРИТЕТ 1: Запуск IQSaved API (Самый надежный для каруселей)
  try {
    console.error('[AIM] ПРИОРИТЕТ 1: Использование внутреннего IQSaved API...');
    media = await fetchViaIqsaved(url);
    if (media && media.length > 0) return media;
    console.error('[AIM] IQSaved API не вернул медиа, переходим к резервным вариантам...');
  } catch (e: any) {
    console.error('[AIM] Ошибка IQSaved API:', e.message);
  }

  // [ШАГ 2] ПРИОРИТЕТ 2: Cobalt (Быстрый fallback для видео)
  try {
    console.error('[AIM] ПРИОРИТЕТ 2: Пробуем открытые сервисы (Cobalt)...');
    media = await fetchViaCobalt(url);
    if (media && media.length > 0) return media;
    console.error('[AIM] Cobalt не вернул медиа, переходим к Puppeteer...');
  } catch (e: any) {
    console.error('[AIM] Ошибка Cobalt API:', e.message);
  }

  // [ШАГ 3] ПРИОРИТЕТ 3: Web Scraper (Puppeteer проходит через iqsaved/igram/fastdl)
  try {
    console.error('[AIM] ПРИОРИТЕТ 3: Запуск Web Scraper (эмуляция браузера)...');
    media = await fetchViaWebScraper(url);
    if (media && media.length > 0) return media;
    console.error('[AIM] Web Scraper не смог подобрать медиа.');
  } catch (e: any) {
    console.error('[AIM] Ошибка Web Scraper:', e.message);
  }

  // [ФИНАЛ] Анти-провал: если всё выше не дало результатов
  throw new Error('КРИТИЧЕСКАЯ ОШИБКА: Все сторонние сервисы и резервные варианты (IQSaved, Cobalt, Puppeteer) недоступны. Попробуйте другую ссылку.');
}
