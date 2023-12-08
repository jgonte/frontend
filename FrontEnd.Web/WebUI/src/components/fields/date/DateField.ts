import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import isUndefinedOrNull from "../../../utils/isUndefinedOrNull";
import DisplayableField from "../DisplayableField";

function formatDate(value: Date) {

    return value.toLocaleDateString();
}

export default class DateField extends DisplayableField {

    static getFieldType(): DataTypes {

        return DataTypes.Date;
    }

    render(): NodePatchingData {

        const {
            name,
            value,
            //required,
            disabled
        } = this;

        return html`<input
            type="text"
            name=${name}
            value=${value !== undefined ? formatDate(value) : undefined}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }

    /**
     * Remove the time part if there is any
     * @param value 
     * @returns 
     */
    beforeValueSet(value: string): Date {

        const date = new Date(value);

        // Reset the time part
        date.setHours(0, 0, 0, 0);

        return date;
    }

    serializeValue() {

        const {
            value
        } = this;

        if (isUndefinedOrNull(value)){

            return null;
        }

        return (value as Date).toISOString();
    }
}

defineCustomElement('gcs-date-field', DateField);