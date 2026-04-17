/**
 * AIM VideoLens — Tool: aim_evaluate_video
 * Оценка виральности видео до публикации.
 * Пайплайн: Whisper → Scene Grid → Claude Vision
 */
export interface EvaluateVideoInput {
    videoPath: string;
}
export declare function evaluateVideo(input: EvaluateVideoInput): Promise<string>;
//# sourceMappingURL=evaluateVideo.d.ts.map