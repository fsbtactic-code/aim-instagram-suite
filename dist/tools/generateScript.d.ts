/**
 * AIM VideoLens — Tool: aim_generate_script
 * Кража структуры: адаптация успешного контента под новую тему.
 * Пайплайн: Чтение .md референса → LLM генерирует таблицу сценария
 */
export interface GenerateScriptInput {
    referenceMdPath: string;
    targetTopic: string;
}
export declare function generateScript(input: GenerateScriptInput): Promise<string>;
//# sourceMappingURL=generateScript.d.ts.map