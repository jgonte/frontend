import Collapsible from "../mixins/collapsible/Collapsible";
import CustomElement from "../../custom-element/CustomElement";
import { panelStyles } from "./Panel.styles";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
export default class Panel extends Collapsible(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, panelStyles);
    }
    render() {
        return html `
<div id=header>
    <slot name="header"></slot>
</div>
<div id="collapsible-content">
    <div id=body>
        <slot name="body"></slot>
    </div>
    <div id=footer>
        <slot name="footer"></slot>
    </div>
</div>`;
    }
    getCollapsibleContent() {
        return this.document.getElementById('collapsible-content');
    }
}
defineCustomElement('gcs-panel', Panel);
//# sourceMappingURL=Panel.js.map