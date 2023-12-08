import { DataTypes } from "../../../utils/data/DataTypes";
import getGlobalFunction from "../../../utils/getGlobalFunction";

const valueConverter = {

    toProperty: (value: string, type: DataTypes | DataTypes[]) => {

        if (value === null) {

            return null;
        }

        if (!Array.isArray(type)) { // Convert type to array so we can handle multiple types as well

            type = [type];
        }

        // First try a function since that can create any of the objects below
        if (value[value.length - 2] === '(' && value[value.length - 1] === ')' // The function by convention must end in ()
            && type.includes(DataTypes.Function)) {

            const fcn = getGlobalFunction(value);

            if (fcn !== undefined) {

                return fcn;
            }
        }

        if (type.includes(DataTypes.Object) ||
            type.includes(DataTypes.Array)
        ) {

            let o;

            try {

                o = JSON.parse(value);
            }
            catch (error) {

                if (!type.includes(DataTypes.String)) {

                    throw error; // Malformed JSON
                }

                // Try the other types below
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

            return true;
        }

        if (type.includes(DataTypes.Number)) {

            return Number(value);
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