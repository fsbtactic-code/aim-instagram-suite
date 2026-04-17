/** Ответ searchResult: data.data.items[] с downloadLink */
export interface IqsavedCarouselItem {
    type?: string;
    downloadLink?: {
        value: string;
        filename?: string | null;
        name?: string | null;
    }[];
}
export declare function fetchIqsavedConnectToken(): Promise<string>;
export declare function fetchIqsavedCarouselItems(instagramPostUrl: string, token: string): Promise<IqsavedCarouselItem[]>;
export declare function buildIqsavedImageDownloadUrl(value: string, filename: string): string;
export declare function downloadIqsavedImageBytes(value: string, filename: string, maxBytes: number): Promise<{
    mimeType: string;
    data: string;
} | null>;
export declare function extractInstagramShortcode(input: string): string | null;
export declare function canonicalInstagramUrlFromInput(input: string): {
    shortcode: string;
    postUrl: string;
} | null;
//# sourceMappingURL=iqsaved.d.ts.map