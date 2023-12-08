/**
 * Template tag to generate the styles
 */
 export default function css(strings: TemplateStringsArray, ...values: unknown[]) : string{

    return values.reduce(
        (acc: unknown[], val: unknown, idx: number) => [...acc, val, strings[idx + 1]],
        [strings[0]]
    ).join('');
}