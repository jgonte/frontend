import SingleValueFieldValidator from "./SingleValueFieldValidator";
export default class RangeValidator extends SingleValueFieldValidator {
    minValue;
    maxValue;
    constructor(options = {}) {
        super('{{label}} is out of range (between {{minValue}} to {{maxValue}})', options);
        this.minValue = options.minValue || 0;
        this.maxValue = options.maxValue || Number.MAX_VALUE;
    }
    validate(context) {
        const { label, value } = context;
        const { minValue, maxValue } = this;
        const valid = value >= minValue &&
            value <= maxValue;
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}
//# sourceMappingURL=RangeValidator.js.map