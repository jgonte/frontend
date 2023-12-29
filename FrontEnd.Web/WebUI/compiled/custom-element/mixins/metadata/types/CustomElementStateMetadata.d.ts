export default interface CustomElementStateMetadata {
    name?: string;
    value?: unknown;
    options?: unknown[];
    afterChange?: (value: unknown, oldValue: unknown) => void;
}
