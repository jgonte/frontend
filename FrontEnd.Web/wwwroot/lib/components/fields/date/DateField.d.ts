import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import DisplayableField from "../DisplayableField";
export default class DateField extends DisplayableField {
    static getFieldType(): DataTypes;
    render(): NodePatchingData;
    beforeValueSet(value: string): Date;
    serializeValue(): string | null;
}
