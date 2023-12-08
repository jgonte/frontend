import RegexValidator from "./RegexValidator";

export default class AntiXssValidator extends RegexValidator {

    constructor() {

        super("Potential XSS vulnerability", {

            regex: /[<>]/g
        });
    }
}