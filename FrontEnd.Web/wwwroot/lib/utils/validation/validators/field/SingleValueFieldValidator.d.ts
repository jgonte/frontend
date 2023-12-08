import Field from "../../../../components/fields/Field";
import Validator, { ValidationContext } from "../Validator";
export interface FieldValidationContext extends ValidationContext {
    label: string;
    field?: Field;
}
export interface SingleValueFieldValidationContext extends FieldValidationContext {
    value?: string | number;
}
export default abstract class SingleValueFieldValidator extends Validator {
}
