import Field from "../../../../components/fields/Field";
import Validator, { ValidationContext } from "../Validator";

export interface FieldValidationContext extends ValidationContext {

    /** The label of the field */
    label: string;

    /** The field itself so it can dispatch custom events */
    field?: Field;
}

export interface SingleValueFieldValidationContext extends FieldValidationContext {

    /** The value to validate */
    value?: string | number
}

export default abstract class SingleValueFieldValidator extends Validator {
}