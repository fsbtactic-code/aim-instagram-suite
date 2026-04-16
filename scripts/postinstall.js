#!/usr/bin/env node
/**
 * AIM VideoLens — postinstall script
 * Автоматически скачивает бинарник yt-dlp под текущую платформу.
 * Запускается один раз после `npm install`.
 */

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const YTDLP_DIR = path.join(__dirname, '..', 'bin');
const isWindows = os.platform() === 'win32';
const binaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
const binaryPath = path.join(YTDLP_DIR, binaryName);

const DOWNLOAD_URL = isWindows
  ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
  : os.platform() === 'darwin'
    ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos'
    : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

function downloadFile(url, dest, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) return reject(new Error('Too many redirects'));

    https.get(url, { headers: { 'User-Agent': 'AIM-VideoLens-Installer/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(downloadFile(res.headers.location, dest, redirectCount + 1));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  // Skip if already downloaded
  if (fs.existsSync(binaryPath)) {
    console.log('[AIM] yt-dlp уже скачан:', binaryPath);
    return;
  }

  if (!fs.existsSync(YTDLP_DIR)) {
    fs.mkdirSync(YTDLP_DIR, { recursive: true });
  }

  console.log('[AIM] Скачиваем yt-dlp...');
  try {
    await downloadFile(DOWNLOAD_URL, binaryPath);
    // Make executable on Unix
    if (!isWindows) {
      fs.chmodSync(binaryPath, 0o755);
    }
    console.log('[AIM] ✅ yt-dlp успешно установлен:', binaryPath);
  } catch (err) {
    console.warn('[AIM] ⚠️  Не удалось скачать yt-dlp автоматически:', err.message);
    console.warn('[AIM]    Установите вручную: https://github.com/yt-dlp/yt-dlp/releases');
  }

  // nodejs-whisper needs model download — remind user
  console.log('\n[AIM] 📦 nodejs-whisper установлен. Модель Whisper будет скачана');
  console.log('[AIM]    автоматически при первом использовании (~150MB, base модель).\n');
}

main().catch(console.error);
