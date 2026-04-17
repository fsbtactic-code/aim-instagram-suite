import * as path from 'path';
import * as fs from 'fs';
import { downloadVideo } from './src/core/ytdlp.js';
import { extractFramesAdaptive } from './src/core/imageGrid.js';
import { promisify } from 'util';
import { execFile } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const execFileAsync = promisify(execFile);

async function main() {
  const url = 'https://www.instagram.com/reel/DVEZN4TkeZ3/';
  const targetDir = 'C:\\Users\\Alina\\Desktop\\Reels_Test_Frames';
  
  console.log('1. Запуск загрузки видео из Instagram...');
  const videoPath = await downloadVideo(url, targetDir);
  console.log(`✅ Видео успешно скачано: ${videoPath}`);

  console.log('2. Извлечение адаптивных ключевых кадров (как в evaluate_video)...');
  const tmpFramesDir = path.join(targetDir, 'raw_frames');
  if (!fs.existsSync(tmpFramesDir)) fs.mkdirSync(tmpFramesDir);
  
  // Просто извлечем 1 кадр в секунду, чтобы показать как работает вытаскивание
  console.log('Вытаскиваем кадры (1 fps)...');
  await execFileAsync(ffmpegPath as string, [
      '-i', videoPath,
      '-vf', 'fps=1',
      path.join(tmpFramesDir, 'frame_%03d.jpg')
  ]);
  
  console.log('3. Прогон умного алгоритма Adaptive Scene Detection...');
  const adaptiveFrames = await extractFramesAdaptive(videoPath, 9);
  
  // Сохраняем адаптивные кадры
  const adaptiveDir = path.join(targetDir, 'adaptive_frames');
  if (!fs.existsSync(adaptiveDir)) fs.mkdirSync(adaptiveDir);
  
  for (let i=0; i<adaptiveFrames.length; i++) {
    fs.copyFileSync(adaptiveFrames[i], path.join(adaptiveDir, `adaptive_${String(i+1).padStart(2, '0')}.jpg`));
  }
  
  console.log(`✅ Кадры вытащены в папку: ${targetDir}`);
}

main().catch(e => {
  console.error('Ошибка в процессе:', e);
});
