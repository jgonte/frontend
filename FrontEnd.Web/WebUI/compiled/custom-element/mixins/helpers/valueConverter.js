import { DataTypes } from "../../../utils/data/DataTypes";
import getGlobalFunction from "../../../utils/getGlobalFunction";
const valueConverter = {
    toProperty: (value, type) => {
        if (value === null) {
            return null;
        }
        if (!Array.isArray(type)) {
            type = [type];
        }
        if (value[value.length - 2] === '(' && value[value.length - 1] === ')'
            && type.includes(DataTypes.Function)) {
            const fcn = getGlobalFunction(value);
            if (fcn !== undefined) {
                return fcn;
            }
        }
        if (type.includes(DataTypes.Object) ||
            type.includes(DataTypes.Array)) {
            let o;
            try {
                o = JSON.parse(value);
            }
            catch (error) {
                if (!type.includes(DataTypes.String)) {
                    throw error;
                }
            }
            if (o !== undefined) {
                if (!Array.isArray(o) &&
                    !type.includes(DataTypes.Object)) {
                    throw new Error(`value: ${value} is not an array but there is no object type expected`);
                }
                if (Array.isArray(o) &&
                    !type.includes(DataTypes.Array)) {
                    throw new Error(`value: ${value} is an array but there is no array type expected`);
                }
                return o;
            }
        }
        if (type.includes(DataTypes.Boolean)) {
            if (value === 'false') {
                return false;
            }
            return true;
        }
        if (type.includes(DataTypes.Number)) {
            return Number(value);
        }
        return value;
    },
    toAttribute: (value) => {
        const type = typeof value;
        if (type === 'boolean') {
            return '';
        }
        if (type === 'object' || Array.isArray(value)) {
            return JSON.stringify(value);
        }
        return value.toString();
    }
};
export default valueConverter;
//# sourceMappingURL=valueConverter.js.map