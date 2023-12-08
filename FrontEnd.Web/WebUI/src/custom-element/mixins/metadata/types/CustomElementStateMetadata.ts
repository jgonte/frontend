/**
 * Describes the configurator of the state
 */
 export default interface CustomElementStateMetadata {

    /**
     * The name of the property in the object
     * It corresponds to the key of the record
     */
    name?: string;

    /**
     * The default value of the property
     */
    value?: unknown;

    /**
     * The range to restrict the values of the property
     */
     options?: unknown[];
}