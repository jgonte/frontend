import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";
export interface RequiredValidatorOptions extends ValidatorOptions {
    allowEmpty?: boolean;
}
export default class RequiredValidator extends SingleValueFieldValidator {
    allowEmpty: boolean;
    constructor(options?: RequiredValidatorOptions);
    validate(context: SingleValueFieldValidationContext): boolean;
}
