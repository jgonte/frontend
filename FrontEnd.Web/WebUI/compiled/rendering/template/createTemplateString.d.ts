export interface TemplateStringData {
    templateString: string;
    keyIndex?: number;
}
export default function createTemplateString(strings: TemplateStringsArray): TemplateStringData;
