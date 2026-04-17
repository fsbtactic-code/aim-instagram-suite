#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const isWindows = os.platform() === 'win32';

function run(cmd) {
  try { return execSync(cmd, { stdio: 'pipe', timeout: 15000, shell: isWindows }).toString().trim(); }
  catch { return null; }
}

function findAndPatchPath() {
  const found = { nmake: null, cmake: null, git: null, ffmpeg: null };
  if (!isWindows) return found;

  const vsRoots = [
    'C:\\Program Files (x86)\\Microsoft Visual Studio',
    'C:\\Program Files\\Microsoft Visual Studio',
  ];
  const years = ['2022', '2019'];
  const editions = ['BuildTools', 'Community', 'Professional'];

  for (const root of vsRoots) {
    for (const year of years) {
      for (const ed of editions) {
        const msvcBase = path.join(root, year, ed, 'VC', 'Tools', 'MSVC');
        if (!fs.existsSync(msvcBase)) continue;
        try {
          const versions = fs.readdirSync(msvcBase).filter(v => /^\d+\.\d+/.test(v)).sort().reverse();
          for (const ver of versions) {
            const binDir = path.join(msvcBase, ver, 'bin', 'Hostx64', 'x64');
            if (fs.existsSync(path.join(binDir, 'nmake.exe'))) { found.nmake = binDir; break; }
          }
        } catch(e) {}
        if (found.nmake) break;
      }
      if (found.nmake) break;
    }
  }
  
  const common = [
    { key: 'cmake', name: 'cmake.exe', dirs: ['C:\\Program Files\\CMake\\bin'] },
    { key: 'git', name: 'git.exe', dirs: ['C:\\Program Files\\Git\\bin'] }
  ];
  for (const tool of common) {
    for (const d of tool.dirs) { if (fs.existsSync(path.join(d, tool.name))) { found[tool.key] = d; break; } }
  }

  const additions = Object.values(found).filter(Boolean);
  if (additions.length > 0) {
    process.env.PATH = additions.join(path.delimiter) + path.delimiter + (process.env.PATH || '');
    console.log('PATH updated with: ' + additions.join(', '));
  }
  return found;
}

async function runNpmInstall() {
  const projectRoot = path.join(__dirname, '..');
  console.log('Running npm install...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: projectRoot, shell: isWindows });
    execSync('npm run build', { stdio: 'inherit', cwd: projectRoot, shell: isWindows });
  } catch (err) {
    console.error('npm install error: ' + err.message);
  }

  const whisperDir = path.join(projectRoot, 'node_modules', 'nodejs-whisper');
  if (fs.existsSync(whisperDir)) {
    const whisperBin = isWindows
      ? path.join(whisperDir, 'build', 'bin', 'Release', 'whisper-cli.exe')
      : path.join(whisperDir, 'build', 'bin', 'whisper-cli');

    if (!fs.existsSync(whisperBin)) {
      console.warn('whisper-cli missing. Rebuilding...');
      const buildDir = path.join(whisperDir, 'build');
      if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);
      
      // Fix missing whisper.cpp submodule in nodejs-whisper
      if (!fs.existsSync(path.join(whisperDir, 'CMakeLists.txt'))) {
          console.log("Downloading whisper.cpp source...");
          execSync('git clone https://github.com/ggerganov/whisper.cpp.git .', { stdio: 'inherit', cwd: whisperDir, shell: isWindows });
      }

      try {
        execSync(isWindows ? 'cmake .. -G "NMake Makefiles"' : 'cmake ..', { stdio: 'inherit', cwd: buildDir, shell: isWindows });
        execSync(isWindows ? 'nmake' : 'make', { stdio: 'inherit', cwd: buildDir, shell: isWindows });
        console.log('Rebuild success');
      } catch (e) {
        console.error('Rebuild failed');
      }
    }
  }

  // Windows Release fix
  if (isWindows) {
    const binDir = path.join(whisperDir, 'build', 'bin');
    const wrong = path.join(binDir, 'whisper-cli.exe');
    const right = path.join(binDir, 'Release', 'whisper-cli.exe');
    if (fs.existsSync(wrong) && !fs.existsSync(right)) {
      if (!fs.existsSync(path.dirname(right))) fs.mkdirSync(path.dirname(right), { recursive: true });
      fs.copyFileSync(wrong, right);
    }
  }
}

async function main() {
  console.log('AIM Suite Setup v2.1 (Patcher Edition)');
  findAndPatchPath();
  await runNpmInstall();
  console.log('Setup finished.');
}

main().catch(console.error);
