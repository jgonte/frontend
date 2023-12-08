import { ValidatorConfig } from "./validators/ValidatorConfig";
import Validator from "./validators/Validator";
import RequiredValidator, { RequiredValidatorOptions } from "./validators/field/RequiredValidator";
import MaxLengthValidator, { MaxLengthValidatorOptions } from "./validators/field/MaxLengthValidator";
import EmailValidator from "./validators/field/EmailValidator";
import { RegexValidatorOptions } from "./validators/field/RegexValidator";
import CompareValidator, { CompareValidatorOptions } from "./validators/record/CompareValidator";
import ServerFieldValidator from "./validators/field/ServerFieldValidator";

export default function createValidator(cfg: ValidatorConfig): Validator {

    const {
        type,
        options
    } = cfg;

    switch (type) {
        case 'required': return new RequiredValidator(options as RequiredValidatorOptions);
        case 'max-length': return new MaxLengthValidator(options as MaxLengthValidatorOptions);
        case 'email': return new EmailValidator(options as RegexValidatorOptions);
        case 'compare': return new CompareValidator(options as CompareValidatorOptions);
        case 'server': return new ServerFieldValidator(options);
        default: throw new Error(`createValidator is not implemented for validator of type: '${type}'`);
    }
}