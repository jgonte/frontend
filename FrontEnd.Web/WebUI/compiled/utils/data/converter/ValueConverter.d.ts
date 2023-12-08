import { DataTypes } from "../DataTypes";
export default interface ValueConverter {
    fromString: (value: string, type: DataTypes) => unknown;
    toString: (value: unknown, type: DataTypes) => string | null;
}
