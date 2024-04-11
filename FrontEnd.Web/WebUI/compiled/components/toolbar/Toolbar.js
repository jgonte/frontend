import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { toolbarStyles } from "./Toolbar.styles";
export default class ToolBar extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, toolbarStyles);
    }
    render() {
        return html `
<span class="item">
    <slot name="icon"></slot>
</span> 
<span class="item">
    <slot name="title"></slot>
</span>
<span class="item">
    <slot name="tools"></slot>
</span>`;
    }
}
defineCustomElement('gcs-toolbar', ToolBar);
//# sourceMappingURL=Toolbar.js.map