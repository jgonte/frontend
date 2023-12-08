export type AnyFunction = (...inputs: unknown[]) => unknown;

export default function getGlobalFunction(value: string): AnyFunction {

    const functionName = value.replace('()', '').trim();

    return (window as unknown as Window & Record<string, AnyFunction>)[functionName];
}