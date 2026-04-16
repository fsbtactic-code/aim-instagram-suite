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

/**
 * Ищет nmake.exe и cmake.exe в папках Visual Studio
 * и добавляет их в process.env.PATH автоматически.
 * Возвращает { nmake, cmake } — пути к директориям.
 */
function findAndPatchPath() {
  const found = { nmake: null, cmake: null };
  if (!isWindows) return found;

  // Корневые папки поиска (все возможные установки VS)
  const vsRoots = [
    'C:\\Program Files (x86)\\Microsoft Visual Studio',
    'C:\\Program Files\\Microsoft Visual Studio',
  ];

  const years   = ['2022', '2019', '2017'];
  const editions = ['BuildTools', 'Community', 'Professional', 'Enterprise', 'Preview'];

  // 1. Ищем nmake.exe — лежит в MSVC/{version}/bin/Hostx64/x64/
  for (const root of vsRoots) {
    for (const year of years) {
      for (const ed of editions) {
        const msvcBase = path.join(root, year, ed, 'VC', 'Tools', 'MSVC');
        if (!fs.existsSync(msvcBase)) continue;

        // Берём последнюю (наибольшую) версию MSVC
        const versions = fs.readdirSync(msvcBase)
          .filter(v => /^\d+\.\d+/.test(v))
          .sort()
          .reverse();

        for (const ver of versions) {
          const binDir = path.join(msvcBase, ver, 'bin', 'Hostx64', 'x64');
          if (fs.existsSync(path.join(binDir, 'nmake.exe'))) {
            found.nmake = binDir;
            info(`nmake.exe найден: ${binDir}`);
            break;
          }
          // Fallback: x86
          const binDir86 = path.join(msvcBase, ver, 'bin', 'Hostx86', 'x86');
          if (fs.existsSync(path.join(binDir86, 'nmake.exe'))) {
            found.nmake = binDir86;
            info(`nmake.exe найден (x86): ${binDir86}`);
            break;
          }
        }
        if (found.nmake) break;
      }
      if (found.nmake) break;

      // 2. Ищем cmake из VS CMake component
      for (const ed of editions) {
        const cmakeDir = path.join(
          vsRoots[0], year, ed,
          'Common7', 'IDE', 'CommonExtensions', 'Microsoft', 'CMake', 'CMake', 'bin'
        );
        if (fs.existsSync(path.join(cmakeDir, 'cmake.exe'))) {
          found.cmake = cmakeDir;
          info(`cmake.exe найден (VS component): ${cmakeDir}`);
          break;
        }
      }
    }
    if (found.nmake) break;
  }

  // 3. Ищем cmake через Program Files напрямую
  if (!found.cmake) {
    const cmakeDirect = [
      'C:\\Program Files\\CMake\\bin',
      'C:\\Program Files (x86)\\CMake\\bin',
    ];
    for (const p of cmakeDirect) {
      if (fs.existsSync(path.join(p, 'cmake.exe'))) {
        found.cmake = p;
        info(`cmake.exe найден: ${p}`);
        break;
      }
    }
  }

  // 4. Патчим PATH в текущем процессе
  const additions = [found.nmake, found.cmake].filter(Boolean);
  if (additions.length > 0) {
    process.env.PATH = additions.join(path.delimiter) + path.delimiter + (process.env.PATH || '');
    ok(`PATH обновлён: добавлено ${additions.length} директорий`);
    additions.forEach(p => info(`  + ${p}`));
  }

  return found;
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
  step('Шаг 2/5 — Проверка и настройка C++ Build Tools (нужны для nodejs-whisper)...');

  if (isWindows) {
    // Сначала пробуем найти и пропатчить PATH автоматически
    const found = findAndPatchPath();

    // Проверяем nmake уже в PATH (или только что добавленный)
    const nmakeOk = run('nmake /?' ) !== null || found.nmake !== null;
    const cmakeOk = run('cmake --version') !== null || found.cmake !== null;

    if (nmakeOk && cmakeOk) {
      ok('nmake + cmake — доступны (PATH настроен)');
      return true;
    }

    if (nmakeOk && !cmakeOk) {
      warn('nmake найден, cmake не найден — установлю через winget...');
      try {
        execSync('winget install Kitware.CMake --accept-package-agreements --accept-source-agreements', { stdio: 'inherit', timeout: 120000 });
        ok('CMake установлен');
      } catch {
        warn('Не удалось установить CMake. Установи вручную: https://cmake.org/download/');
      }
      return true; // nmake есть — npm install пройдёт
    }

    // nmake не найден — Build Tools не установлены
    fail('nmake не найден — Visual Studio Build Tools (C++) не установлены');

    console.log(`
${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📦 НУЖНА УСТАНОВКА: Visual Studio Build Tools (C++)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

  Запусти в ${BOLD}PowerShell от Администратора${RESET}:

  ${CYAN}winget install Microsoft.VisualStudio.2022.BuildTools \\
    --override "--quiet \\
      --add Microsoft.VisualStudio.Workload.VCTools \\
      --add Microsoft.VisualStudio.Component.VC.CMake.Project \\
      --includeRecommended" \\
    --accept-package-agreements --accept-source-agreements${RESET}

  После установки — ${BOLD}перезапусти PowerShell${RESET} и запусти:
  ${CYAN}node scripts/setup.js${RESET}

  ${YELLOW}Или скачай GUI-установщик:${RESET}
  https://aka.ms/vs/17/release/vs_BuildTools.exe
  → Выбери: "Разработка классических приложений C++"
${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
`);

    // Пробуем авто-установку через winget
    const winget = run('winget --version');
    if (winget) {
      info('Запускаю автоустановку через winget (5-15 минут)...');
      try {
        execSync(
          'winget install Microsoft.VisualStudio.2022.BuildTools ' +
          '--override "--quiet --add Microsoft.VisualStudio.Workload.VCTools ' +
          '--add Microsoft.VisualStudio.Component.VC.CMake.Project --includeRecommended" ' +
          '--accept-package-agreements --accept-source-agreements',
          { stdio: 'inherit', timeout: 900000 }
        );
        warn('✅ Build Tools установлены. Перезапусти PowerShell и запусти setup снова!');
      } catch (e) {
        fail(`Автоустановка не завершилась: ${e.message}`);
      }
    }

    return false;
  }

  if (isMac) {
    const hasXcode = run('xcode-select -p');
    const hasCmake = run('cmake --version');
    if (hasXcode && hasCmake) { ok('Xcode CLT + CMake — OK'); return true; }
    if (!hasXcode) { info('Установка Xcode CLT...'); try { execSync('xcode-select --install', { stdio: 'inherit' }); } catch {} }
    if (!hasCmake) { info('Установка CMake...'); try { execSync('brew install cmake', { stdio: 'inherit' }); } catch { warn('brew install cmake — запусти вручную'); } }
    ok('macOS build tools настроены');
    return true;
  }

  if (isLinux) {
    const ok2 = run('which gcc') && run('which make') && run('which cmake');
    if (ok2) { ok('GCC + Make + CMake — OK'); return true; }
    info('Установка build-essential + cmake...');
    try { execSync('sudo apt-get update -qq && sudo apt-get install -y build-essential cmake', { stdio: 'inherit' }); ok('Готово'); }
    catch { warn('sudo apt-get install -y build-essential cmake — запусти вручную'); }
    return true;
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
