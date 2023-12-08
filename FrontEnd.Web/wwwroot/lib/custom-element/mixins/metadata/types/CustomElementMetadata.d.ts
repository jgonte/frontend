import CustomElementPropertyMetadata from "./CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./CustomElementStateMetadata";
export default interface CustomElementMetadata {
    shadow: boolean;
    properties: Map<string, CustomElementPropertyMetadata>;
    propertiesByAttribute: Map<string, CustomElementPropertyMetadata>;
    observedAttributes: string[];
    state: Map<string, CustomElementStateMetadata>;
    styles?: string;
}
