export default function ensureValueIsInOptions(value, options) {
    if (options !== undefined &&
        !options.includes(value)) {
        throw new Error(`Value: '${value}' is not part of the options: [${options.join(', ')}]`);
    }
}
//# sourceMappingURL=ensureValueIsInOptions.js.map