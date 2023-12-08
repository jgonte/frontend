import { SingleRecordDataProvider } from "../../../data/DataProvider";
import { DynamicObject } from "../../../types";
import Validator, { ValidationContext } from "../Validator";

export interface RecordValidationContext extends ValidationContext {

    /**
     * The provider of the values for the field to compare
     */
    dataProvider: SingleRecordDataProvider;

    /**
     * The value of the temporary field changed
     */
    value: string | number;
}

export default abstract class RecordValidator extends Validator {

    abstract validate(context: RecordValidationContext): boolean;

    getData(context: RecordValidationContext): DynamicObject {

        return context.dataProvider.getData();
    }
}