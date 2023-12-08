import isUndefinedOrNull from "../../isUndefinedOrNull";
import { DataTypes } from "../DataTypes";
import ValueConverter from "./ValueConverter";

const defaultValueConverter: ValueConverter = {

    fromString: (value: string, type: DataTypes) : unknown => {

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

    toString: (value: unknown, type: DataTypes) : string | null => {

        switch (type) {
            case DataTypes.String:
                return value as string;
            case DataTypes.Boolean:
            case DataTypes.Number:
                return (value as number).toString();
            case DataTypes.Date:
                return (value as Date).toISOString();
            case DataTypes.Object:
            case DataTypes.Array:
                return isUndefinedOrNull(value) ? null : JSON.stringify(value);
            default: throw new Error(`Conversion 'toString' not implemented for type: ${type}`);
        }
    }
};

export default defaultValueConverter;