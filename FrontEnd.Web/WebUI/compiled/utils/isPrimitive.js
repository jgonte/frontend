export default function isPrimitive(o) {
    const type = typeof o;
    return type !== 'undefined' &&
        type !== 'object' &&
        type !== 'function';
}
//# sourceMappingURL=isPrimitive.js.map