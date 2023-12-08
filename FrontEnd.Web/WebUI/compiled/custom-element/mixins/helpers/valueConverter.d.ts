import { DataTypes } from "../../../utils/data/DataTypes";
declare const valueConverter: {
    toProperty: (value: string, type: DataTypes | DataTypes[]) => any;
    toAttribute: (value: unknown) => string;
};
export default valueConverter;
