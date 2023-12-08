export default function isUndefinedOrNull(o: unknown): boolean {

    return o === undefined ||
        o === null;
}