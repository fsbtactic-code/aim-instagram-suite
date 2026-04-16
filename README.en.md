<div align="center">
  <img src="assets/logo.svg" alt="AIM Instagram Suite Logo" width="100%">
  
  # 🎯 AIM Instagram Suite (v1.2.0)
  
  **A Local AI Assistant (MCP Server) designed for analyzing, reverse-engineering, and generating viral Instagram content (Reels & Carousels).**
  
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Puppeteer](https://img.shields.io/badge/Puppeteer-Local_Render-40B5A4?logo=puppeteer&logoColor=white)](https://pptr.dev/)
  [![Local FFmpeg](https://img.shields.io/badge/FFmpeg-Zero_API-007808?logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)

  [Читать на Русском 🇷🇺](README.md)
</div>

---

## ⚡ What is this?

**AIM Instagram Suite** is a collection of 13 modular tools functioning as a local [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server. Pluggable into Claude Desktop or your IDE (Cursor, Windsurf), it enables the AI agent to autonomously analyze your videos, download competitor Reels/Carousels, score their virality indices, and automatically render new premium-designed posts straight to your local disk. **No paid APIs required.**

## 🛠 Auto-Installation via Claude Code

The installation of this project can be completely automated.
Just copy this prompt and paste it into **Claude Code** (or Cursor/Windsurf):

> Clone the repository `https://github.com/fsbtactic-code/aim-instagram-suite.git` into a new folder named "AIM-Suite" in my Documents (or Desktop).
> Go into that folder, install all dependencies using `npm run setup`, and build the project using `npm run build`.
> Find my `claude_desktop_config.json` file and add this project to the `mcpServers` block under the name "aim-instagram-suite". Use the `node` command and provide the absolute path to the compiled `dist/index.js` file inside the folder we just cloned.
> After that, restart Claude Desktop.

Once the prompt is executed, all `aim_` tools (carousel rendering, video analysis, etc.) will be ready to use!

---

## 🚀 Prompt Examples for Claude

Just copy and paste these phrases into your Claude chat:

### 1. Competitor Analysis & Structure "Stealing"
> 💬 *"Analyze this competitor's carousel: [Instagram link]. Break down the psychological triggers they use on each slide to trigger FOMO. Save the analysis to competitor.md"*

> 💬 *"Download and reverse-engineer this viral Reel: [TikTok/Reel link]. Find pacing errors using the boredom detector module and extract its voice transcript."*

### 2. Pre-publication Virality Scoring
> 💬 *"I shot a new piece of content: C:/Users/MyVideos/reel.mp4. Run it through the AIM Score module. My niche is 'Beginner Investing'. Give me its virality index and top 3 specific tips to improve the 3-second hook."*

> 💬 *"Check the virality potential of these carousel slides I designed. Folder: C:/Users/Carousel. What is its typography, design, and CTA score?"*

### 3. Automated Carousel Generation & Rendering
> 💬 *"Draft a new carousel about '5 Freelance Burnout Mistakes'. Use the 'day-in-life' structure. Once ready, render it using the Neo-Brutalism theme (theme 2) in portrait format (1080x1350) and output to C:/Users/Render."*

> 💬 *"Generate a 'How I made my first million' Case Study carousel. Make sure to use 'good-bad' and 'comparison' layouts on the inner slides. Add a global CTA: 'Reply MONEY in DMs'. Render it in the Apple Premium theme (5)."*

---

## 🧩 Architecture: 13 Core Tools

### 🎬 Video Intelligence
* `aim_evaluate_video` — VIDEO Virality Index Calculator (Hooks, Pacing, Emotions).
* `aim_analyze_viral_reels` — Downloads and reverse-engineers viral video anatomy.
* `aim_generate_script` — Script generation mimicking proven competitor structures.
* `aim_analyze_hook` — Isolated audit evaluating the density and strength of the first 5 seconds.
* `aim_extract_pacing` — Machine-driven "Boredom Detector" analyzing cut rhythm.

### 🖼 Carousel Studio (New in 1.2!)
* `aim_score_carousel_virality` — Multi-factor carousel evaluation (Funnel, Readability, Save-factor).
* `aim_analyze_carousel` — Downloads multi-slide competitor posts, stitches them, and reads OCR text.
* `aim_localize_carousel` — Auto-translates and adapts foreign million-view carousels.
* `aim_viral_structure` — Library of 12 scientifically proven templates (Case Study, Hot Take, Checklist, Story Arc, etc).
* `aim_draft_carousel_structure` — AI JSON generator defining slide roles, emojis, and copy.
* `aim_render_premium_carousel` — **Puppeteer Render Engine.** Draws your JSON carousel into actual PNG images using 10 specialized layouts and 8 premium themes (Glassmorphism, Cyberpunk, Neo-Brutalism).
* `aim_auto_brand_colors` — Modifies themes to strictly match your corporate HEX brand guidelines.

---

## 🎨 Design System & Layouts

Our `htmlRenderer` engine provides **10 smart text-layouts**:
1. `standard` (Copy + Emoji)
2. `hero-number` (Giant metric center-stage)
3. `grid-2x2` (4 fact blocks)
4. `good-bad` (Split ✅ Right / ❌ Wrong)
5. `before-after` (Vertical split presentation)
6. `steps-3` (Three sequential row steps)
7. `quote` (Fullscreen pull-quote)
8. `checklist` (Vertical check-items)
9. `comparison` (A vs B Table)
10. `cta-final` (High-converting CTA ending slide)

...and supports a persistent sticky CTA banner for DM-automation funnels.

## ⚠️ Privacy & Zero-API Policy
* **Zero APIs**: All heavyweight processing (FFmpeg transcoding, image stitching, Puppeteer web-rendering, `yt-dlp` scraping) runs strictly on your local hardware.
* Data never leaves your PC except for Claude's standard context window.

## Developer
Made with love.
[fsbtactic-code](https://github.com/fsbtactic-code)
