export type GenericRecord = Record<string, unknown>;

export type DynamicObject = object & GenericRecord;

// The constructor requires the parameters signature to be of type any
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type Constructor<T = GenericRecord> = new (...args: any[]) => T;

export type ParameterlessVoidFunction = () => void;

export interface IContentHidable {

    hideContent?: () => void;
}