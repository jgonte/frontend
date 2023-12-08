export type AnyFunction = (...inputs: unknown[]) => unknown;
export default function getGlobalFunction(value: string): AnyFunction;
