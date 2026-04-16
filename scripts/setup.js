#!/usr/bin/env node
/**
 * AIM Instagram Suite — Full Setup Script
 * Проверяет и устанавливает все системные зависимости:
 * CMake, Node.js 18+, ffmpeg, yt-dlp, npm packages, Whisper model
 *
 * Запуск: node scripts/setup.js
 */

const { execSync, spawnSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
const isLinux = os.platform() === 'linux';

const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';

const ok   = (msg) => console.log(`${GREEN}  ✅ ${msg}${RESET}`);
const warn = (msg) => console.log(`${YELLOW}  ⚠️  ${msg}${RESET}`);
const fail = (msg) => console.log(`${RED}  ❌ ${msg}${RESET}`);
const info = (msg) => console.log(`${CYAN}  ℹ️  ${msg}${RESET}`);
const step = (msg) => console.log(`\n${CYAN}▶ ${msg}${RESET}`);

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', ...opts }).toString().trim();
  } catch {
    return null;
  }
}

function checkCommand(cmd) {
  return run(`${cmd} --version`) !== null
    || run(`where ${cmd}`) !== null
    || run(`which ${cmd}`) !== null;
}

function downloadFile(url, dest, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) return reject(new Error('Too many redirects'));
    https.get(url, { headers: { 'User-Agent': 'AIM-Suite-Installer/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(downloadFile(res.headers.location, dest, redirectCount + 1));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Checks
// ────────────────────────────────────────────────────────────────────────────

function checkNode() {
  step('Проверка Node.js...');
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  if (major >= 18) {
    ok(`Node.js ${version} — OK`);
    return true;
  } else {
    fail(`Node.js ${version} — нужна версия 18+. Скачай: https://nodejs.org`);
    return false;
  }
}

function checkCMake() {
  step('Проверка CMake (нужен для nodejs-whisper)...');
  if (checkCommand('cmake')) {
    const v = run('cmake --version')?.split('\n')[0] || 'ok';
    ok(`CMake — ${v}`);
    return true;
  }

  fail('CMake не найден. Устанавливаю автоматически...');

  try {
    if (isWindows) {
      // Try winget first
      const winget = run('winget --version');
      if (winget) {
        info('Устанавливаю CMake через winget...');
        execSync('winget install --id Kitware.CMake -e --silent --accept-package-agreements --accept-source-agreements', { stdio: 'inherit' });
      } else {
        // Try choco
        const choco = run('choco --version');
        if (choco) {
          info('Устанавливаю CMake через Chocolatey...');
          execSync('choco install cmake --installargs "ADD_CMAKE_TO_PATH=System" -y', { stdio: 'inherit' });
        } else {
          fail('Нет winget или choco. Скачай CMake вручную: https://cmake.org/download/');
          fail('Добавь cmake в PATH и запусти setup снова.');
          return false;
        }
      }
    } else if (isMac) {
      info('Устанавливаю CMake через Homebrew...');
      execSync('brew install cmake', { stdio: 'inherit' });
    } else if (isLinux) {
      info('Устанавливаю CMake через apt...');
      execSync('sudo apt-get update && sudo apt-get install -y cmake build-essential', { stdio: 'inherit' });
    }

    if (checkCommand('cmake')) {
      ok('CMake установлен успешно');
      return true;
    } else {
      warn('CMake установлен, но не в PATH. Перезапусти терминал и запусти setup снова.');
      return false;
    }
  } catch (err) {
    fail(`Не удалось установить CMake автоматически: ${err.message}`);
    fail('Скачай вручную: https://cmake.org/download/ и добавь в PATH');
    return false;
  }
}

function checkFFmpeg() {
  step('Проверка ffmpeg...');
  // ffmpeg-static bundled with npm — always works
  try {
    const ffmpegStatic = require('ffmpeg-static');
    if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
      ok(`ffmpeg-static bundled — ${ffmpegStatic}`);
      return true;
    }
  } catch {}

  if (checkCommand('ffmpeg')) {
    ok('ffmpeg найден в системе');
    return true;
  }

  warn('ffmpeg не найден локально (будет использован ffmpeg-static из npm)');
  return true; // ffmpeg-static handles it
}

function checkYtDlp() {
  step('Проверка yt-dlp...');
  const binDir = path.join(__dirname, '..', 'bin');
  const binaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
  const binaryPath = path.join(binDir, binaryName);

  if (fs.existsSync(binaryPath)) {
    ok(`yt-dlp найден: ${binaryPath}`);
    return Promise.resolve(true);
  }

  if (checkCommand('yt-dlp')) {
    ok('yt-dlp найден в системе PATH');
    return Promise.resolve(true);
  }

  info('Скачиваю yt-dlp...');
  const url = isWindows
    ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
    : isMac
      ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos'
      : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

  if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });

  return downloadFile(url, binaryPath)
    .then(() => {
      if (!isWindows) fs.chmodSync(binaryPath, 0o755);
      ok(`yt-dlp скачан: ${binaryPath}`);
      return true;
    })
    .catch((err) => {
      warn(`Не удалось скачать yt-dlp: ${err.message}`);
      info('Скачай вручную: https://github.com/yt-dlp/yt-dlp/releases');
      return false;
    });
}

