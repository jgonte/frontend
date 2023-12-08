import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";
export interface MaxLengthValidatorOptions extends ValidatorOptions {
    maxLength: number;
}
export default class MaxLengthValidator extends SingleValueFieldValidator {
    maxLength: number;
    constructor(options: MaxLengthValidatorOptions);
    validate(context: SingleValueFieldValidationContext): boolean;
}
