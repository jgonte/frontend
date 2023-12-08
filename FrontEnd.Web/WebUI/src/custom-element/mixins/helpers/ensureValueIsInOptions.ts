export default function ensureValueIsInOptions(value: unknown, options: unknown[] | undefined) : void {

    if (options !== undefined &&
        !options.includes(value)) {

        throw new Error(`Value: '${value}' is not part of the options: [${options.join(', ')}]`);
    }
}