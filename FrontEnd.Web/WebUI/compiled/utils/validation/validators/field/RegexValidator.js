import SingleValueFieldValidator from "./SingleValueFieldValidator";
export default class RegexValidator extends SingleValueFieldValidator {
    _regex;
    constructor(message, options) {
        super(message, options);
        this._regex = options.regex;
    }
    validate(context) {
        const { label, value } = context;
        if (value === undefined) {
            return true;
        }
        const valid = this._regex.test(value);
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}
//# sourceMappingURL=RegexValidator.js.map