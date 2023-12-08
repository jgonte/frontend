import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";
export interface RegexValidatorOptions extends ValidatorOptions {
    regex: RegExp;
}
export default abstract class RegexValidator extends SingleValueFieldValidator {
    _regex: RegExp;
    constructor(message: string, options: RegexValidatorOptions);
    validate(context: SingleValueFieldValidationContext): boolean;
}
