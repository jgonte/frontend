import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import appCtrl from "../../services/appCtrl";
import { DataTypes } from "../../utils/data/DataTypes";
import { iconStyles } from "./Icon.styles";
const iconsCache = new Map();
export default class Icon extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, iconStyles);
    }
    static get properties() {
        return {
            name: {
                type: DataTypes.String,
                required: true
            }
        };
    }
    async render() {
        const { name } = this;
        if (name === undefined) {
            return null;
        }
        const { iconsPath } = appCtrl;
        if (iconsPath === undefined) {
            throw new Error('Path to the icons has not been configured');
        }
        const iconPath = `${iconsPath}${typeof name === 'function' ? name() : name}.svg`;
        let svg = undefined;
        if (iconsCache.has(iconPath)) {
            svg = iconsCache.get(iconPath);
        }
        else {
            const response = await fetch(iconPath);
            svg = await response.text();
            if (svg.match(/script/i) ||
                svg.match(/onerror/i)) {
                throw new Error(`Potencial XSS threat in file: ${iconPath}`);
            }
            iconsCache.set(iconPath, svg);
        }
        return html([svg]);
    }
}
defineCustomElement('gcs-icon', Icon);
//# sourceMappingURL=Icon.js.map