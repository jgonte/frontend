import CustomElementPropertyMetadata from "./CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./CustomElementStateMetadata";

/**
 * Contains the merged metadata of this custom component and its ancestors
 * to perform validations of the custom element as well as initialization of its instances
 */
 export default interface CustomElementMetadata {

    /**
     * Whether to create a shadow DOM for the component
     */
    shadow: boolean;

    /**
     * The merged properties configuration of the custom element mapped by its name.
     * They are indexed by the name of the property
     */
    properties: Map<string, CustomElementPropertyMetadata>;

    /**
     * The merged properties indexed by the name of the attribute
     */
    propertiesByAttribute: Map<string, CustomElementPropertyMetadata>;

    /**
     * The merged observed attributes of the custom element
     */
    observedAttributes: string[];

    /**
     * The merged state configuration of the custom element mapped by its name
     */
    state: Map<string, CustomElementStateMetadata>;

    /**
     * The merged styles of the custom element
     */
    styles?: string;
}