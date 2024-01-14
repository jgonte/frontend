import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import applyClasses from "../../custom-element/styles/applyClasses";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import { toolTipStyles } from "./ToolTip.styles";

export default class ToolTip extends CustomElement {

    static get styles(): string {

        return toolTipStyles;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The preferred position of the tool tip
             */
            position: {
                type: DataTypes.String,
                value: 'bottom',
                options: ['top', 'bottom', 'left', 'right']
            }
        };
    }

    render(): NodePatchingData {

        return html`
<span id="trigger">
    <slot name="trigger"></slot>
</span>       
<span id="content">
    <slot name="content"></slot>
</span>`;
    }

    connectedCallback(): void {

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

    private _positionContent() {

        const {
            position
        } = this;

        const content = (this.document as ShadowRoot).getElementById("content") as HTMLElement;

        let p = position;

        const contentView = this.findAdoptingParent((p: { nodeName: string; }) => p.nodeName === "GCS-CONTENT-VIEW");

        const parentViewRect = contentView !== null ?
            contentView.getBoundingClientRect() :
            {
                left: window.screenLeft,
                right: window.innerWidth,
                top: window.screenTop,
                bottom: window.innerHeight  
            };

        const rect = content.getBoundingClientRect();

        // Reverse the position (top/bottom) (left/right) and viceversa if there is overflow
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