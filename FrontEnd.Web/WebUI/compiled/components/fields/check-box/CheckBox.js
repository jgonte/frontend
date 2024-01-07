import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import isUndefinedOrNull from "../../../utils/isUndefinedOrNull";
import DisplayableField from "../DisplayableField";
export default class CheckBox extends DisplayableField {
    static getFieldType() {
        return DataTypes.Boolean;
    }
    render() {
        const { name, value, disabled } = this;
        return html `
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
    beforeValueGet(value) {
        if (isUndefinedOrNull(value)) {
            return false;
        }
        else {
            return value;
        }
    }
}
defineCustomElement('gcs-check-box', CheckBox);
//# sourceMappingURL=CheckBox.js.map