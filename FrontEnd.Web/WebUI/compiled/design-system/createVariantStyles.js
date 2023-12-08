import css from "../custom-element/styles/css";
import cssVariables from "./css-variables";
export const variants = ['outlined', 'text', 'contained'];
function addOutlinedStyle(styles, kind, variant, innerSelector = '') {
    styles.push(css `
:host([kind='${kind}'][variant='${variant}']) ${innerSelector} { 
    color: var(${cssVariables.get("color")}${kind}); 
    background-color: var(${cssVariables.get("background-color")}${kind}); 
    border-color: var(${cssVariables.get("color")}${kind}); 
}`);
}
function addTextStyle(styles, kind, variant, innerSelector = '') {
    styles.push(css `
:host([kind='${kind}'][variant='${variant}']) ${innerSelector} { 
    color: var(${cssVariables.get("color")}${kind});
}`);
}
function addContainedStyle(styles, kind, variant, innerSelector = '') {
    styles.push(css `
:host([kind='${kind}'][variant='${variant}']) ${innerSelector} { 
    color: var(${cssVariables.get("color-contained")}${kind}); 
    background-color: var(${cssVariables.get("background-color-contained")}${kind}); 
}`);
}
export default function createVariantStyles(ctor, kind) {
    const styles = [];
    switch (ctor.name) {
        case "Button":
            {
                variants.forEach(variant => {
                    switch (variant) {
                        case 'outlined':
                            {
                                addOutlinedStyle(styles, kind, variant, 'button:not(disabled)');
                                styles.push(css `
:host([kind='${kind}'][variant='${variant}']) button:disabled { 
    color: var(${cssVariables.get("disabled-color")}); 
    background-color: var(${cssVariables.get("disabled-background-color")}); 
    border-color: var(${cssVariables.get("disabled-color")}); 
}`);
                            }
                            break;
                        case 'text':
                            {
                                addTextStyle(styles, kind, variant, 'button:not(disabled)');
                                styles.push(css `
:host([kind='${kind}'][variant='${variant}']) button:disabled { 
    color: var(${cssVariables.get("disabled-color")});
}`);
                            }
                            break;
                        case 'contained':
                            {
                                addContainedStyle(styles, kind, variant, 'button:not(disabled)');
                                styles.push(css `
:host([kind='${kind}'][variant='${variant}']) button:disabled { 
    color: var(${cssVariables.get("disabled-background-color")}); 
    background-color: var(${cssVariables.get("disabled-color")}); 
}`);
                            }
                            break;
                        default: throw new Error(`createVariantStyles not implemented for variant: '${variant}'`);
                    }
                });
            }
            break;
        default:
            {
                variants.forEach(variant => {
                    switch (variant) {
                        case 'outlined':
                            {
                                addOutlinedStyle(styles, kind, variant);
                            }
                            break;
                        case 'text':
                            {
                                addTextStyle(styles, kind, variant);
                            }
                            break;
                        case 'contained':
                            {
                                addContainedStyle(styles, kind, variant);
                            }
                            break;
                        default: throw new Error(`createVariantStyles not implemented for variant: '${variant}'`);
                    }
                });
            }
            break;
    }
    return css `${styles.join('\n')}`;
}
//# sourceMappingURL=createVariantStyles.js.map