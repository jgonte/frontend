import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import DisplayableField from "../DisplayableField";
export default class CheckBox extends DisplayableField {
    value: boolean;
    static getFieldType(): DataTypes;
    render(): NodePatchingData;
}
