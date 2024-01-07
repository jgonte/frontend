import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import isUndefinedOrNull from "../../../utils/isUndefinedOrNull";
import DisplayableField from "../DisplayableField";

export default class CheckBox extends DisplayableField {

    static getFieldType(): DataTypes {

        return DataTypes.Boolean;
    }

    render(): NodePatchingData {

        const {
            name,
            value,
            //required,
            disabled
        } = this;

        return html`
<input
    type="checkbox"
    name=${name}
    checked=${value}
    onInput=${event => this.handleInput(event)}
    onChange=${event => this.handleChange(event)}
    onBlur=${() => this.handleBlur()}
    disabled=${disabled}
/>`;
    }

    beforeValueGet(value: unknown): unknown {

        if (isUndefinedOrNull(value)) {

            return false;
        }
        else {

            return value;
        }
    }
}

defineCustomElement('gcs-check-box', CheckBox);