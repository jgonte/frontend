export default interface Subscriber {
    [key: string]: ((...args: unknown[]) => void) | unknown | undefined;
}
