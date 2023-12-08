import CustomElement from "../../custom-element/CustomElement";
import { DataTypes } from "../../utils/data/DataTypes";
import RequiredValidator from "../../utils/validation/validators/field/RequiredValidator";
import Validatable from "../mixins/validatable/Validatable";
export const changeEvent = "changeEvent";
export const fieldAddedEvent = "fieldAddedEvent";
function getNewValue(input) {
    switch (input.type) {
        case 'checkbox': return input.checked;
        case 'date': return new Date(input.value);
        case 'file':
            {
                const { files } = input;
                if (files === null ||
                    files.length === 0) {
                    return null;
                }
                if (input.multiple === true) {
                    return Array.from(files).map(f => {
                        return {
                            name: f.name,
                            type: f.type,
                            size: f.size,
                            content: URL.createObjectURL(f)
                        };
                    });
                }
                else {
                    const f = files[0];
                    return {
                        name: f.name,
                        type: f.type,
                        size: f.size,
                        content: URL.createObjectURL(f)
                    };
                }
            }
        default: return input.value;
    }
}
export default class Field extends Validatable(CustomElement) {
    static dataFieldType = DataTypes.String;
    _tempValue;
    isField = true;
    static get properties() {
        return {
            name: {
                type: DataTypes.String,
                required: true
            },
            value: {
                type: [
                    DataTypes.String,
                    DataTypes.Object
                ],
                beforeSet: function (value) {
                    if (this.beforeValueSet !== undefined) {
                        return this.beforeValueSet(value);
                    }
                    return value;
                },
                afterChange: function (value, oldValue) {
                    this.onValueChanged?.(value, oldValue);
                },
                reflect: true
            },
            required: {
                type: DataTypes.Boolean,
                inherit: true,
                reflect: true
            }
        };
    }
    attributeChangedCallback(attributeName, oldValue, newValue) {
        super.attributeChangedCallback?.(attributeName, oldValue, newValue);
        if (attributeName === 'required') {
            if (newValue !== "false") {
                if (!this.hasRequiredValidator()) {
                    const { validators = [] } = this;
                    this.validators = [...validators, new RequiredValidator()];
                }
            }
            else {
                if (this.hasRequiredValidator()) {
                    const { validators } = this;
                    const requiredValidator = validators.filter((v) => v instanceof RequiredValidator)[0];
                    if (requiredValidator !== undefined) {
                        const index = validators.indexOf(requiredValidator);
                        validators.splice(index, 1);
                        this.validators = validators;
                    }
                }
            }
        }
        super.attributeChangedCallback(attributeName, oldValue, newValue);
    }
    hasRequiredValidator() {
        return this.validators.filter((v) => v instanceof RequiredValidator).length > 0;
    }
    didAdoptChildCallback(parent, child) {
        super.didAdoptChildCallback?.(parent, child);
        if (child !== this) {
            return;
        }
        this.dispatchCustomEvent(fieldAddedEvent, {
            field: child
        });
    }
    handleBlur() {
    }
    handleInput(event) {
        let v = getNewValue(event.target);
        if (this.beforeValueSet !== undefined) {
            v = this.beforeValueSet(v);
        }
        this._tempValue = v;
        this.validate();
    }
    createValidationContext() {
        const label = this.getLabel();
        const value = this._tempValue ?? this.value;
        return {
            field: this,
            dataProvider: this.form,
            label,
            value,
            warnings: [],
            errors: []
        };
    }
    _label;
    getLabel() {
        if (this._label === undefined) {
            const { adoptingParent } = this;
            const lt = Array.from(adoptingParent.children)
                .filter(c => c.getAttribute('slot') === 'label');
            switch (lt.length) {
                case 0:
                    {
                    }
                    break;
                case 1:
                    {
                        this._label = lt[0];
                    }
                    break;
                default: throw new Error('Only one element can have the attribute of slot=label in the Field');
            }
        }
        const cachedLabel = this._label;
        if (cachedLabel === undefined) {
            return "This field";
        }
        return cachedLabel.innerHTML;
    }
    handleChange() {
        const oldValue = this.value;
        this.value = this._tempValue;
        this._tempValue;
        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue,
            newValue: this.value
        });
    }
    acceptChanges() {
        this._initialValue = this.value;
    }
}
//# sourceMappingURL=Field.js.map