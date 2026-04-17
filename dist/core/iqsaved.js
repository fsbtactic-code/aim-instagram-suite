"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchIqsavedConnectToken = fetchIqsavedConnectToken;
exports.fetchIqsavedCarouselItems = fetchIqsavedCarouselItems;
exports.buildIqsavedImageDownloadUrl = buildIqsavedImageDownloadUrl;
exports.downloadIqsavedImageBytes = downloadIqsavedImageBytes;
exports.extractInstagramShortcode = extractInstagramShortcode;
exports.canonicalInstagramUrlFromInput = canonicalInstagramUrlFromInput;
const node_fetch_1 = __importDefault(require("node-fetch"));
const socket_io_client_1 = require("socket.io-client");
const IQSAVED_ORIGIN = "https://iqsaved.com";
const CDN_IMG = "https://cdn.iqsaved.com/img.php?url=";
const FETCH_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
};
function normalizeInstagramPostUrl(shortcode) {
    return `https://www.instagram.com/p/${shortcode}/`;
}
async function fetchIqsavedConnectToken() {
    const res = await (0, node_fetch_1.default)(`${IQSAVED_ORIGIN}/connect/`, {
        headers: FETCH_HEADERS,
        signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
        throw new Error(`Ошибка подключения (HTTP ${res.status})`);
    }
    const data = (await res.json());
    if (!data.token) {
        throw new Error("Не получен токен доступа");
    }
    return data.token;
}
function fetchIqsavedCarouselItems(instagramPostUrl, token) {
    return new Promise((resolve, reject) => {
        let settled = false;
        const done = (fn) => {
            if (settled)
                return;
            settled = true;
            fn();
        };
        const socket = (0, socket_io_client_1.io)(IQSAVED_ORIGIN, {
            path: "/socket.io",
            transports: ["polling"],
            upgrade: false,
            reconnection: false,
            timeout: 45_000,
        });
        const killTimer = setTimeout(() => {
            socket.disconnect();
            done(() => reject(new Error("Таймаут ответа сервиса")));
        }, 55_000);
        socket.on("connect", () => {
            socket.emit("search", {
                date: Date.now(),
                token,
                requestType: "2",
                linkValue: instagramPostUrl,
            });
        });
        socket.on("searchResult", (raw) => {
            clearTimeout(killTimer);
            socket.disconnect();
            done(() => {
                try {
                    const wrapper = raw;
                    const inner = wrapper?.data?.data ?? wrapper?.data;
                    const items = inner?.items;
                    if (!Array.isArray(items) || items.length === 0) {
                        reject(new Error("Карусель пуста или недоступна"));
                        return;
                    }
                    resolve(items);
                }
                catch (e) {
                    reject(e instanceof Error ? e : new Error(String(e)));
                }
            });
        });
        socket.on("connect_error", (err) => {
            clearTimeout(killTimer);
            socket.disconnect();
            done(() => reject(err));
        });
    });
}
function buildIqsavedImageDownloadUrl(value, filename) {
    return (CDN_IMG +
        encodeURIComponent(value) +
        "&filename=" +
        encodeURIComponent(filename || "slide.jpg"));
}
async function downloadIqsavedImageBytes(value, filename, maxBytes) {
    const url = buildIqsavedImageDownloadUrl(value, filename);
    try {
        const res = await (0, node_fetch_1.default)(url, {
            headers: {
                ...FETCH_HEADERS,
                Referer: `${IQSAVED_ORIGIN}/`,
            },
            signal: AbortSignal.timeout(60_000),
        });
        if (!res.ok)
            return null;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > maxBytes)
            return null;
        const ct = res.headers.get("content-type") || "image/jpeg";
        const mimeType = ct.startsWith("image/") ? ct.split(";")[0].trim() : "image/jpeg";
        if (!mimeType.startsWith("image/"))
            return null;
        return { mimeType, data: buf.toString("base64") };
    }
    catch {
        return null;
    }
}
function extractInstagramShortcode(input) {
    const trimmed = input.trim();
    const m = trimmed.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i) ||
        trimmed.match(/^([A-Za-z0-9_-]{5,})$/);
    return m ? m[1] : null;
}
function canonicalInstagramUrlFromInput(input) {
    const shortcode = extractInstagramShortcode(input);
    if (!shortcode)
        return null;
    return { shortcode, postUrl: normalizeInstagramPostUrl(shortcode) };
}
//# sourceMappingURL=iqsaved.js.map