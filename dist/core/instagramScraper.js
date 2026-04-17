"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFileFast = downloadFileFast;
exports.scrapeInstagramMedia = scrapeInstagramMedia;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const iqsaved_js_1 = require("./iqsaved.js");
/**
 * Загрузка медиа по прямой ссылке с сохранением во временный файл
 */
async function downloadFileFast(url, destDir, extension) {
    const filePath = path.join(destDir, `${(0, crypto_1.randomUUID)()}.${extension}`);
    const res = await (0, node_fetch_1.default)(url);
    if (!res.ok || !res.body)
        throw new Error(`Failed to download ${url}: ${res.statusText}`);
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        res.body.pipe(fileStream);
        res.body.on('error', (err) => reject(err));
        fileStream.on('finish', () => resolve(filePath));
    });
}
/**
 * Получение прямых ссылок на MP4/JPG через Cobalt API (Zero-Ad Community API)
 */
async function fetchViaCobalt(url) {
    try {
        const res = await (0, node_fetch_1.default)('https://api.cobalt.tools/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            body: JSON.stringify({
                url: url,
                filenamePattern: 'nerd'
            })
        });
        if (!res.ok) {
            throw new Error(`Cobalt HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.status === 'error') {
            throw new Error(`Cobalt API Error: ${data.text || data.error?.code}`);
        }
        // Если это карусель, Cobalt возвращает picker
        if (data.status === 'picker' && Array.isArray(data.picker)) {
            return data.picker.map((item) => ({
                url: item.url,
                isVideo: item.type === 'video'
            }));
        }
        // Обычное видео / одно фото
        if (data.url) {
            return [{
                    url: data.url,
                    isVideo: data.url.includes('.mp4') || !data.url.includes('.jpg')
                }];
        }
        throw new Error('Unknown Cobalt response format');
    }
    catch (error) {
        console.error('[AIM] Cobalt failed:', error);
        return [];
    }
}
/**
 * Получение медиа через открытый API IQSaved (быстро и стабильно для каруселей)
 */
async function fetchViaIqsaved(url) {
    try {
        const canonical = (0, iqsaved_js_1.canonicalInstagramUrlFromInput)(url);
        if (!canonical)
            return [];
        const token = await (0, iqsaved_js_1.fetchIqsavedConnectToken)();
        const items = await (0, iqsaved_js_1.fetchIqsavedCarouselItems)(canonical.postUrl, token);
        const mediaLinks = [];
        for (const item of items) {
            if (item.downloadLink && item.downloadLink.length > 0) {
                // Обычно самая тяжелая версия - последняя в массиве downloadLink
                const dl = item.downloadLink[item.downloadLink.length - 1];
                if (dl.value) {
                    const isVid = dl.filename?.includes('.mp4') || item.type === 'video';
                    const proxyUrl = (0, iqsaved_js_1.buildIqsavedImageDownloadUrl)(dl.value, dl.filename || (isVid ? 'video.mp4' : 'slide.jpg'));
                    mediaLinks.push({
                        url: proxyUrl,
                        isVideo: isVid
                    });
                }
            }
        }
        console.error(`[AIM] IQSaved API успешно извлек файлов: ${mediaLinks.length}`);
        return mediaLinks;
    }
    catch (error) {
        console.error('[AIM] IQSaved API failed:', error.message);
        return [];
    }
}
/**
 * Получение ссылок через коммерческий RapidAPI (около 100 запросов бесплатно)
 * Для тех случаев, когда бесплатные сервисы лежат
 */
async function fetchViaRapidAPI(url, apiKey) {
    // Реализация под популярный "Instagram Scraper API" на RapidAPI (пример endpoint)
    // Мы оставляем скелет для пользователя, если он предоставит ключ.
    try {
        const res = await (0, node_fetch_1.default)(`https://instagram-scraper-api2.p.rapidapi.com/v1/dl_insta?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
            }
        });
        if (!res.ok)
            throw new Error(`RapidAPI HTTP ${res.status}`);
        const data = await res.json();
        if (data?.data && Array.isArray(data.data)) {
            return data.data.map((item) => ({
                url: item.url,
                isVideo: item.is_video
            }));
        }
        return [];
    }
    catch (error) {
        console.error('[AIM] RapidAPI failed:', error);
        return [];
    }
}
/**
 * Главный фасад для парсинга инстаграма через сторонние сервисы с жестким анти-провалом
 */
async function scrapeInstagramMedia(url) {
    const rapidApiKey = process.env.AIM_IG_API_KEY;
    let media = [];
    // [ШАГ 0] Premium Method (Если есть ключ)
    if (rapidApiKey) {
        try {
            console.error('[AIM] Использование RapidAPI для загрузки (Premium Method)...');
            media = await fetchViaRapidAPI(url, rapidApiKey);
            if (media && media.length > 0)
                return media;
            console.error('[AIM] RapidAPI вернул пустой массив, откат к IQSaved API...');
        }
        catch (e) {
            console.error('[AIM] RapidAPI упал:', e.message);
        }
    }
    // [ШАГ 1] ПРИОРИТЕТ 1: Запуск IQSaved API (Самый надежный для каруселей)
    try {
        console.error('[AIM] ПРИОРИТЕТ 1: Использование внутреннего IQSaved API...');
        media = await fetchViaIqsaved(url);
        if (media && media.length > 0)
            return media;
        console.error('[AIM] IQSaved API не вернул медиа, переходим к резервным вариантам...');
    }
    catch (e) {
        console.error('[AIM] Ошибка IQSaved API:', e.message);
    }
    // [ШАГ 2] ПРИОРИТЕТ 2: Cobalt (Быстрый fallback для видео)
    try {
        console.error('[AIM] ПРИОРИТЕТ 2: Пробуем открытые сервисы (Cobalt)...');
        media = await fetchViaCobalt(url);
        if (media && media.length > 0)
            return media;
        console.error('[AIM] Cobalt не вернул медиа, переходим к Puppeteer...');
    }
    catch (e) {
        console.error('[AIM] Ошибка Cobalt API:', e.message);
    }
    // [ФИНАЛ] Анти-провал: если всё выше не дало результатов
    throw new Error('КРИТИЧЕСКАЯ ОШИБКА: Сервисы (IQSaved, Cobalt) недоступны. Попробуйте другую ссылку.');
}
//# sourceMappingURL=instagramScraper.js.map