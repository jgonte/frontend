/**
 * Tests whether the type of the object being passed is a primitive one
 */
export default function isPrimitive(o: unknown): boolean {

    const type = typeof o;

    return type !== 'undefined' &&
        type !== 'object' &&
        type !== 'function';
}