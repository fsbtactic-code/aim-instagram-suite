# 📝 ШАГ 1: Создать структуру карусели (aim_draft_carousel_structure)

Используй MCP инструмент `aim_draft_carousel_structure`.

Аргументы: $ARGUMENTS

Обязательный параметр:
- `topic` — тема карусели

Опционально:
- `slideCount` — количество слайдов (3-15, рекомендуется 7-10, по умолчанию 7)
- `toneOfVoice` — тон подачи:
  - `educational` — обучающий (по умолчанию)
  - `motivational` — мотивационный
  - `professional` — профессиональный
  - `casual` — разговорный
  - `provocative` — провокационный

Если тема не указана — попроси пользователя её описать.

После генерации JSON предложи перейти к рендеру: `/project:aim-render-carousel`.
