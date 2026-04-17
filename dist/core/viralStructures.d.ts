/**
 * AIM Instagram Suite — Core: Viral Structures
 * 5 доказанных вирусных структур каруселей (до 20 слайдов).
 * Используются как шаблоны для генерации контента.
 */
export interface ViralSlideTemplate {
    position: number;
    role: string;
    trigger: string;
    titleFormula: string;
    bodyFormula: string;
    emoji: string;
    cta?: string;
}
export interface ViralStructure {
    id: string;
    name: string;
    description: string;
    targetAudience: string;
    engagementMechanic: string;
    optimalSlideCount: number;
    slides: ViralSlideTemplate[];
}
export declare const VIRAL_STRUCTURES: Record<string, ViralStructure>;
export declare function getViralStructure(id: string): ViralStructure | undefined;
export declare function listViralStructures(): ViralStructure[];
/**
 * Генерирует шаблонный JSON слайдов из вирусной структуры
 */
export declare function structureToSlides(structure: ViralStructure): Array<{
    slideNumber: number;
    title: string;
    subtitle: string;
    body: string;
    emoji: string;
    tag?: string;
}>;
//# sourceMappingURL=viralStructures.d.ts.map