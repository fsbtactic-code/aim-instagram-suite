/**
 * AIM Instagram Suite — Tool: aim_draft_carousel_structure
 * Создаёт контентную структуру карусели (JSON воронка).
 */
import { z } from 'zod';
export declare const DraftCarouselStructureSchema: z.ZodObject<{
    topic: z.ZodString;
    slideCount: z.ZodDefault<z.ZodNumber>;
    toneOfVoice: z.ZodDefault<z.ZodEnum<["educational", "motivational", "professional", "casual", "provocative"]>>;
}, "strip", z.ZodTypeAny, {
    topic: string;
    slideCount: number;
    toneOfVoice: "educational" | "motivational" | "professional" | "casual" | "provocative";
}, {
    topic: string;
    slideCount?: number | undefined;
    toneOfVoice?: "educational" | "motivational" | "professional" | "casual" | "provocative" | undefined;
}>;
export type DraftCarouselStructureInput = z.infer<typeof DraftCarouselStructureSchema>;
export declare function draftCarouselStructure(input: DraftCarouselStructureInput): string;
//# sourceMappingURL=draftCarouselStructure.d.ts.map