import SingleValueFieldValidator from "./SingleValueFieldValidator";
export default class RequiredValidator extends SingleValueFieldValidator {
    allowEmpty;
    constructor(options = {}) {
        super('{{label}} is required', options);
        this.allowEmpty = options.allowEmpty || false;
    }
    validate(context) {
        const { label, value } = context;
        let valid;
        valid = !(value === undefined || value === null);
        if (valid === true && this.allowEmpty === false) {
            valid = value !== '';
        }
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}
//# sourceMappingURL=RequiredValidator.js.map