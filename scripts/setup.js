#!/usr/bin/env node
/**
 * AIM Instagram Suite — Full Setup Script v2.0
 * Проверяет и устанавливает все системные зависимости:
 *   Node.js 18+, Visual Studio Build Tools (C++), CMake, yt-dlp, npm packages
 *
 * Запуск: node scripts/setup.js
 */

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const isMac     = os.platform() === 'darwin';
const isLinux   = os.platform() === 'linux';

const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';
const RESET  = '\x1b[0m';

const ok   = (msg) => console.log(`${GREEN}  ✅ ${msg}${RESET}`);
const warn = (msg) => console.log(`${YELLOW}  ⚠️  ${msg}${RESET}`);
const fail = (msg) => console.log(`${RED}  ❌ ${msg}${RESET}`);
const info = (msg) => console.log(`${CYAN}  ℹ️  ${msg}${RESET}`);
const step = (msg) => console.log(`\n${BOLD}${CYAN}▶ ${msg}${RESET}`);
const box  = (lines) => {
  const width = 52;
  console.log(`\n${CYAN}╔${'═'.repeat(width)}╗`);
  lines.forEach(l => console.log(`║  ${l.padEnd(width - 2)}║`));
  console.log(`╚${'═'.repeat(width)}╝${RESET}\n`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function run(cmd) {
  try { return execSync(cmd, { stdio: 'pipe', timeout: 10000 }).toString().trim(); }
  catch { return null; }
}

function fileExists(...parts) {
  return fs.existsSync(path.join(...parts));
}

function downloadFile(url, dest, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) return reject(new Error('Too many redirects'));
    https.get(url, { headers: { 'User-Agent': 'AIM-Suite-Installer/2.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302)
        return resolve(downloadFile(res.headers.location, dest, redirectCount + 1));
      if (res.statusCode !== 200)
        return reject(new Error(`HTTP ${res.statusCode}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Node.js
// ─────────────────────────────────────────────────────────────────────────────

function checkNode() {
  step('Шаг 1/5 — Проверка Node.js...');
  const major = parseInt(process.version.slice(1));
  if (major >= 18) { ok(`Node.js ${process.version}`); return true; }
  fail(`Node.js ${process.version} — нужна версия 18+`);
  info('Скачай: https://nodejs.org');
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Visual Studio Build Tools + CMake (Windows) / Xcode (Mac) / GCC (Linux)
// ─────────────────────────────────────────────────────────────────────────────

function detectWindowsBuildTools() {
  // 1. Проверяем nmake напрямую
  if (run('where nmake')) return 'nmake in PATH';

  // 2. Ищем через vswhere
  const vsWherePaths = [
    'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe',
    'C:\\Program Files\\Microsoft Visual Studio\\Installer\\vswhere.exe',
  ];
  for (const p of vsWherePaths) {
    if (fileExists(p)) {
      const result = run(`"${p}" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`);
      if (result) return `VS at ${result}`;
    }
  }

  // 3. Ищем nmake в стандартных путях VS Build Tools
  const nmakePaths = [
    'C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\BuildTools\\VC\\Tools\\MSVC',
    'C:\\Program Files\\Microsoft Visual Studio\\2022\\BuildTools\\VC\\Tools\\MSVC',
    'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\VC\\Tools\\MSVC',
  ];
  for (const p of nmakePaths) {
    if (fileExists(p)) return `Found at ${p}`;
  }

  return null;
}

function detectCMake() {
  if (run('cmake --version')) return true;
  // Check common install paths on Windows
  const paths = [
    'C:\\Program Files\\CMake\\bin\\cmake.exe',
    'C:\\Program Files (x86)\\CMake\\bin\\cmake.exe',
  ];
  return paths.some(p => fileExists(p));
}

function checkBuildDeps() {
  step('Шаг 2/5 — Проверка инструментов сборки C++ (нужны для nodejs-whisper)...');

  if (isWindows) {
    const btFound = detectWindowsBuildTools();
    const cmFound = detectCMake();

    if (btFound && cmFound) {
      ok(`Visual Studio Build Tools + CMake — найдены`);
      return true;
    }

    // Показываем что именно нужно
    if (!btFound) warn('Visual Studio Build Tools (С++) не найдены — nmake отсутствует');
    if (!cmFound) warn('CMake не найден');

    console.log(`
${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📦 ТРЕБУЕТСЯ РУЧНАЯ УСТАНОВКА (один раз, ~5 минут)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

  Запусти ${BOLD}в PowerShell от имени Администратора${RESET}:

  ${CYAN}# 1. Visual Studio Build Tools с C++:${RESET}
  winget install Microsoft.VisualStudio.2022.BuildTools ^
    --override "--quiet --add Microsoft.VisualStudio.Workload.VCTools ^
    --add Microsoft.VisualStudio.Component.VC.CMake.Project ^
    --includeRecommended" ^
    --accept-package-agreements --accept-source-agreements

  ${CYAN}# 2. После установки — перезапусти PowerShell и запусти снова:${RESET}
  node scripts/setup.js

  ${YELLOW}━━━ Или скачай вручную (GUI) ━━━${RESET}
  https://aka.ms/vs/17/release/vs_BuildTools.exe
  → Выбери: "Разработка классических приложений C++"
${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
`);

    // Пробуем поставить автоматически
    const winget = run('winget --version');
    if (winget) {
      info('Пробую автоматическую установку через winget (займёт 3-10 минут)...');
      try {
        if (!btFound) {
          execSync(
            'winget install Microsoft.VisualStudio.2022.BuildTools ' +
            '--override "--quiet --add Microsoft.VisualStudio.Workload.VCTools ' +
            '--add Microsoft.VisualStudio.Component.VC.CMake.Project --includeRecommended" ' +
            '--accept-package-agreements --accept-source-agreements',
            { stdio: 'inherit', timeout: 600000 }
          );
        }
        if (!cmFound) {
          execSync(
            'winget install Kitware.CMake --accept-package-agreements --accept-source-agreements',
            { stdio: 'inherit', timeout: 120000 }
          );
        }
        warn('✅ Установка запущена. ВАЖНО: Перезапусти терминал и запусти setup снова!');
        warn('   После перезапуска PATH обновится и сборка пройдёт успешно.');
      } catch (e) {
        fail(`Автоустановка не завершилась: ${e.message}`);
        fail('Установи вручную по инструкции выше.');
      }
    }

    return false; // Требуем перезапуск терминала
  }

  if (isMac) {
    if (run('xcode-select -p') && run('cmake --version')) {
      ok('Xcode CLT + CMake — OK');
      return true;
    }
    info('Устанавливаю Xcode CLT и CMake...');
    try {
      if (!run('xcode-select -p')) execSync('xcode-select --install', { stdio: 'inherit' });
      if (!run('cmake --version')) execSync('brew install cmake', { stdio: 'inherit' });
      ok('Готово');
      return true;
    } catch {
      warn('Запусти: xcode-select --install && brew install cmake');
      return false;
    }
  }

  if (isLinux) {
    const hasGcc  = run('which gcc');
    const hasMake = run('which make');
    const hasCmk  = run('which cmake');
    if (hasGcc && hasMake && hasCmk) { ok('GCC + Make + CMake — OK'); return true; }
    info('Устанавливаю build-essential + cmake...');
    try {
      execSync('sudo apt-get update -qq && sudo apt-get install -y build-essential cmake', { stdio: 'inherit' });
      ok('Готово');
      return true;
    } catch {
      warn('Запусти: sudo apt-get install -y build-essential cmake');
      return false;
    }
  }

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. npm install
// ─────────────────────────────────────────────────────────────────────────────

async function runNpmInstall() {
  step('Шаг 3/5 — Установка npm-зависимостей...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    ok('npm install завершён');
    return true;
  } catch (err) {
    fail(`npm install завершился с ошибкой`);

    if (isWindows && err.message?.includes('nmake')) {
      console.log(`\n${RED}  ❌ ПРИЧИНА: nmake не найден — нужны Visual Studio Build Tools (C++)${RESET}`);
      console.log(`${YELLOW}  → Установи Build Tools (инструкция выше в шаге 2) и запусти setup снова.${RESET}\n`);
    }

    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. yt-dlp
// ─────────────────────────────────────────────────────────────────────────────

async function checkYtDlp() {
  step('Шаг 4/5 — Проверка yt-dlp...');
  const binDir = path.join(__dirname, '..', 'bin');
  const binaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
  const binaryPath = path.join(binDir, binaryName);

  if (fileExists(binaryPath)) { ok(`yt-dlp: ${binaryPath}`); return; }
  if (run('yt-dlp --version')) { ok('yt-dlp найден в PATH'); return; }

  info('Скачиваю yt-dlp...');
  const url = isWindows
    ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
    : isMac
      ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos'
      : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

  if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });
  try {
    await downloadFile(url, binaryPath);
    if (!isWindows) fs.chmodSync(binaryPath, 0o755);
    ok(`yt-dlp скачан: ${binaryPath}`);
  } catch (e) {
    warn(`Не удалось скачать yt-dlp: ${e.message}`);
    info('Скачай вручную: https://github.com/yt-dlp/yt-dlp/releases');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Whisper model check
// ─────────────────────────────────────────────────────────────────────────────

function checkWhisper() {
  step('Шаг 5/5 — Проверка Whisper...');
  const modelsDir = path.join(__dirname, '..', 'node_modules', 'nodejs-whisper', 'models');
  const cacheDir  = path.join(os.homedir(), '.cache', 'whisper');

  const hasModel =
    (fs.existsSync(modelsDir) && fs.readdirSync(modelsDir).some(f => f.endsWith('.bin'))) ||
    (fs.existsSync(cacheDir)  && fs.readdirSync(cacheDir).some(f  => f.endsWith('.bin')));

  if (hasModel) ok('Whisper модель уже скачана');
  else info('Модель Whisper (~150MB) скачается автоматически при первом вызове aim_evaluate_video');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  box([
    '🎯 AIM Instagram Suite — Setup v2.0',
    'Проверка и установка всех зависимостей',
  ]);

  // 1. Node.js
  if (!checkNode()) process.exit(1);

  // 2. Build Tools + CMake
  const buildOk = checkBuildDeps();
  if (!buildOk) {
    console.log(`${YELLOW}\n  ⚠️  Перезапусти терминал после установки Build Tools`);
    console.log(`      и запусти: node scripts/setup.js снова.${RESET}\n`);
    process.exit(1);
  }

  // 3. npm install
  const npmOk = await runNpmInstall();
  if (!npmOk) process.exit(1);

  // 4. yt-dlp
  await checkYtDlp();

  // 5. Whisper
  checkWhisper();

  // Done!
  const cwd = process.cwd().replace(/\\/g, '/');
  box([
    '✅ Установка завершена успешно!',
    '',
    'Следующий шаг — зарегистрировать MCP:',
    '',
    'Claude Code CLI:',
    `claude mcp add aim-instagram-suite --`,
    `  npx tsx "${cwd}/src/index.ts"`,
    '',
    'Claude Desktop — см. INSTALL.md',
  ]);
}

main().catch((err) => {
  fail(`Критическая ошибка: ${err.message}`);
  process.exit(1);
});
