import isUndefinedOrNull from "../../../isUndefinedOrNull";
import SingleValueFieldValidator from "./SingleValueFieldValidator";
export default class MinLengthValidator extends SingleValueFieldValidator {
    minLength;
    constructor(options) {
        super(`{{label}} is cannot have less than ${options.minLength} characters`, options);
        this.minLength = options.minLength;
    }
    validate(context) {
        const { label, value } = context;
        const { minLength } = this;
        const valid = isUndefinedOrNull(value) ||
            value.length >= minLength;
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}
//# sourceMappingURL=MinLengthValidator.js.map