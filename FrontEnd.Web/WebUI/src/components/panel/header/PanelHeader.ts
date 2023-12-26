import Closable from "../../mixins/closable/Closable";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";

export default class PanelHeader extends
    Closable(
        CustomElement
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the icon to render if provided
             */
            iconName: {
                attribute: 'icon-name',
                type: [
                    DataTypes.String
                ]
            }
        };
    }

    render(): NodePatchingData {

        return html`
<gcs-row>
    ${this.renderIcon()}
    <span slot="middle">
        <slot name="title"></slot>
    </span>
    <span slot="end">
        <slot name="tools"></slot>
    </span>
    ${this.renderCloseTool()}
</gcs-row>`;
    }

    renderIcon() {

        const {
            iconName
        } = this;

        if (iconName) {

            return html`
                <gcs-icon 
                    slot="start" 
                    name=${this.iconName}
                >
                </gcs-icon>`;
        }
        else {

            return null;
        }

    }
}

defineCustomElement('gcs-panel-header', PanelHeader);