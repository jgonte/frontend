import css from "../../../custom-element/styles/css";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import cssVariables from "../../../design-system/css-variables";
import createVariantStyles from "../../../design-system/createVariantStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
const kinds = ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger'];
function createKindStyles(ctor) {
    const styles = [];
    switch (ctor.name) {
        case "LocalizedText":
        case "Icon":
            {
            }
            break;
        case "Button":
        case "Badge":
        case "Pill":
        case "CloseTool":
        case "ExpanderTool":
        case "SorterTool":
            {
                kinds.forEach(kind => styles.push(createVariantStyles(ctor, kind)));
            }
            break;
        default:
            {
                console.warn(`Setting default kind styles for element: '${ctor.name}'`);
                kinds.forEach(kind => styles.push(css `
:host([kind='${kind}']) { 
    color: var(${cssVariables.get("color")}${kind}); 
    background-color: var(${cssVariables.get("background-color")}${kind}); 
}`));
            }
            break;
    }
    return css `${styles.join('\n')}`;
}
export default function Kind(Base) {
    return class KindMixin extends Base {
        static get properties() {
            return {
                kind: {
                    type: DataTypes.String,
                    options: kinds,
                    inherit: true,
                    reflect: true,
                }
            };
        }
        static get styles() {
            return mergeStyles(super.styles, createKindStyles(this));
        }
    };
}
//# sourceMappingURL=Kind.js.map