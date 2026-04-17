# 🤖 AIM Instagram Suite — Skills & Slash Commands Setup

This guide explains how to install the 13 AIM slash commands for your AI coding assistant.
All skill files are already included in this repository — just copy them to the right place.

---

## 📋 Available Commands (13 total)

| Command | Tool | Description |
|---|---|---|
| `aim-evaluate-video` | `aim_evaluate_video` | 🎬 Virality score for local video file |
| `aim-analyze-viral` | `aim_analyze_viral_reels` | 🕵️ Reverse-engineer competitor videos |
| `aim-generate-script` | `aim_generate_script` | ✍️ Generate script from viral analysis |
| `aim-analyze-hook` | `aim_analyze_hook` | 🪝 Analyze & strengthen hook (first 5 sec) |
| `aim-extract-pacing` | `aim_extract_pacing` | ⏱️ Detect boring pacing / slow edits |
| `aim-score-video` | `aim_score_virality` | 📊 Virality Index for VIDEO (0-100) |
| `aim-score-carousel` | `aim_score_carousel_virality` | 📊 Virality Index for CAROUSEL (0-100) |
| `aim-analyze-carousel` | `aim_analyze_carousel` | 🔍 Reverse-engineer Instagram carousel |
| `aim-localize-carousel` | `aim_localize_carousel` | 🌍 Copy / localize / adapt carousel |
| `aim-viral-structures` | `aim_viral_structure` | 📐 Library of 12 proven viral structures |
| `aim-draft-carousel` | `aim_draft_carousel_structure` | 📝 STEP 1: Create carousel content (JSON) |
| `aim-render-carousel` | `aim_render_premium_carousel` | 🎨 STEP 2: Render carousel to PNG files |
| `aim-brand-colors` | `aim_auto_brand_colors` | 🎨 Set brand colors with WCAG AA check |

---

## 🔧 Installation by Platform

### Claude Code (Anthropic)

Skill files: `.claude/commands/aim-*.md`

**Option A — Project-scoped** (already in repo, works automatically):
```
# Commands are available as:
/project:aim-evaluate-video
/project:aim-draft-carousel
/project:aim-render-carousel
# etc.
```

**Option B — User-scoped** (available in all your projects):
```bash
# macOS / Linux
cp .claude/commands/aim-*.md ~/.claude/commands/

# Windows (PowerShell)
Copy-Item .claude\commands\aim-*.md $HOME\.claude\commands\
```
Commands become: `/user:aim-evaluate-video`, etc.

---

### Gemini CLI / Antigravity IDE (Google)

Skill files: `.gemini/commands/aim/*.toml`

**Option A — Project-scoped** (already in repo, works automatically):
```
# Commands are available as:
/aim:evaluate_video
/aim:draft_carousel
/aim:render_carousel
# etc.
```

**Option B — User-scoped** (available in all your projects):
```bash
# macOS / Linux
cp -r .gemini/commands/aim ~/.gemini/commands/

# Windows (PowerShell)
Copy-Item .gemini\commands\aim $HOME\.gemini\commands\ -Recurse -Force
```

---

### Cursor IDE

Cursor uses `.cursor/rules/` for persistent AI instructions.  
Create one file per tool or a single combined rules file:

```bash
# macOS / Linux
mkdir -p .cursor/rules
cat .claude/commands/aim-*.md > .cursor/rules/aim-instagram-suite.mdc

# Windows (PowerShell)
New-Item -ItemType Directory -Path .cursor\rules -Force
Get-Content .claude\commands\aim-*.md | Set-Content .cursor\rules\aim-instagram-suite.mdc
```

Then reference tools in Cursor chat like: `Use aim_evaluate_video to analyze this video`

---

### GitHub Copilot (VS Code)

Copilot uses `.github/copilot-instructions.md` for workspace instructions.

```bash
# macOS / Linux
cat .claude/commands/aim-*.md > .github/copilot-instructions.md

# Windows (PowerShell)
Get-Content .claude\commands\aim-*.md | Set-Content .github\copilot-instructions.md
```

---

### Windsurf (Codeium)

Windsurf supports `.windsurfrules` file in the project root.

```bash
# macOS / Linux
cat .claude/commands/aim-*.md > .windsurfrules

# Windows (PowerShell)
Get-Content .claude\commands\aim-*.md | Set-Content .windsurfrules
```

---

### Any other AI agent (Universal)

The `.claude/commands/aim-*.md` files are plain Markdown — readable by any AI.  
Simply paste the contents into your agent's system prompt or context window.

All 13 files combined are ~4,000 tokens. Example:

```bash
# Merge all into one file for any agent
cat .claude/commands/aim-*.md > aim-all-commands.md
```

---

## 🚀 MCP Server Setup (required for all platforms)

The slash commands call MCP tools. Make sure the server is running:

### 1. Install dependencies
```bash
npm install
```

### 2. Add to your MCP config

**Claude Code** — add to `claude_desktop_config.json` or run:
```bash
claude mcp add aim-instagram-suite -- node /absolute/path/to/aimvideo/dist/index.js
```

**Gemini / Antigravity** — add to `~/.gemini/antigravity/mcp_config.json`:
```json
"aim-instagram-suite": {
  "command": "node",
  "args": ["/absolute/path/to/aimvideo/dist/index.js"],
  "env": {}
}
```

**Cursor / Windsurf / other** — follow your platform's MCP documentation and point to:
```
command: node /absolute/path/to/aimvideo/dist/index.js
```

---

## 📁 Repository Structure

```
aimvideo/
├── .claude/
│   └── commands/           ← Claude Code slash commands (.md)
│       ├── aim-evaluate-video.md
│       ├── aim-draft-carousel.md
│       ├── aim-render-carousel.md
│       └── ... (13 files total)
├── .gemini/
│   └── commands/
│       └── aim/            ← Gemini / Antigravity skills (.toml)
│           ├── evaluate_video.toml
│           ├── draft_carousel.toml
│           └── ... (13 files total)
├── src/
│   ├── index.ts            ← MCP Server entry point
│   └── tools/              ← Tool implementations
└── SKILLS_SETUP.md         ← This file
```
