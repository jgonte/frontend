import { DataTypes } from "../../../../utils/data/DataTypes";
export default function collapsed(options) {
    return {
        type: DataTypes.Boolean,
        value: false,
        reflect: true,
        inherit: options?.inherit,
        afterUpdate: options?.afterUpdate
    };
}
//# sourceMappingURL=collapsed.js.map