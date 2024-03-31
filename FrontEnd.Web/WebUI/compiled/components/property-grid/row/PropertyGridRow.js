import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import css from "../../../custom-element/styles/css";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { KeyNames } from "../../../utils/KeyNames";
import { DataTypes } from "../../../utils/data/DataTypes";
import labelAlign from "../../form/labelAlign";
import labelWidth from "../../form/labelWidth";
import Clickable from "../../mixins/clickable/Clickable";
import { propertyGridRowStyles } from "./PropertyGridRow.styles";
export default class PropertyGridRow extends Clickable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, propertyGridRowStyles);
    }
    static get properties() {
        return {
            label: {
                type: DataTypes.String
            },
            name: {
                type: DataTypes.String,
                required: true
            },
            type: {
                type: DataTypes.String,
                required: true
            },
            value: {
                type: DataTypes.String
            },
            labelAlign,
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
    handleKeyDown(event) {
        switch (event.key) {
            case KeyNames.Enter:
            case KeyNames.Tab:
                {
                    const cellEditor = this.document.getElementById("cell-editor");
                    cellEditor.acceptChanges();
                }
                break;
            case KeyNames.Backspace:
                {
                }
                break;
            default:
                {
                    const printableRegex = /^[\x20-\x7E]$/;
                    if (!printableRegex.test(event.key)) {
                        const cellEditor = this.document.getElementById("cell-editor");
                        cellEditor.rejectChanges();
                    }
                }
                break;
        }
    }
    render() {
        const { label, name, type, value, labelAlign, labelWidth } = this;
        const labelContainerStyle = css `flex: 0 0 ${labelWidth};`;
        const labelStyle = css `justify-content: ${labelAlign};`;
        return html `
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
        const cellEditor = this.document.getElementById("cell-editor");
        cellEditor.editing = true;
    }
}
defineCustomElement('gcs-property-grid-row', PropertyGridRow);
//# sourceMappingURL=PropertyGridRow.js.map