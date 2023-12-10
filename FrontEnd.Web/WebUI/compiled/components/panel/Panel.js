import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import Sizable from "../mixins/sizable/Sizable";
import { panelStyles } from "./Panel.styles";
export default class Panel extends Sizable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, panelStyles);
    }
    render() {
        return html `
            <div id=header>
                <slot name="header"></slot>
            </div>
            <div id=body>
                <slot name="body"></slot>
            </div>
            <div id=footer>
                <slot name="footer"></slot>
            </div>
        `;
    }
}
defineCustomElement('gcs-panel', Panel);
//# sourceMappingURL=Panel.js.map