import { TemplateStringData } from "./createTemplateString";
interface TemplateData extends TemplateStringData {
    template: HTMLTemplateElement;
}
export default function createTemplate(strings: TemplateStringsArray): TemplateData;
export {};
