/**
 * The name of the icon to render if provided
 */

import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { DataTypes } from "../../../utils/data/DataTypes";

export default function iconName(required: boolean = false) : CustomElementPropertyMetadata{

    return {
        attribute: 'icon-name',
        type: [
            DataTypes.String,
            DataTypes.Function // It needs to change dynamically in the tools
        ],
        defer: true,
        required
    };
}

