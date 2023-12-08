import isPrimitive from "../../utils/isPrimitive";

/**
 * Compares two primitive or Date values.
 * The types of the values must be the same
 * Returns:
 *  -1 if the first value is less than the second one
 *  0 if both values are equal
 *  1 if the first value is greated than the seconed one
 * @param v1 First value
 * @param v2 Second value
 */
export default function compareValues(v1: unknown, v2: unknown): number {

    if (v1 instanceof Date && v2 instanceof Date) {

        return (v1 as Date).getTime() - (v2 as Date).getTime();
    }

    if (!isPrimitive(v1) || !isPrimitive(v2)) {

        throw new Error('compareValues - Both values being compared must be either Date or primitives');
    }

    const v1Type = typeof v1;

    const v2Type = typeof v2;

    if (v1Type !== v2Type) {

        throw new Error('compareValues - Both values must be of the same type');
    }

    if (v1Type === 'boolean') {  // Arbitrary comparison flase is less than trye

        return (v1 ? 1 : 0) - (v2 ? 1 : 0);
    }

    if (v1Type === 'number' ||
        v1Type === 'bigint') {

        return (v1 as number) - (v2 as number);
    }

    // Assume it is a string
    return (v1 as string).localeCompare(v2 as string);
}