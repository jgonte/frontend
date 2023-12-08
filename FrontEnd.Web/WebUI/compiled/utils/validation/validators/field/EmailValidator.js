import RegexValidator from "./RegexValidator";
export default class EmailValidator extends RegexValidator {
    constructor(options = {
        regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    }) {
        super('{{label}} is not a valid email', options);
    }
}
//# sourceMappingURL=EmailValidator.js.map