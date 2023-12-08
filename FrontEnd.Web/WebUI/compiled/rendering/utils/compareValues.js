import isPrimitive from "../../utils/isPrimitive";
export default function compareValues(v1, v2) {
    if (v1 instanceof Date && v2 instanceof Date) {
        return v1.getTime() - v2.getTime();
    }
    if (!isPrimitive(v1) || !isPrimitive(v2)) {
        throw new Error('compareValues - Both values being compared must be either Date or primitives');
    }
    const v1Type = typeof v1;
    const v2Type = typeof v2;
    if (v1Type !== v2Type) {
        throw new Error('compareValues - Both values must be of the same type');
    }
    if (v1Type === 'boolean') {
        return (v1 ? 1 : 0) - (v2 ? 1 : 0);
    }
    if (v1Type === 'number' ||
        v1Type === 'bigint') {
        return v1 - v2;
    }
    return v1.localeCompare(v2);
}
//# sourceMappingURL=compareValues.js.map