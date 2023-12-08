import { ComparisonOperatorsEnum } from "../../../operators/ComparisonOperatorsEnum";
import { GenericRecord } from "../../../types";
import { ValidatorOptions } from "../Validator";
import RecordValidator, { RecordValidationContext } from "./RecordValidator";

export interface CompareValidatorOptions extends ValidatorOptions {

    /**
     * The name of the property to compare against
     */
    propertyToCompare: string;

    /**
     * The operator to perform the comparison
     */
    operator: ComparisonOperatorsEnum;
}

export default class CompareValidator extends RecordValidator {

    private _propertyToCompare: string;

    private _operator: ComparisonOperatorsEnum;

    constructor(options: CompareValidatorOptions) {

        super("{{label}} must match", options);

        this._propertyToCompare = options.propertyToCompare;

        this._operator = options.operator || ComparisonOperatorsEnum.Equal;
    }

    validate(context: RecordValidationContext): boolean {

        const {
            _propertyToCompare,
            _operator
        } = this;

        const data = this.getData(context) as GenericRecord;

        const {
            value
        } = context

        const valueToCompare = data[_propertyToCompare] as string | number;

        const valid = this._compare(value, valueToCompare, _operator);

        if (!valid) {

            this.emitErrors(context, {
                value,
                propertyToCompare: _propertyToCompare,
                valueToCompare,
                operator: _operator
            });
        }

        return valid;
    }

    private _compare(valueToValidate: string | number, valueToCompare: string | number, operator: ComparisonOperatorsEnum): boolean {

        switch (operator) {
            case ComparisonOperatorsEnum.Equal: return valueToValidate === valueToCompare;
            case ComparisonOperatorsEnum.NotEqual: return valueToValidate !== valueToCompare;
            case ComparisonOperatorsEnum.GreaterThan: return valueToValidate > valueToCompare;
            case ComparisonOperatorsEnum.GreaterOrEqual: return valueToValidate >= valueToCompare;
            case ComparisonOperatorsEnum.LessThan: return valueToValidate < valueToCompare;
            case ComparisonOperatorsEnum.LessThanOrEqual: return valueToValidate <= valueToCompare;
            default: throw new Error(`Invalid comparison operator: ${operator}`);
        }
    }

}