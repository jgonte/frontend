import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import { validationEvent } from "../../mixins/validatable/Validatable";
import { formFieldStyles } from "./FormField.styles";
import css from "../../../custom-element/styles/css";
import labelAlign from "../labelAlign";
import labelWidth from "../labelWidth";
import { inputEvent } from "../../fields/DisplayableField";
export default class FormField extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, formFieldStyles);
    }
    static get properties() {
        return {
            labelAlign,
            labelWidth,
            required: {
                type: DataTypes.Boolean,
                reflect: true,
                value: false
            }
        };
    }
    static get state() {
        return {
            modified: {
                value: false
            },
            warnings: {
                value: []
            },
            errors: {
                value: []
            }
        };
    }
    render() {
        const { labelAlign, labelWidth, required, modified, warnings, errors } = this;
        const labelContainerStyle = css `min-width: 25ch; width: ${labelWidth};`;
        const labelStyle = css `justify-content: ${labelAlign};`;
        return html `
<div id="labeled-field">
    <span id="label-container" style=${labelContainerStyle}>
        <span id="label" style=${labelStyle}>
            <slot name="label"></slot>
        </span> 
        <span id="tools">
            <slot name="tools" id="tools-slot"></slot>
            <slot name="help"></slot>
            ${modified === true ?
            html `<gcs-modified-tip></gcs-modified-tip>`
            : null}
            ${required === true ?
            html `<gcs-required-tip></gcs-required-tip>`
            : null}
        </span>
    </span>
    <span id="field">
        <slot name="field"></slot>         
    </span>
</div>      
<gcs-validation-summary
    warnings=${warnings} 
    errors=${errors}>
</gcs-validation-summary>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(inputEvent, this.handleInput);
        this.addEventListener(validationEvent, this.handleValidation);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(inputEvent, this.handleInput);
        this.removeEventListener(validationEvent, this.handleValidation);
    }
    handleInput(event) {
        event.stopPropagation();
        const { modified } = event.detail;
        this.modified = modified;
    }
    handleValidation(event) {
        event.stopPropagation();
        const { warnings, errors } = event.detail;
        this.warnings = warnings;
        this.errors = errors;
    }
}
defineCustomElement('gcs-form-field', FormField);
//# sourceMappingURL=FormField.js.map