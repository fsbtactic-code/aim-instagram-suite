"use strict";
/**
 * AIM VideoLens — Core: Whisper wrapper
 * Локальная транскрибация через nodejs-whisper (whisper.cpp бинд).
 * Бесплатно, без API, работает офлайн.
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
exports.transcribe = transcribe;
exports.formatTranscriptForLLM = formatTranscriptForLLM;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * Транскрибирует WAV-файл через nodejs-whisper.
 * @param wavPath — путь к WAV (16kHz, mono, PCM s16le)
 * @param modelName — размер модели: 'base', 'small', 'medium' (default: 'base')
 */
async function transcribe(wavPath, modelName = 'base') {
    if (!fs.existsSync(wavPath)) {
        throw new Error(`Whisper: WAV файл не найден: ${wavPath}`);
    }
    const isWindows = process.platform === 'win32';
    const whisperBin = isWindows
        ? path.join(process.cwd(), 'node_modules', 'nodejs-whisper', 'build', 'bin', 'Release', 'whisper-cli.exe')
        : path.join(process.cwd(), 'node_modules', 'nodejs-whisper', 'build', 'bin', 'whisper-cli');
    if (!fs.existsSync(whisperBin)) {
        throw new Error(`Whisper: Бинарный файл whisper-cli не найден. Убедитесь, что вы запустили \`npm run setup\` для компиляции whisper.cpp.\n` +
            `Ожидаемый путь: ${whisperBin}`);
    }
    // nodejs-whisper — динамический импорт
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { nodewhisper } = require('nodejs-whisper');
    const stderrLogger = {
        log: (...a) => process.stderr.write('[WHISPER] ' + a.join(' ') + '\n'),
        warn: (...a) => process.stderr.write('[WHISPER] ' + a.join(' ') + '\n'),
        info: (...a) => process.stderr.write('[WHISPER] ' + a.join(' ') + '\n'),
        error: (...a) => process.stderr.write('[WHISPER] ' + a.join(' ') + '\n'),
        debug: (...a) => { }, // подавляем verbose debug логи
    };
    let result;
    try {
        result = await nodewhisper(wavPath, {
            modelName,
            autoDownloadModelName: modelName,
            removeWavFileAfterTranscription: false,
            withCuda: false,
            logger: stderrLogger, // ← кастомный logger вместо console
            whisperOptions: {
                outputInJson: true,
                wordTimestamps: false,
                language: 'auto',
            },
        });
    }
    catch (whisperErr) {
        const msg = whisperErr instanceof Error ? whisperErr.message : String(whisperErr);
        process.stderr.write('[AIM] Whisper: тихое аудио или ошибка транскрипции: ' + msg + '\n');
        return { segments: [], fullText: '', language: 'auto' };
    }
    // Нормализуем вывод nodejs-whisper
    let segments = [];
    let fullText = '';
    if (Array.isArray(result)) {
        segments = result.map((seg) => ({
            start: seg.start ?? 0,
            end: seg.end ?? 0,
            text: (seg.speech ?? seg.text ?? '').trim(),
        })).filter((s) => s.text.length > 0);
        fullText = segments.map((s) => s.text).join(' ');
    }
    else if (typeof result === 'string') {
        // Fallback: plain text without timestamps
        fullText = result.trim();
        segments = [{ start: 0, end: 0, text: fullText }];
    }
    // Try to detect language from first few characters (basic heuristic)
    const language = detectLanguageHeuristic(fullText);
    return { segments, fullText, language };
}
/**
 * Форматирует транскрипт с таймкодами для передачи в LLM.
 */
function formatTranscriptForLLM(result) {
    if (result.segments.length === 0)
        return '(аудио не распознано)';
    return result.segments
        .map(seg => {
        const start = formatTime(seg.start);
        const end = formatTime(seg.end);
        return `[${start} → ${end}] ${seg.text}`;
    })
        .join('\n');
}
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toFixed(1);
    return `${String(m).padStart(2, '0')}:${String(Number(s).toFixed(1)).padStart(4, '0')}`;
}
function detectLanguageHeuristic(text) {
    // Simple heuristic: count Cyrillic vs Latin characters
    const cyrillicCount = (text.match(/[\u0400-\u04FF]/g) || []).length;
    const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
    if (cyrillicCount > latinCount)
        return 'ru';
    if (latinCount > cyrillicCount)
        return 'en';
    return 'auto';
}
//# sourceMappingURL=whisper.js.map