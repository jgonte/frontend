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
            <div id=header>${this.renderHeader()}</div>
            <div id=body>${this.renderBody()}</div>
            <div id=footer>${this.renderFooter()}</div>
        `;
    }
    renderHeader() {
        return html `<slot name="header"></slot>`;
    }
    renderBody() {
        return html `<slot name="body"></slot>`;
    }
    renderFooter() {
        return html `<slot name="footer"></slot>`;
    }
}
defineCustomElement('gcs-panel', Panel);
//# sourceMappingURL=Panel.js.map