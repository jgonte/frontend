import Disableable from "../mixins/disableable/Disableable";
import Field from "./Field";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { displayableFieldStyles } from "./DisplayableField.styles";
import { DataTypes } from "../../utils/data/DataTypes";
import areEquivalent from "../../utils/areEquivalent";
import { validationEvent } from "../mixins/validatable/Validatable";
export const inputEvent = "inputEvent";
export default class DisplayableField extends Disableable(Field) {
    _initialValue = null;
    static get styles() {
        return mergeStyles(super.styles, displayableFieldStyles);
    }
    static get properties() {
        return {
            inputStyle: {
                attribute: 'input-style',
                type: DataTypes.String
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        this._initialValue = this.value;
    }
    handleInput(event) {
        super.handleInput?.(event);
        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: !areEquivalent(this._initialValue, this._tempValue)
        });
    }
    get isModified() {
        return this.value !== this._initialValue;
    }
    acceptChanges() {
        this._initialValue = this.value;
        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: false
        });
    }
    reset() {
        this.value = this._initialValue;
        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: false
        });
    }
    clearValidation() {
        this.dispatchCustomEvent(validationEvent, {
            warnings: [],
            errors: []
        });
    }
}
//# sourceMappingURL=DisplayableField.js.map