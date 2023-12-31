import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import { validationEvent } from "../../mixins/validatable/Validatable";
import { formFieldStyles } from "./FormField.styles";
import css from "../../../custom-element/styles/css";
import labelAlign from "../labelAlign";
import labelWidth from "../labelWidth";
import { inputEvent } from "../../fields/DisplayableField";

export default class FormField extends CustomElement {
    static get styles(): string {

        return mergeStyles(super.styles, formFieldStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The alignment of the label
             */
            labelAlign,

            /**
             * The width of the labels of the form
             */
            labelWidth,

            /** 
             * Whether the form field is required
             * If true it sets a field indicator as required and adds a required validator to the field
             */
            required: {
                type: DataTypes.Boolean,
                reflect: true,
                value: false
            }
        };
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            /**
             * Whether the field has been modified (Its value differs from the initial/loaded one)
             */
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

    render(): NodePatchingData {

        const {
            labelAlign,
            labelWidth,
            required,
            modified,
            warnings,
            errors
        } = this;

        const labelContainerStyle = css`min-width: 25ch; width: ${labelWidth};`;

        const labelStyle = css`justify-content: ${labelAlign};`;

        return html`
<div id="labeled-field">
    <span id="label-container" style=${labelContainerStyle}>
        <span id="label" style=${labelStyle}>
            <slot name="label"></slot>
        </span> 
        <span id="tools">
            <slot name="tools" id="tools-slot"></slot>
            <slot name="help"></slot>
            ${modified === true ?
                html`<gcs-modified-tip></gcs-modified-tip>`
                : null}
            ${required === true ?
                html`<gcs-required-tip></gcs-required-tip>`
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

        this.addEventListener(inputEvent, this.handleInput as EventListenerOrEventListenerObject);

        this.addEventListener(validationEvent, this.handleValidation as EventListenerOrEventListenerObject);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(inputEvent, this.handleInput as EventListenerOrEventListenerObject);

        this.removeEventListener(validationEvent, this.handleValidation as EventListenerOrEventListenerObject);
    }

    handleInput(event: CustomEvent): void {

        event.stopPropagation();

        const {
            modified
        } = event.detail;

        this.modified = modified;
    }

    handleValidation(event: CustomEvent): void {

        event.stopPropagation();

        const {
            warnings,
            errors
        } = event.detail;

        this.warnings = warnings;

        this.errors = errors;
    }
}

defineCustomElement('gcs-form-field', FormField);