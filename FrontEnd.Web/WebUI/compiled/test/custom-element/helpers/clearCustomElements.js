import classMetadataRegistry from "../../../custom-element/mixins/metadata/classMetadataRegistry";
export default function clearCustomElements() {
    customElements._registry = {};
    document.body.innerHTML = '';
    classMetadataRegistry.clear();
}
//# sourceMappingURL=clearCustomElements.js.map