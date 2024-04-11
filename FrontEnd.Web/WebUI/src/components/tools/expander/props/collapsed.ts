/**
 * Whether the collapsible content is collapsed or not
 */

import { DataTypes } from "../../../../utils/data/DataTypes";
import { ParameterlessVoidFunction } from "../../../../utils/types";

export default function collapsed(options:
    {
        inherit?: boolean;
        afterUpdate?: ParameterlessVoidFunction
    }) {

    return {
        type: DataTypes.Boolean,
        value: false,
        reflect: true,
        inherit: options?.inherit,
        afterUpdate: options?.afterUpdate
    };
}