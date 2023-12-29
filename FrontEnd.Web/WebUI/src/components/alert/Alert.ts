import Closable from "../mixins/closable/Closable";
import Nuanced from "../Nuanced";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { alertStyles } from "./Alert.styles";
import { DataTypes } from "../../utils/data/DataTypes";

export default class Alert extends
    Closable(
        Nuanced
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, alertStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * Whether to show the icon
             */
            showIcon: {
                attribute: 'show-icon',
                type: DataTypes.Boolean,
                value: true
            }
        };
    }

    render(): NodePatchingData {

        return html`
<span class="item">
    ${this._renderIcon()}
</span>
<span class="item middle">
    <slot></slot>
</span>
<span class="item">
    ${this.renderCloseTool()}
</span>
`;
    }

    private _renderIcon(): NodePatchingData | null {

        const {
            showIcon,
        } = this;

        if (showIcon !== true) {

            return html`<span></span>`;
        }

        return html`
<gcs-icon 
    name=${this._getIconName()}
>
</gcs-icon>`;
    }

    private _getIconName(): string {

        switch (this.kind) {

            case "success": return "check-circle-fill";
            case "warning": return "exclamation-circle-fill";
            case "error": return "exclamation-circle-fill";
            default: return "info-circle-fill";
        }
    }
}

defineCustomElement('gcs-alert', Alert);