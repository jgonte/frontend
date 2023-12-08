export default function isClass(value) {
    return typeof value === 'function' &&
        value.toString().substring(0, 5) == 'class';
}
//# sourceMappingURL=isClass.js.map