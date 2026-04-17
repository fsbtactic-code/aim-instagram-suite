# 🔧 Установка AIM Instagram Suite — детальные инструкции

## ⚡ Установить глобальные скиллы (одна команда)

После клонирования репо — запусти полный setup и скопируй скиллы:

**Windows PowerShell:**
```powershell
git clone https://github.com/fsbtactic-code/aim-instagram-suite.git
cd aim-instagram-suite
node scripts/setup.js
Copy-Item ".claude\commands\aim-*.md" "$HOME\.claude\commands\" -Force
```

**macOS / Linux:**
```bash
git clone https://github.com/fsbtactic-code/aim-instagram-suite.git
cd aim-instagram-suite
node scripts/setup.js
cp .claude/commands/aim-*.md ~/.claude/commands/
```

`setup.js` автоматически установит: **CMake**, **Build Tools**, **yt-dlp**, все **npm-пакеты**.

После этого **перезапусти Claude Code** → набери `/` → появятся все `aim-*` скиллы глобально.

---

Выбери свою платформу:

- [Claude Desktop](#-claude-desktop)
- [Cursor IDE](#-cursor-ide)
- [Antigravity / Gemini CLI](#-antigravity--gemini-cli)
- [Claude Code CLI](#-claude-code-cli)
- [Windsurf](#-windsurf)
- [GitHub Copilot](#-github-copilot)

---

## 🟣 Claude Desktop

> ⚠️ **Важно:** Claude Desktop и Claude Code CLI — это **разные приложения** с **разными конфигами**:
> - **Claude Desktop** (GUI) → `%APPDATA%\Claude\claude_desktop_config.json`
> - **Claude Code** (CLI) → `~/.claude/settings.json` (или `claude mcp add`)
>
> Убедитесь, что добавляете сервер в правильный файл!

### 1. Установка одним промптом

Вставь этот промпт в чат Claude Desktop (до подключения MCP):

> Склонируй репозиторий `https://github.com/fsbtactic-code/aim-instagram-suite.git` на рабочий стол. Перейди в папку `aim-instagram-suite` и выполни `npm install && npm run build`. Затем открой файл `claude_desktop_config.json`:
> - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
> - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
>
> Добавь в него запись в `mcpServers`:
> ```json
> "aim-instagram-suite": {
>   "command": "node",
>   "args": ["АБСОЛЮТНЫЙ_ПУТЬ/aim-instagram-suite/dist/index.js"]
> }
> ```
> Подставь реальный абсолютный путь к папке. Полностью перезапусти Claude Desktop (закрой через трей). Подтверди что сервер подключён — должны появиться 14 инструментов `aim_`.

### 2. Конфиг вручную

**Windows** — путь конфига: `%APPDATA%\Claude\claude_desktop_config.json`

**macOS** — путь конфига: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "aim-instagram-suite": {
      "command": "node",
      "args": ["C:\\Users\\ИМЯ\\Desktop\\aim-instagram-suite\\dist\\index.js"]
    }
  }
}
```

> ⚠️ Используй `node dist/index.js` — билд создаётся автоматически во время `npm run build` или `node scripts/setup.js`.

### 3. Перезапуск

Полностью закрой Claude Desktop (не сверни — именно закрой через трей), подожди 3 секунды, открой снова. В панели инструментов (🔧) должны появиться 14 MCP-инструментов `aim_`.

---

## 🔵 Cursor IDE

### Установка одним промптом

Вставь в чат Cursor:

> Склонируй `https://github.com/fsbtactic-code/aim-instagram-suite.git` на рабочий стол. Выполни `node scripts/setup.js` внутри папки. Открой настройки Cursor → MCP → добавь сервер: name=`aim-instagram-suite`, command=`node`, args=`АБСОЛЮТНЫЙ_ПУТЬ/dist/index.js`. Перезапусти Cursor и подтверди подключение 14 инструментов.

### Вручную через `cursor_mcp.json`

Cursor хранит MCP конфиг в `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "aim-instagram-suite": {
      "command": "node",
      "args": ["/Users/name/Desktop/aim-instagram-suite/dist/index.js"]
    }
  }
}
```

### Slash-команды в Cursor

Cursor поддерживает правила (`.cursor/rules/`). Для удобного доступа к инструментам создай файл:

```bash
# macOS/Linux
cat .claude/commands/aim-*.md > .cursor/rules/aim-instagram-suite.mdc

# Windows PowerShell
Get-Content .claude\commands\aim-*.md | Set-Content .cursor\rules\aim-instagram-suite.mdc
```

---

## 🟡 Antigravity / Gemini CLI

### Установка одним промптом

Вставь в чат Antigravity:

> Склонируй `https://github.com/fsbtactic-code/aim-instagram-suite.git` на рабочий стол. Выполни `npm install` внутри папки. Открой файл `~/.gemini/antigravity/mcp_config.json` и добавь:
> ```json
> "aim-instagram-suite": {
>   "command": "node",
>   "args": ["АБСОЛЮТНЫЙ_ПУТЬ/dist/index.js"],
>   "env": {}
> }
> ```
> Перезапусти Antigravity и подтверди подключение.

### Slash-команды `/aim:*` в Gemini/Antigravity

Файлы `.toml` уже в репозитории в `.gemini/commands/aim/`. Для глобального доступа (во всех проектах):

```powershell
# Windows
Copy-Item .gemini\commands\aim $HOME\.gemini\commands\ -Recurse -Force
```

```bash
# macOS/Linux
cp -r .gemini/commands/aim ~/.gemini/commands/
```

После копирования команды доступны как `/aim:evaluate_video`, `/aim:draft_carousel` и т.д.

---

## 🟢 Claude Code CLI

```bash
git clone https://github.com/fsbtactic-code/aim-instagram-suite.git
cd aim-instagram-suite
npm install
claude mcp add aim-instagram-suite -- node "$(pwd)/dist/index.js"
```

**Windows PowerShell:**
```powershell
git clone https://github.com/fsbtactic-code/aim-instagram-suite.git
cd aim-instagram-suite
npm install
claude mcp add aim-instagram-suite -- node "$PWD\dist\index.js"
```

Slash-команды `/project:aim-*` подхватятся автоматически из `.claude/commands/` — перезапуск не нужен.

---

## 🔷 Windsurf

Добавь в корень проекта `.windsurfrules`:

```bash
# macOS/Linux
cat .claude/commands/aim-*.md > .windsurfrules

# Windows
Get-Content .claude\commands\aim-*.md | Set-Content .windsurfrules
```

MCP конфиг Windsurf: `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "aim-instagram-suite": {
      "command": "node",
      "args": ["/absolute/path/to/aim-instagram-suite/dist/index.js"]
    }
  }
}
```

---

## 🐙 GitHub Copilot

Добавь инструкции в `.github/copilot-instructions.md`:

```bash
# macOS/Linux
cat .claude/commands/aim-*.md > .github/copilot-instructions.md

# Windows
Get-Content .claude\commands\aim-*.md | Set-Content .github\copilot-instructions.md
```

---

## ✅ Проверка установки

После подключения на любой платформе попроси агента:

```
Перечисли все доступные aim_ инструменты
```

Должно появиться 14 инструментов:
`aim_evaluate_video` · `aim_analyze_viral_reels` · `aim_generate_script` · `aim_analyze_hook` · `aim_extract_pacing` · `aim_score_virality` · `aim_score_carousel_virality` · `aim_analyze_carousel` · `aim_localize_carousel` · `aim_viral_structure` · `aim_draft_carousel_structure` · `aim_render_premium_carousel` · `aim_auto_brand_colors` · `aim_create_style`

---

## 📋 Slash-команды по платформам

| Платформа | Команды | Источник файлов |
|---|---|---|
| Claude Desktop | Инструменты в панели 🔧 | MCP (авто) |
| Claude Code CLI | `/project:aim-*` | `.claude/commands/` |
| Gemini / Antigravity | `/aim:*` | `.gemini/commands/aim/` |
| Cursor | Контекст агента | `.cursor/rules/` |
| Windsurf | Контекст агента | `.windsurfrules` |
| Copilot | Контекст агента | `.github/copilot-instructions.md` |
