import { DataTypes } from "../../../../utils/data/DataTypes";
import { ParameterlessVoidFunction } from "../../../../utils/types";
export default function collapsed(options: {
    inherit?: boolean;
    afterUpdate?: ParameterlessVoidFunction;
}): {
    type: DataTypes;
    value: boolean;
    reflect: boolean;
    inherit: boolean | undefined;
    afterUpdate: ParameterlessVoidFunction | undefined;
};
