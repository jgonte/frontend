import createTemplateString, { TemplateStringData } from "./createTemplateString";

/**
 * The data returned by the createTemplate function
 */
interface TemplateData extends TemplateStringData {

    template: HTMLTemplateElement;
}

/**
 * Creates an HTML template element
 * @param strings The markup code together with interpolated values
 * @returns 
 */
export default function createTemplate(strings: TemplateStringsArray): TemplateData {

    const {
        templateString,
        keyIndex
    } = createTemplateString(strings);

    const template: HTMLTemplateElement = document.createElement('template');

    template.innerHTML = templateString;

    return {
        templateString,
        template,
        keyIndex
    };
}

