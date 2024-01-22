const enabled = true;

export const assert = {

    isTrue(condition: boolean, message: string) {

        if (enabled && 
            condition !== true) {

            throw new Error(message);
        }
    },

    areEqual(v1: unknown, v2: unknown, message: string) {

        if (enabled && 
            v1 !== v2) {

            throw new Error(message);
        }
    }
};