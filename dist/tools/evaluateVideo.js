"use strict";
/**
 * AIM VideoLens — Tool: aim_evaluate_video
 * Оценка виральности видео до публикации.
 * Пайплайн: Whisper → Scene Grid → Claude Vision
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateVideo = evaluateVideo;
const fs = __importStar(require("fs"));
const mediaProcessor_js_1 = require("../core/mediaProcessor.js");
async function evaluateVideo(input) {
    const { videoPath } = input;
    if (!fs.existsSync(videoPath)) {
        return JSON.stringify({
            error: `Файл не найден: ${videoPath}`,
            hint: 'Проверьте путь к видеофайлу.',
        });
    }
    const media = await (0, mediaProcessor_js_1.processVideo)(videoPath);
    // Возвращаем структурированные данные для Claude
    const result = {
        tool: 'aim_evaluate_video',
        videoPath,
        // TEXT-FIRST: сначала транскрипт
        transcript: {
            language: media.transcript.language,
            segmentCount: media.transcript.segments.length,
            fullText: media.transcriptText,
        },
        // GRIDS: массив из нескольких сеток
        visualAnalysis: {
            sceneCount: media.sceneTimecodes.length,
            timecodes: media.sceneTimecodes,
            gridImages: media.gridImages.map((base64, index) => ({
                mimeType: 'image/jpeg',
                base64,
                description: `Сетка кадров (ч.${index + 1} из ${media.gridImages.length})`,
            })),
        },
        // Задача для LLM
        analysisRequest: `
Ты — эксперт по вирусному контенту для Instagram Reels и TikTok.

Проанализируй это видео по системе оценки виральности:

## ТРАНСКРИПТ (текст видео):
${media.transcriptText}

## ВИЗУАЛЬНЫЙ КОНТЕКСТ (сетки ключевых кадров):
[Смотри прикреплённый набор картинок-сеток с таймкодами (слева-направо, сверху-вниз)]

---

Дай анализ по следующим критериям:

### 🪝 ХУК (первые 3 секунды)
- Оцени силу первой фразы (1-10)
- Есть ли визуальный крючок в первых кадрах?
- Почему зритель должен остаться?

### 📊 УДЕРЖАНИЕ ВНИМАНИЯ
- Где зритель скорее всего отвалится?
- Есть ли "провисания" — моменты без динамики?
- Темп монтажа: быстро / нормально / медленно?

### 💡 ЭМОЦИОНАЛЬНЫЙ РЕЗОНАНС
- Какую главную эмоцию вызывает видео?
- Есть ли триггеры (surprise, FOMO, юмор, сочувствие)?

### ⭐ ВИРАЛЬНЫЙ ПОТЕНЦИАЛ
- Общая оценка (1-10)
- Вероятность досмотра до конца (%)

### 🚀 ТОП-3 РЕКОМЕНДАЦИИ
Конкретные правки, которые поднимут виральный потенциал. Каждая рекомендация — 1 предложение с таймкодом.
`.trim(),
    };
    // Возвращаем JSON с base64 картинкой встроенной
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=evaluateVideo.js.map