import createTemplateString from "./createTemplateString";
export default function createTemplate(strings) {
    const { templateString, keyIndex } = createTemplateString(strings);
    const template = document.createElement('template');
    template.innerHTML = templateString;
    return {
        templateString,
        template,
        keyIndex
    };
}
//# sourceMappingURL=createTemplate.js.map