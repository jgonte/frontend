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
        return html `<div class="container">
            <span id="trigger">
                <slot name="trigger"></slot>
            </span>       
            <span id="content">
                <slot name="content"></slot>
            </span>
        </div>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        window.addEventListener('resize', () => this.handleResize());
    }
    didMountCallback() {
        this._positionContent();
    }
    didUpdateCallback() {
        this._positionContent();
    }
    handleResize() {
        this._positionContent();
    }
    _positionContent() {
        const trigger = this.document.getElementById("trigger");
        const content = this.document.getElementById("content");
        const p = this.getFittingPosition(trigger, content, this.position);
        applyClasses(content, {
            'top': p === 'top',
            'bottom': p === 'bottom',
            'left': p === 'left',
            'right': p === 'right',
        });
    }
    getFittingPosition(trigger, content, pos) {
        const { clientWidth, clientHeight } = document.documentElement;
        const { x: triggerX, y: triggerY, height: triggerHeight, width: triggerWidth } = trigger.getBoundingClientRect();
        const { height: contentHeight, width: contentWidth } = content.getBoundingClientRect();
        switch (pos) {
            case 'top':
                {
                    pos = triggerY < triggerHeight ? 'bottom' : 'top';
                }
                break;
            case 'bottom':
                {
                    pos = triggerY + triggerHeight + contentHeight > clientHeight ? 'top' : 'bottom';
                }
                break;
            case 'left':
                {
                    pos = triggerX < triggerWidth ? 'right' : 'left';
                }
                break;
            case 'right':
                {
                    pos = triggerX + triggerWidth + contentWidth > clientWidth ? 'left' : 'right';
                }
                break;
        }
        return pos;
    }
}
defineCustomElement('gcs-tool-tip', ToolTip);
//# sourceMappingURL=ToolTip.js.map