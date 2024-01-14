import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import applyClasses from "../../custom-element/styles/applyClasses";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
import { toolTipStyles } from "./ToolTip.styles";
export default class ToolTip extends CustomElement {
    static get styles() {
        return toolTipStyles;
    }
    static get properties() {
        return {
            position: {
                type: DataTypes.String,
                value: 'bottom',
                options: ['top', 'bottom', 'left', 'right']
            }
        };
    }
    render() {
        return html `
<span id="trigger">
    <slot name="trigger"></slot>
</span>       
<span id="content">
    <slot name="content"></slot>
</span>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener('mouseenter', this.positionContent);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener('mouseenter', this.positionContent);
    }
    positionContent() {
        setTimeout(() => this._positionContent(), 100);
    }
    _positionContent() {
        const { position } = this;
        const content = this.document.getElementById("content");
        let p = position;
        const contentView = this.findAdoptingParent((p) => p.nodeName === "GCS-CONTENT-VIEW");
        const parentViewRect = contentView !== null ?
            contentView.getBoundingClientRect() :
            {
                left: window.screenLeft,
                right: window.innerWidth,
                top: window.screenTop,
                bottom: window.innerHeight
            };
        const rect = content.getBoundingClientRect();
        switch (position) {
            case 'top':
                {
                    if (rect.top < parentViewRect.top) {
                        p = 'bottom';
                    }
                }
                break;
            case 'bottom':
                {
                    if (rect.bottom > parentViewRect.bottom) {
                        p = 'top';
                    }
                }
                break;
            case 'left':
                {
                    if (rect.left < parentViewRect.left) {
                        p = 'right';
                    }
                }
                break;
            case 'right':
                {
                    if (rect.right > parentViewRect.right) {
                        p = 'left';
                    }
                }
                break;
            default: throw new Error(`Unknown position: ${position}`);
        }
        applyClasses(content, {
            'top': p === 'top',
            'bottom': p === 'bottom',
            'left': p === 'left',
            'right': p === 'right',
        });
    }
}
defineCustomElement('gcs-tool-tip', ToolTip);
//# sourceMappingURL=ToolTip.js.map