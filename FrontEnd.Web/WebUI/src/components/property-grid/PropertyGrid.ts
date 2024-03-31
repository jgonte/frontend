import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { RenderReturnTypes } from "../../custom-element/mixins/metadata/types/IRenderable";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import labelAlign from "../form/labelAlign";
import labelWidth from "../form/labelWidth";
import Configurable from "../mixins/configurable/Configurable";
import { IComponentDescriptor } from "../mixins/configurable/models/IComponentDescriptor";
import { renderEmptyData } from "../mixins/data-holder/renderEmptyData";
import { propertyGridStyles } from "./PropertyGrid.styles";

export default class PropertyGrid extends
    Configurable(
        CustomElement
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, propertyGridStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The width of the labels of the form
             */
            labelWidth,

            /**
             * Label alignment
             */
            labelAlign,

            data: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ],
                defer: true
            }
        };
    }

    render(): RenderReturnTypes {

        return html`
<gcs-panel>
    ${this._renderLabel()}
    ${this._renderIcon()}
    ${this._renderBody()}
</gcs-panel>`;
    }

    configure(source: IComponentDescriptor) {

        this.source = source;
    }

    private _renderLabel() {

        return html`
<gcs-localized-text 
    slot="header"
>
    ${this.source.label || "Properties Grid"}
</gcs-localized-text>`;
    }

    private _renderIcon() {

        const {
            iconName,
        } = this.source;

        if (!iconName) {

            return null;
        }

        return html`
<gcs-icon 
    slot="header"
    name=${iconName}
>
</gcs-icon>`;
    }

    private _renderBody(): NodePatchingData[] | NodePatchingData {

        const {
            source,
            data,
            labelWidth,
            labelAlign
        } = this;

        const d = typeof data === "function" ?
            data() :
            data;

        if (!d) {

            return renderEmptyData('body');
        }
      
        const children = typeof source.children === "function" ?
            source.children() :
            source.children;

        return children.map((c: IComponentDescriptor) => html`
<gcs-property-grid-row 
    slot="body"
    label-width=${labelWidth} 
    label-align=${labelAlign} 
    label=${c.label}
    name=${c.name}
    type=${c.type || "string"}
    value=${d[c.name]} 
    key=${c.name}>
</gcs-property-grid-row>`);

    }

}

defineCustomElement('gcs-property-grid', PropertyGrid);