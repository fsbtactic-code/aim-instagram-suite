import fetch from 'node-fetch';
import { io } from "socket.io-client";

const IQSAVED_ORIGIN = "https://iqsaved.com";
const CDN_IMG = "https://cdn.iqsaved.com/img.php?url=";

const FETCH_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
};

/** Ответ searchResult: data.data.items[] с downloadLink */
export interface IqsavedCarouselItem {
  type?: string;
  downloadLink?: { value: string; filename?: string | null; name?: string | null }[];
}

function normalizeInstagramPostUrl(shortcode: string): string {
  return `https://www.instagram.com/p/${shortcode}/`;
}

export async function fetchIqsavedConnectToken(): Promise<string> {
  const res = await fetch(`${IQSAVED_ORIGIN}/connect/`, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(`Ошибка подключения (HTTP ${res.status})`);
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) {
    throw new Error("Не получен токен доступа");
  }
  return data.token;
}

export function fetchIqsavedCarouselItems(instagramPostUrl: string, token: string): Promise<IqsavedCarouselItem[]> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const socket = io(IQSAVED_ORIGIN, {
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

    socket.on("searchResult", (raw: unknown) => {
      clearTimeout(killTimer);
      socket.disconnect();
      done(() => {
        try {
          const wrapper = raw as {
            data?: { data?: { items?: IqsavedCarouselItem[] }; items?: IqsavedCarouselItem[] };
          };
          const inner = wrapper?.data?.data ?? wrapper?.data;
          const items = inner?.items;
          if (!Array.isArray(items) || items.length === 0) {
            reject(new Error("Карусель пуста или недоступна"));
            return;
          }
          resolve(items);
        } catch (e) {
          reject(e instanceof Error ? e : new Error(String(e)));
        }
      });
    });

    socket.on("connect_error", (err: Error) => {
      clearTimeout(killTimer);
      socket.disconnect();
      done(() => reject(err));
    });
  });
}

export function buildIqsavedImageDownloadUrl(value: string, filename: string): string {
  return (
    CDN_IMG +
    encodeURIComponent(value) +
    "&filename=" +
    encodeURIComponent(filename || "slide.jpg")
  );
}

export async function downloadIqsavedImageBytes(
  value: string,
  filename: string,
  maxBytes: number
): Promise<{ mimeType: string; data: string } | null> {
  const url = buildIqsavedImageDownloadUrl(value, filename);
  try {
    const res = await fetch(url, {
      headers: {
        ...FETCH_HEADERS,
        Referer: `${IQSAVED_ORIGIN}/`,
      },
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > maxBytes) return null;
    const ct = res.headers.get("content-type") || "image/jpeg";
    const mimeType = ct.startsWith("image/") ? ct.split(";")[0].trim() : "image/jpeg";
    if (!mimeType.startsWith("image/")) return null;
    return { mimeType, data: buf.toString("base64") };
  } catch {
    return null;
  }
}

export function extractInstagramShortcode(input: string): string | null {
  const trimmed = input.trim();
  const m =
    trimmed.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i) ||
    trimmed.match(/^([A-Za-z0-9_-]{5,})$/);
  return m ? m[1] : null;
}

export function canonicalInstagramUrlFromInput(input: string): { shortcode: string; postUrl: string } | null {
  const shortcode = extractInstagramShortcode(input);
  if (!shortcode) return null;
  return { shortcode, postUrl: normalizeInstagramPostUrl(shortcode) };
}
