import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
import { accordionStyles } from "./Accordion.styles";
export default class Accordion extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, accordionStyles);
    }
    static get properties() {
        return {
            collapsed: {
                type: DataTypes.Boolean,
                value: false,
                reflect: true,
                afterUpdate: function () {
                    const content = this.document.getElementById('content');
                    if (this.collapsed === true) {
                        content.style.maxHeight = '0';
                    }
                    else {
                        content.style.maxHeight = `${content.scrollHeight}px`;
                    }
                }
            }
        };
    }
    constructor() {
        super();
        this.toggleContentVisibility = this.toggleContentVisibility.bind(this);
    }
    render() {
        return html `
<gcs-button id="header" click=${this.toggleContentVisibility}>
    <slot name="label"></slot>
    ${this.renderExpanderIcon()}
</gcs-button>
<div id="content">
    <slot name="content"></slot>
</div>`;
    }
    toggleContentVisibility(evt) {
        evt.stopPropagation();
        this.collapsed = !this.collapsed;
    }
    renderExpanderIcon() {
        return this.collapsed === true ?
            html `<gcs-icon name="chevron-down"></gcs-icon>` :
            html `<gcs-icon name="chevron-up"></gcs-icon>`;
    }
}
defineCustomElement('gcs-accordion', Accordion);
//# sourceMappingURL=Accordion.js.map