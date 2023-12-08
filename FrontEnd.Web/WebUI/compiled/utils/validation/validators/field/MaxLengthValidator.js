import isUndefinedOrNull from "../../../isUndefinedOrNull";
import SingleValueFieldValidator from "./SingleValueFieldValidator";
export default class MaxLengthValidator extends SingleValueFieldValidator {
    maxLength;
    constructor(options) {
        super(`{{label}} is cannot have more than ${options.maxLength} characters`, options);
        this.maxLength = options.maxLength;
    }
    validate(context) {
        const { label, value } = context;
        const { maxLength } = this;
        const valid = isUndefinedOrNull(value) ||
            value.length <= maxLength;
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}
//# sourceMappingURL=MaxLengthValidator.js.map