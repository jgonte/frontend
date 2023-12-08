import { SingleRecordDataProvider } from "../../../data/DataProvider";
import { DynamicObject } from "../../../types";
import Validator, { ValidationContext } from "../Validator";
export interface RecordValidationContext extends ValidationContext {
    dataProvider: SingleRecordDataProvider;
    value: string | number;
}
export default abstract class RecordValidator extends Validator {
    abstract validate(context: RecordValidationContext): boolean;
    getData(context: RecordValidationContext): DynamicObject;
}