function checkBuildTools() {
  step('Проверка инструментов сборки (для nodejs-whisper)...');

  if (isWindows) {
    const vsWhere = run('where vswhere') || run('"C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath');
    const msbuild = checkCommand('msbuild');
    const clang = checkCommand('clang');

    if (vsWhere || msbuild || clang) {
      ok('Visual Studio Build Tools найдены');
      return true;
    }

    warn('Visual Studio Build Tools не найдены.');
    info('Устанавливаю через winget...');
    try {
      execSync('winget install --id Microsoft.VisualStudio.2022.BuildTools -e --silent --accept-package-agreements --accept-source-agreements --override "--quiet --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"', { stdio: 'inherit' });
      ok('Visual Studio Build Tools установлены');
      return true;
    } catch {
      warn('Установи вручную: https://visualstudio.microsoft.com/visual-cpp-build-tools/');
      warn('Выбери "Desktop development with C++" при установке');
      return false;
    }
  }

  if (isMac) {
    if (run('xcode-select -p')) {
      ok('Xcode Command Line Tools найдены');
      return true;
    }
    info('Устанавливаю Xcode Command Line Tools...');
    try {
      execSync('xcode-select --install', { stdio: 'inherit' });
      ok('Xcode CLT установлены');
    } catch {
      warn('Запусти: xcode-select --install');
    }
    return true;
  }

  if (isLinux) {
    if (checkCommand('gcc') && checkCommand('make')) {
      ok('GCC и Make найдены');
      return true;
    }
    info('Устанавливаю build-essential...');
    try {
      execSync('sudo apt-get install -y build-essential', { stdio: 'inherit' });
      ok('build-essential установлен');
    } catch {
      warn('Запусти: sudo apt-get install -y build-essential');
    }
    return true;
  }

  return true;
}

async function runNpmInstall() {
  step('Установка npm-зависимостей...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    ok('npm install завершён');
    return true;
  } catch (err) {
    fail(`npm install завершился с ошибкой: ${err.message}`);
    return false;
  }
}

function checkWhisperModel() {
  step('Проверка Whisper модели...');
  // nodejs-whisper downloads model on first use
  const whisperDir = path.join(os.homedir(), '.cache', 'whisper');
  const altDir = path.join(__dirname, '..', 'node_modules', 'nodejs-whisper', 'models');

  if (
    (fs.existsSync(whisperDir) && fs.readdirSync(whisperDir).length > 0) ||
    (fs.existsSync(altDir) && fs.readdirSync(altDir).some(f => f.endsWith('.bin')))
  ) {
    ok('Whisper модель уже скачана');
  } else {
    info('Whisper модель (~150MB) будет скачана автоматически при первом использовании aim_evaluate_video');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${CYAN}╔══════════════════════════════════════════════╗`);
  console.log(`║  🎯 AIM Instagram Suite — Setup v1.2.0       ║`);
  console.log(`║  Проверка и установка всех зависимостей      ║`);
  console.log(`╚══════════════════════════════════════════════╝${RESET}\n`);

  const nodeOk = checkNode();
  if (!nodeOk) {
    fail('\nНужна Node.js 18+. Установи с https://nodejs.org и запусти снова.');
    process.exit(1);
  }

  const cmakeOk = checkCMake();
  const buildOk = checkBuildTools();

  if (!cmakeOk || !buildOk) {
    console.log(`\n${YELLOW}⚠️  Системные зависимости не установлены.`);
    console.log('   Установи CMake и Build Tools, перезапусти терминал,');
    console.log(`   затем запусти: node scripts/setup.js снова.${RESET}`);
    process.exit(1);
  }

  checkFFmpeg();
  const npmOk = await runNpmInstall();
  if (!npmOk) process.exit(1);

  await checkYtDlp();
  checkWhisperModel();

  console.log(`\n${GREEN}╔══════════════════════════════════════════════╗`);
  console.log(`║  ✅ Установка завершена успешно!              ║`);
  console.log(`║                                              ║`);
  console.log(`║  Следующий шаг — зарегистрировать MCP:       ║`);
  console.log(`║                                              ║`);
  console.log(`║  Claude Code CLI:                            ║`);
  console.log(`║  claude mcp add aim-instagram-suite --        ║`);
  console.log(`║    npx tsx "$(pwd)/src/index.ts"             ║`);
  console.log(`║                                              ║`);
  console.log(`║  Claude Desktop — см. INSTALL.md             ║`);
  console.log(`╚══════════════════════════════════════════════╝${RESET}\n`);
}

main().catch((err) => {
  fail(`Критическая ошибка: ${err.message}`);
  process.exit(1);
});
