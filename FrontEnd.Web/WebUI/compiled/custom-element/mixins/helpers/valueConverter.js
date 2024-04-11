import { DataTypes } from "../../../utils/data/DataTypes";
import getGlobalFunction from "../../../utils/getGlobalFunction";
import isUndefinedOrNull from "../../../utils/isUndefinedOrNull";
import parseFunctionCall from "../../../utils/parseFunctionCall";
import FunctionCall from "./FunctionCall";
const valueConverter = {
    toProperty: (value, type) => {
        if (isUndefinedOrNull(value)) {
            return null;
        }
        if (!Array.isArray(type)) {
            type = [type];
        }
        if (type.includes(DataTypes.Function)) {
            const functionCallInfo = parseFunctionCall(value);
            if (functionCallInfo !== null) {
                const fcn = getGlobalFunction(functionCallInfo.functionName);
                if (fcn !== undefined) {
                    if (functionCallInfo.parameters.length > 0) {
                        return new FunctionCall(fcn, functionCallInfo.parameters);
                    }
                    else {
                        return fcn;
                    }
                }
            }
        }
        if (type.includes(DataTypes.Number)) {
            const numberRegex = /^[+-]?\d+(\.\d+)?$/;
            if (numberRegex.test(value)) {
                return parseFloat(value);
            }
        }
        if (type.includes(DataTypes.Boolean)) {
            if (value === '') {
                return true;
            }
            const lowerCaseValue = value.toLowerCase();
            if (lowerCaseValue === 'true' ||
                lowerCaseValue === 'false') {
                return lowerCaseValue === 'true';
            }
        }
        const dateValue = new Date(value);
        if (!isNaN(dateValue.getTime())) {
            return dateValue;
        }
        if (type.includes(DataTypes.Object) ||
            type.includes(DataTypes.Array)) {
            let o;
            try {
                o = JSON.parse(value);
            }
            catch (error) {
                o = window[value];
                if (!o &&
                    !type.includes(DataTypes.String)) {
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