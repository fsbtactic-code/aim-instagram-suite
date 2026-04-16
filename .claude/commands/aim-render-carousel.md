# 🎨 ШАГ 2: Отрендерить карусель в PNG (aim_render_premium_carousel)

Используй MCP инструмент `aim_render_premium_carousel`.

Аргументы: $ARGUMENTS

Обязательные параметры:
- `slidesData` — JSON слайдов (из `/project:aim-draft-carousel` или напрямую)
- `theme` — тема дизайна (1-8):
  - `1` = ✨ Glassmorphism — матовое стекло, фиолетовый
  - `2` = 💥 Neo-Brutalism — кислотный, чёрные тени
  - `3` = 🤍 Minimalist Elegance — журнальный, бежевый
  - `4` = 💚 Dark Cyberpunk — неон, сетка кода
  - `5` = 🍎 Apple Premium — чёрный/белый градиент
  - `6` = 🌈 Y2K / Acid — ретро-футуризм, хром
  - `7` = 🔵 EdTech / Trust — синий, корпоративный
  - `8` = 🎯 Custom Brand — кастомный (нужен `brandColorOverlay`)
- `outputDir` — папка для сохранения PNG

Опционально:
- `format` — `square` (1080×1080) или `portrait` (1080×1350), по умолчанию `square`
- `globalCta` — текст CTA-баннера на каждый слайд (например: "Напиши СТАРТ в директ")
- `brandColorOverlay` — CSS из `/project:aim-brand-colors`

Если JSON слайдов нет — предложи сначала `/project:aim-draft-carousel`.
