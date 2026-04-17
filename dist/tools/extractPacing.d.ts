/**
 * AIM VideoLens — Tool: aim_extract_pacing
 * Детектор скуки: анализирует ритм монтажа, находит провисания.
 * Пайплайн: detectSceneTimecodes (без сохранения кадров) → расчёт интервалов → LLM
 */
export interface ExtractPacingInput {
    videoPath?: string;
    url?: string;
    slowThresholdSec?: number;
}
export declare function extractPacing(input: ExtractPacingInput): Promise<string>;
//# sourceMappingURL=extractPacing.d.ts.map