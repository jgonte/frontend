import SingleValueFieldValidator from "./SingleValueFieldValidator";
export default class CustomSingleValueFieldValidator extends SingleValueFieldValidator {
    validateFcn;
    constructor(message, options) {
        super(message, options);
        this.validateFcn = options.validateFcn;
    }
    validate(context) {
        const { label, value } = context;
        const valid = this.validateFcn.call(this, value);
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}
//# sourceMappingURL=CustomSingleValueFieldValidator.js.map