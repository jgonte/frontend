import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import DisplayableField from "../DisplayableField";
export default class CheckBox extends DisplayableField {
    static getFieldType(): DataTypes;
    render(): NodePatchingData;
    onValueChanged(value: unknown, _oldValue: unknown): void;
}
