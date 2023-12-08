import classMetadataRegistry from "../../../custom-element/mixins/metadata/classMetadataRegistry";

// To make it work with the HappyDom when testing
interface RegistryHolder extends CustomElementRegistry {

    _registry: object;
}

/**
 * Helper to clear the registry of custom elements after each test
 */
export default function clearCustomElements() {

    // Clear the registration
    (customElements as RegistryHolder)._registry = {};

    // Clear the body
    document.body.innerHTML = '';

    // Clear all the metadata
    classMetadataRegistry.clear();
}