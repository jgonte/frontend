import RecordValidator from "./RecordValidator";
export default class CompareValidator extends RecordValidator {
    _propertyToCompare;
    _operator;
    constructor(options) {
        super("{{label}} must match", options);
        this._propertyToCompare = options.propertyToCompare;
        this._operator = options.operator || 1;
    }
    validate(context) {
        const { _propertyToCompare, _operator } = this;
        const data = this.getData(context);
        const { value } = context;
        const valueToCompare = data[_propertyToCompare];
        const valid = this._compare(value, valueToCompare, _operator);
        if (!valid) {
            this.emitErrors(context, {
                value,
                propertyToCompare: _propertyToCompare,
                valueToCompare,
                operator: _operator
            });
        }
        return valid;
    }
    _compare(valueToValidate, valueToCompare, operator) {
        switch (operator) {
            case 1: return valueToValidate === valueToCompare;
            case 2: return valueToValidate !== valueToCompare;
            case 3: return valueToValidate > valueToCompare;
            case 4: return valueToValidate >= valueToCompare;
            case 5: return valueToValidate < valueToCompare;
            case 6: return valueToValidate <= valueToCompare;
            default: throw new Error(`Invalid comparison operator: ${operator}`);
        }
    }
}
//# sourceMappingURL=CompareValidator.js.map