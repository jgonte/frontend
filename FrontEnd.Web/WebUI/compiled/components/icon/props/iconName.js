import { DataTypes } from "../../../utils/data/DataTypes";
export default function iconName(required = false) {
    return {
        attribute: 'icon-name',
        type: [
            DataTypes.String,
            DataTypes.Function
        ],
        defer: true,
        required
    };
}
//# sourceMappingURL=iconName.js.map