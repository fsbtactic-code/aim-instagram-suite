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
 * Извлечение через Puppeteer используя сторонние сервисы (например, snapinsta)
 */
async function fetchViaPuppeteer(url: string): Promise<InstagramMedia[]> {
  console.error('[AIM] Запускаем Puppeteer для скачивания через snapinsta...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
  });
  
  try {
    const page = await browser.newPage();
    
    // Блокируем лишние ресурсы для ускорения загрузки
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(type) && !req.url().includes('fastdl')) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto('https://fastdl.app/ru', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Вводим URL
    await page.waitForSelector('input', { timeout: 10000 });
    // Обычно поле ввода на таких сайтах самое большое или имеет type=text / name=url / id=search
    // Для безопасности ищем input[name="url"] или первый input type text
    const inputHandle = await page.$('input[name="url"]') || await page.$('input[type="text"]');
    if (inputHandle) {
        await inputHandle.type(url);
    } else {
        await page.type('input', url);
    }
    
    // Кликаем Download
    await page.click('button[type="submit"], button.btn-primary');
    
    // Ждем результатов 
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — runs in browser context where document is available
    await page.waitForFunction(() => {
      // @ts-ignore
      return document.querySelectorAll('a[href*=".mp4"], a[href*=".jpg"], a[download], .download-bottom a, .output-list a').length > 0 || document.querySelectorAll('.error-msg, .alert-danger').length > 0;
    }, { timeout: 20000 });

    
    const isError = await page.$('.error-msg, .alert-danger, .msg-error');
    if (isError) {
      console.error('[AIM] Ошибка на стороне загрузчика (приватный аккаунт или лимиты)');
      return [];
    }

    // Собираем ссылки на мультимедиа
    const mediaLinks: InstagramMedia[] = await page.evaluate(() => {
      const results: any[] = [];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore — runs in browser context where document is available
      const downloadButtons = document.querySelectorAll('a[href*=".mp4"], a[href*=".jpg"], a[download], a.button, .download-bottom a');
      
      downloadButtons.forEach((btn: any) => {
        let href = btn.getAttribute('href');
        const text = btn.textContent?.toLowerCase() || '';
        if (href && !href.includes('javascript:')) {
          if (href.startsWith('//')) href = 'https:' + href;
          
          if (href.startsWith('http') && (text.includes('download') || text.includes('скачать') || href.includes('force-download') || href.includes('.mp4') || href.includes('.jpg'))) {
             const isVid = text.includes('video') || text.includes('видео') || href.includes('.mp4');
             // Избегаем дубликатов (иногда одна и та же ссылка на разных кнопках)
             if (!results.find(r => r.url === href)) {
                 results.push({ url: href, isVideo: isVid });
             }
          }
        }
      });
      return results as any;
    }) as InstagramMedia[];


    console.error(`[AIM] Puppeteer (snapinsta) успешно извлек файлов: ${mediaLinks.length}`);
    return mediaLinks;
  } catch (error: any) {
    console.error('[AIM] Puppeteer scraping failed:', error.message);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Главный фасад для парсинга инстаграма через сторонние сервисы
 */
export async function scrapeInstagramMedia(url: string): Promise<InstagramMedia[]> {
  const rapidApiKey = process.env.AIM_IG_API_KEY;

  if (rapidApiKey) {
    console.error('[AIM] Использование RapidAPI для загрузки (Premium Method)...');
    const media = await fetchViaRapidAPI(url, rapidApiKey);
    if (media.length > 0) return media;
    console.error('[AIM] RapidAPI не смог скачать, откат к Cobalt...');
  }

  console.error('[AIM] Использование IQSaved API для загрузки карусели...');
  let media = await fetchViaIqsaved(url);
  
  if (media.length > 0) return media;

  console.error('[AIM] IQSaved не справился. Пробуем открытые сервисы (Cobalt)...');
  media = await fetchViaCobalt(url);
  
  if (media.length > 0) return media;

  console.error('[AIM] Cobalt не справился. Пробуем Web Scraper через Puppeteer (snapinsta)...');
  media = await fetchViaPuppeteer(url);
  
  if (media.length > 0) return media;

  throw new Error('Все сторонние сервисы загрузки недоступны или ссылка не поддерживается. Попробуйте обновить ссылку или добавить AIM_IG_API_KEY.');
}
