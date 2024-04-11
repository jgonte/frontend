import { DataTypes } from "../../../utils/data/DataTypes";
import getGlobalFunction from "../../../utils/getGlobalFunction";
import isUndefinedOrNull from "../../../utils/isUndefinedOrNull";
import parseFunctionCall from "../../../utils/parseFunctionCall";
import FunctionCall from "./FunctionCall";

const valueConverter = {

    toProperty: (value: string, type: DataTypes | DataTypes[]) => {

        if (isUndefinedOrNull(value)) {

            return null;
        }

        if (!Array.isArray(type)) { // Convert type to array so we can handle multiple types as well

            type = [type];
        }

        // First try a function since that can create any of the objects below
        if (type.includes(DataTypes.Function)) {

            const functionCallInfo = parseFunctionCall(value);

            if (functionCallInfo !== null) {

                const fcn = getGlobalFunction(functionCallInfo.functionName);

                if (fcn !== undefined) {

                    if (functionCallInfo.parameters.length > 0) {
                        return new FunctionCall(
                            fcn,
                            functionCallInfo.parameters
                        );
                    }
                    else {

                        return fcn; // Without any parameters, just return the function
                    }
                }
            }
        }

        // Attempt to parse as number
        if (type.includes(DataTypes.Number)) {

            const numberRegex = /^[+-]?\d+(\.\d+)?$/; // Regex to match numbers

            if (numberRegex.test(value)) {

                return parseFloat(value);
            }
        }

        // Attempt to parse as boolean
        if (type.includes(DataTypes.Boolean)) {

            if (value === '') { // Empty value in boolean attribute means true

                return true;
            }

            const lowerCaseValue = value.toLowerCase();

            if (lowerCaseValue === 'true' ||
                lowerCaseValue === 'false') {

                return lowerCaseValue === 'true';
            }
        }

        // Attempt to parse as date
        const dateValue = new Date(value);

        if (!isNaN(dateValue.getTime())) {

            return dateValue;
        }

        if (type.includes(DataTypes.Object) ||
            type.includes(DataTypes.Array)
        ) {

            let o;

            try {

                o = JSON.parse(value);
            }
            catch (error) {

                // Check if the string value points to global object
                o = (window as unknown as Window & Record<string, object>)[value];

                if (!o &&
                    !type.includes(DataTypes.String)) {

                    throw error; // Malformed JSON and not global object
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

    toAttribute: (value: unknown): string => {

        const type = typeof value;

        if (type === 'boolean') {

            return ''; // Only true is supposed to be here since false is filtered out before
        }

        if (type === 'object' || Array.isArray(value)) {

            return JSON.stringify(value);
        }

        return (value as object).toString();
    }

};

export default valueConverter;