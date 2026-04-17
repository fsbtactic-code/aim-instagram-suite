/**
 * AIM Instagram Suite — Tool: aim_create_style
 * Интерактивный мастер создания кастомного стиля карусели.
 * Работает как многошаговый опрос через Claude с выбором вариантов.
 *
 * ШАГ 1 → Настроение / Вайб
 * ШАГ 2 → Цветовая схема
 * ШАГ 3 → Типографика
 * ШАГ 4 → Контентный стиль
 * ФИНАЛ → Генерация CSS + конфига стиля
 */
export interface CreateStyleInput {
    step?: 1 | 2 | 3 | 4 | 5;
    /** Шаг 1: настроение */
    mood?: 'luxury' | 'energetic' | 'minimal' | 'warm' | 'dark' | 'playful';
    /** Шаг 2: цветовая схема */
    colorBase?: 'dark' | 'light' | 'contrast';
    primaryHex?: string;
    secondaryHex?: string;
    /** Шаг 3: типографика */
    fontStyle?: 'serif' | 'modern' | 'bold' | 'handwritten' | 'mono';
    /** Шаг 4: подача контента */
    contentDensity?: 'minimal' | 'balanced' | 'rich';
    emojiUsage?: 'none' | 'subtle' | 'expressive';
    /** Финал */
    customWishes?: string;
    styleName?: string;
    /** Путь для сохранения стиля */
    saveToPath?: string;
}
export declare function createStyle(input: CreateStyleInput): Promise<string>;
//# sourceMappingURL=createStyle.d.ts.map