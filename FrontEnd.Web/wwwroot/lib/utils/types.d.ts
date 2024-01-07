export type GenericRecord = Record<string, unknown>;
export type DynamicObject = object & GenericRecord;
export type Constructor<T = GenericRecord> = new (...args: any[]) => T;
export type ParameterlessVoidFunction = () => void;
export interface IContentHidable {
    hideContent?: () => void;
}
