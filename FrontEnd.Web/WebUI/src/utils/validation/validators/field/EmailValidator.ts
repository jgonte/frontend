import RegexValidator, { RegexValidatorOptions } from "./RegexValidator";

export default class EmailValidator extends RegexValidator {

    constructor(options: RegexValidatorOptions = { 
        regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, //https://www.w3resource.com/javascript/form/email-validation.php
    }) {

        super('{{label}} is not a valid email', options);
    }
}