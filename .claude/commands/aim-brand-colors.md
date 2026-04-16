# 🎨 Настроить бренд-цвета темы (aim_auto_brand_colors)

Используй MCP инструмент `aim_auto_brand_colors`.

Аргументы: $ARGUMENTS

Обязательные параметры:
- `baseTheme` — номер базовой темы (1-8)
- `primaryColor` — основной цвет HEX (например: `#E91E63`)
- `secondaryColor` — вторичный цвет HEX (например: `#FF9800`)

Опционально:
- `textColor` — цвет текста HEX (по умолчанию: `#FFFFFF`)

Инструмент проверяет контрастность по WCAG AA и возвращает готовый CSS.
Этот CSS передаётся в `/project:aim-render-carousel` через параметр `brandColorOverlay`.

После получения CSS — предложи сразу отрендерить карусель.
