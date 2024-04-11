import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import Field, { fieldAddedEvent } from "../../fields/Field";
import { cellEditorStyles } from "./CellEditor.styles";

export default class CellEditor extends CustomElement {

    private _field? : Field;
    
    static get styles(): string {

        return cellEditorStyles;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            name: {
                type: DataTypes.String,
                required: true
            },

            type: {
                type: DataTypes.String,
                required: true
            },

            value: {
                type: [
                    DataTypes.String,
                    DataTypes.Number,
                    DataTypes.Boolean,
                    DataTypes.BigInt,
                    DataTypes.Date,
                    DataTypes.Object,
                    DataTypes.Array,
                    DataTypes.Function
                ],
                defer: true,
                //required: true - it might not be provided while the cellEditor is not editing
            }
        };
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            editing: {
                value: false
            }
        };
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener("keydown", this.handleKeyDown);

        this.addEventListener(fieldAddedEvent, this.handleFieldAdded as EventListenerOrEventListenerObject);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener("keydown", this.handleKeyDown);

        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded as EventListenerOrEventListenerObject);
    }

    acceptChanges() {

        if (this.editing === false) {

            return;
        }

        const {
            _field
        } = this;

        if (_field) {

            _field.handleChange();

            this.value = _field.value;
        }

        this.editing = false;
    }

    rejectChanges() {

        this.editing = false;
    }

    handleFieldAdded(event: CustomEvent) {

        const {
            field
        } = (event as CustomEvent).detail;

        this._field = field;
    }

    render(): NodePatchingData | null {

        const {
            value,
            editing 
        }= this;

        const v = typeof value === "function"?
            value():
            value;

        if (editing == false) {

            return html`${v}`;
        }
        else {

            return this.renderField(v);
        }

    }

    renderField(value: unknown): NodePatchingData {

        switch (this.type) {
            case "string": return html`
<gcs-text-field
    name=${this.name}
    value=${value as string}
>
</gcs-text-field>`;

            case "number": return html`
<gcs-number-field
    name=${this.name}
    value=${value as string}
>
</gcs-number-field>`;

            default: throw new Error(`Not implemented for type: ${this.type}`);
        }
    }
}

defineCustomElement('gcs-cell-editor', CellEditor);