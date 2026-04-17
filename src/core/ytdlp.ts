/**
 * AIM VideoLens — Core: yt-dlp wrapper
 * Скачивание видео с YouTube, Instagram, TikTok через локальный yt-dlp бинарник.
 * Прямой вызов бинарника без deprecated npm-обёрток.
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const execFileAsync = promisify(execFile);

// Путь к бинарнику yt-dlp скачанному postinstall-скриптом
const BIN_DIR = path.join(__dirname, '..', '..', 'bin');
const isWindows = os.platform() === 'win32';
const YTDLP_BINARY = path.join(BIN_DIR, isWindows ? 'yt-dlp.exe' : 'yt-dlp');

// Fallback: yt-dlp из PATH если нет в bin/
function getYtDlpBin(): string {
  if (fs.existsSync(YTDLP_BINARY)) return YTDLP_BINARY;
  return isWindows ? 'yt-dlp.exe' : 'yt-dlp';
}

export interface DownloadResult {
  filePath: string;
  title: string;
  duration: number;  // seconds
  platform: string;
}

/**
 * Скачивает видео по URL во временную директорию.
 * @param url — ссылка на YouTube/Instagram/TikTok/VK
 * @param outDir — куда сохранять (по умолчанию os.tmpdir())
 * @returns путь к скачанному файлу
 */
export async function downloadVideo(url: string, outDir?: string): Promise<DownloadResult> {
  const bin = getYtDlpBin();
  const targetDir = outDir ?? path.join(os.tmpdir(), 'aim_dl');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outputTemplate = path.join(targetDir, '%(id)s.%(ext)s');
  const platform = detectPlatform(url);

  // Получаем метаданные (JSON)
  let title = 'video';
  let duration = 0;

  // -- ИНТЕГРАЦИЯ НОВОГО SCRAPER'A ДЛЯ INSTAGRAM --
  if (platform === 'Instagram') {
    console.error('[AIM] Instagram detected, delegating to external scraping APIs...');
    try {
      // Lazy load to avoid circular deps if any
      const { scrapeInstagramMedia, downloadFileFast } = require('./instagramScraper.js');
      const mediaList = await scrapeInstagramMedia(url);
      
      if (mediaList.length > 0) {
        let videoFile = '';
        // Для обычного скачивания Reels берем первое видео
        for (const item of mediaList) {
           const ext = item.isVideo ? 'mp4' : 'jpg';
           videoFile = await downloadFileFast(item.url, targetDir, ext);
           break; // Только первое (для analyzeCarousel вызывается напрямую scraper)
        }
        // Примечание: Cobalt может вернуть video-only поток (VP9 DASH без аудио).
        // В этом случае ffmpeg.extractAudio создаст тихий WAV, и анализ продолжится
        // только визуально (без транскрипта). Для аудио установите AIM_IG_API_KEY.
        return {
          filePath: videoFile,
          title: 'Instagram Reel',
          duration: 0,
          platform
        };
      }
    } catch (e: any) {
      console.error('[AIM] External API failed, falling back to local yt-dlp:', e.message);
    }
  }

  try {
    const { stdout } = await execFileAsync(bin, [
      '--dump-json',
      '--no-playlist',
      url,
    ], { maxBuffer: 5 * 1024 * 1024 });
    const meta = JSON.parse(stdout.trim().split('\n')[0]);
    title = meta.title ?? 'video';
    duration = meta.duration ?? 0;
  } catch {
    // метаданные необязательны
  }

  // Скачивание: предпочитаем mp4, max 1080p
  await execFileAsync(bin, [
    url,
    '-o', outputTemplate,
    '--format', 'bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    '--merge-output-format', 'mp4',
    '--no-playlist',
    '--quiet',
  ], { maxBuffer: 10 * 1024 * 1024 });

  // Найти самый свежий скачанный файл
  const files = fs.readdirSync(targetDir)
    .map(f => ({ name: f, time: fs.statSync(path.join(targetDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time)
    .map(f => f.name);

  const videoFile = files.find(f => f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.mkv'));
  if (!videoFile) {
    throw new Error(`yt-dlp: видео не скачано в ${targetDir}`);
  }

  return {
    filePath: path.join(targetDir, videoFile),
    title,
    duration,
    platform,
  };
}

/**
 * Определяет платформу по URL
 */
export function detectPlatform(url: string): string {
  if (/instagram\.com/i.test(url)) return 'Instagram';
  if (/tiktok\.com/i.test(url)) return 'TikTok';
  if (/youtube\.com|youtu\.be/i.test(url)) return 'YouTube';
  if (/vk\.com/i.test(url)) return 'VKontakte';
  if (/twitter\.com|x\.com/i.test(url)) return 'Twitter/X';
  return 'Unknown';
}

/**
 * Проверяет, является ли строка URL-ом
 */
export function isUrl(input: string): boolean {
  return /^https?:\/\//i.test(input);
}
