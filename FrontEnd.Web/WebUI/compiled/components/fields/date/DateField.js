import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import isUndefinedOrNull from "../../../utils/isUndefinedOrNull";
import DisplayableField from "../DisplayableField";
function formatDate(value) {
    return value.toLocaleDateString();
}
export default class DateField extends DisplayableField {
    static getFieldType() {
        return DataTypes.Date;
    }
    render() {
        const { name, value, disabled } = this;
        return html `<input
            type="text"
            name=${name}
            value=${value !== undefined ? formatDate(value) : undefined}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
    beforeValueSet(value) {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        return date;
    }
    serializeValue() {
        const { value } = this;
        if (isUndefinedOrNull(value)) {
            return null;
        }
        return value.toISOString();
    }
}
defineCustomElement('gcs-date-field', DateField);
//# sourceMappingURL=DateField.js.map