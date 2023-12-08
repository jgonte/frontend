import { DynamicObject } from "./types";
export interface TemplateResult {
    text?: string;
    keysNotInData: string[];
}
export default function template(text: string, data?: DynamicObject): TemplateResult;
