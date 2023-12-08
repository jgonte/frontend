import { ComparisonOperatorsEnum } from "../../../operators/ComparisonOperatorsEnum";
import { ValidatorOptions } from "../Validator";
import RecordValidator, { RecordValidationContext } from "./RecordValidator";
export interface CompareValidatorOptions extends ValidatorOptions {
    propertyToCompare: string;
    operator: ComparisonOperatorsEnum;
}
export default class CompareValidator extends RecordValidator {
    private _propertyToCompare;
    private _operator;
    constructor(options: CompareValidatorOptions);
    validate(context: RecordValidationContext): boolean;
    private _compare;
}
