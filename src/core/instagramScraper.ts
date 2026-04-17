import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { randomUUID } from 'crypto';

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
 * Главный фасад для парсинга инстаграма через сторонние сервисы
 */
export async function scrapeInstagramMedia(url: string): Promise<InstagramMedia[]> {
  const rapidApiKey = process.env.AIM_IG_API_KEY;

  if (rapidApiKey) {
    console.log('[AIM] Использование RapidAPI для загрузки (Premium Method)...');
    const media = await fetchViaRapidAPI(url, rapidApiKey);
    if (media.length > 0) return media;
    console.log('[AIM] RapidAPI не смог скачать, откат к Cobalt...');
  }

  console.log('[AIM] Использование открытых сервисов (Cobalt) для загрузки Instagram...');
  const media = await fetchViaCobalt(url);
  
  if (media.length > 0) return media;

  throw new Error('Все сторонние сервисы загрузки недоступны или ссылка не поддерживается. Попробуйте обновить ссылку или добавить AIM_IG_API_KEY.');
}
