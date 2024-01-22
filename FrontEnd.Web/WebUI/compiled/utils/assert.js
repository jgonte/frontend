const enabled = true;
export const assert = {
    isTrue(condition, message) {
        if (enabled &&
            condition !== true) {
            throw new Error(message);
        }
    },
    areEqual(v1, v2, message) {
        if (enabled &&
            v1 !== v2) {
            throw new Error(message);
        }
    }
};
//# sourceMappingURL=assert.js.map