import CustomElement from "../custom-element/CustomElement";

/**
 * Tracks the available components by application
 * The components are registered when the connected callback is called and the component has an id attribute
 */
const componentsRegistry = new Map<string, CustomElement>();

export default componentsRegistry;