import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import css from "../../../custom-element/styles/css";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { KeyNames } from "../../../utils/KeyNames";
import { DataTypes } from "../../../utils/data/DataTypes";
import CellEditor from "../../editors/cell/CellEditor";
import labelAlign from "../../form/labelAlign";
import labelWidth from "../../form/labelWidth";
import Clickable from "../../mixins/clickable/Clickable";
import { propertyGridRowStyles } from "./PropertyGridRow.styles";

export default class PropertyGridRow extends
    Clickable(
        CustomElement
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, propertyGridRowStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
            * The label of the property grid row
            */
            label: {
                type: DataTypes.String
            },

            /**
             * The name of the field
             */
            name: {
                type: DataTypes.String,
                required: true
            },

            /**
             * The type of the field
             */
            type: {
                type: DataTypes.String,
                required: true
            },

            /**
             * The value of the cell
             */
            value: {
                type: DataTypes.String
            },

            /**
             * The alignment of the label
             */
            labelAlign,

            /**
             * The width of the labels of the form
             */
            labelWidth,
        };
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener("keydown", this.handleKeyDown);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown(event: KeyboardEvent) {

        switch (event.key) {

            case KeyNames.Enter:
            case KeyNames.Tab:
                {
                    const cellEditor = (this.document as ShadowRoot).getElementById("cell-editor") as CellEditor;

                    cellEditor.acceptChanges();
                }
                break;
            case KeyNames.Backspace:
                {
                    // Do nothing
                }
                break;
            default:
                {
                    const printableRegex = /^[\x20-\x7E]$/;

                    if (!printableRegex.test(event.key)) { // Keep editing for printable characters

                        const cellEditor = (this.document as ShadowRoot).getElementById("cell-editor") as CellEditor;

                        cellEditor.rejectChanges();
                    }
                }
                break;
        }
    }

    render(): NodePatchingData {

        const {
            label,
            name,
            type,
            value,
            labelAlign,
            labelWidth
        } = this;

        const labelContainerStyle = css`flex: 0 0 ${labelWidth};`;

        const labelStyle = css`justify-content: ${labelAlign};`;

        return html`
<span id="label-container" style=${labelContainerStyle}>
    <span id="label" style=${labelStyle}>
        <gcs-localized-text>${label}</gcs-localized-text>
    </span>
</span>
<span style="flex: auto; border: var(--gcs-border-width) solid lightgrey; border-radius: var(--gcs-border-radius);">
    <gcs-cell-editor 
        id="cell-editor"
        name=${name}
        type=${type}
        value=${value}>
    </gcs-cell-editor>
</span>`;
    }

    handleClick() {

        const cellEditor = (this.document as ShadowRoot).getElementById("cell-editor") as CellEditor;

        cellEditor.editing = true;
    }
}

defineCustomElement('gcs-property-grid-row', PropertyGridRow);