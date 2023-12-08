import isUndefinedOrNull from "../../isUndefinedOrNull";
import { DataTypes } from "../DataTypes";
const defaultValueConverter = {
    fromString: (value, type) => {
        switch (type) {
            case DataTypes.String:
                return value;
            case DataTypes.Boolean:
                return value !== 'false';
            case DataTypes.Number:
                return Number(value);
            case DataTypes.Date:
                return new Date(value);
            case DataTypes.Object:
            case DataTypes.Array:
                return JSON.parse(value);
            default: throw new Error(`Conversion 'fromString' not implemented for type: ${type}`);
        }
        return value;
    },
    toString: (value, type) => {
        switch (type) {
            case DataTypes.String:
                return value;
            case DataTypes.Boolean:
            case DataTypes.Number:
                return value.toString();
            case DataTypes.Date:
                return value.toISOString();
            case DataTypes.Object:
            case DataTypes.Array:
                return isUndefinedOrNull(value) ? null : JSON.stringify(value);
            default: throw new Error(`Conversion 'toString' not implemented for type: ${type}`);
        }
    }
};
export default defaultValueConverter;
//# sourceMappingURL=defaultValueConverter.js.map