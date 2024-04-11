import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import { fieldAddedEvent } from "../../fields/Field";
import { cellEditorStyles } from "./CellEditor.styles";
export default class CellEditor extends CustomElement {
    _field;
    static get styles() {
        return cellEditorStyles;
    }
    static get properties() {
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
            }
        };
    }
    static get state() {
        return {
            editing: {
                value: false
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener("keydown", this.handleKeyDown);
        this.addEventListener(fieldAddedEvent, this.handleFieldAdded);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener("keydown", this.handleKeyDown);
        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded);
    }
    acceptChanges() {
        if (this.editing === false) {
            return;
        }
        const { _field } = this;
        if (_field) {
            _field.handleChange();
            this.value = _field.value;
        }
        this.editing = false;
    }
    rejectChanges() {
        this.editing = false;
    }
    handleFieldAdded(event) {
        const { field } = event.detail;
        this._field = field;
    }
    render() {
        const { value, editing } = this;
        const v = typeof value === "function" ?
            value() :
            value;
        if (editing == false) {
            return html `${v}`;
        }
        else {
            return this.renderField(v);
        }
    }
    renderField(value) {
        switch (this.type) {
            case "string": return html `
<gcs-text-field
    name=${this.name}
    value=${value}
>
</gcs-text-field>`;
            case "number": return html `
<gcs-number-field
    name=${this.name}
    value=${value}
>
</gcs-number-field>`;
            default: throw new Error(`Not implemented for type: ${this.type}`);
        }
    }
}
defineCustomElement('gcs-cell-editor', CellEditor);
//# sourceMappingURL=CellEditor.js.map