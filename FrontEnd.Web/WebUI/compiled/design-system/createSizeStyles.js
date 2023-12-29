import css from "../custom-element/styles/css";
import cssVariables from "./css-variables";
export const sizes = ['large', 'medium', 'small'];
export default function createSizeStyles(ctor) {
    const styles = [];
    styles.push(css `
:host {
    min-height: var(${cssVariables.get("min-height")});
}`);
    if (![
        "CloseTool",
        "SorterTool",
        "ExpanderTool"
    ].includes(ctor.name)) {
        styles.push(css `
:host {
    margin: var(${cssVariables.get("margin")});
}`);
    }
    sizes.forEach(size => {
        switch (ctor.name) {
            case "TextField":
                {
                    styles.push(css `
:host([size='${size}']) input[type='text'] {
    font-size: var(${cssVariables.get("font-size")}${size});
}`);
                }
                break;
            case "Icon":
                {
                    styles.push(css `
:host([size='${size}']) {
    font-size: var(${cssVariables.get("icon-size")}${size});
}`);
                }
                break;
            default:
                {
                    styles.push(css `
:host([size='${size}']) {
    font-size: var(${cssVariables.get("font-size")}${size});
}`);
                }
                break;
        }
    });
    return css `${styles.join('\n')}`;
}
//# sourceMappingURL=createSizeStyles.js.map