export default function defineCustomElement(name, constructor) {
    if (customElements.get(name) === undefined) {
        customElements.define(name, constructor);
    }
}
//# sourceMappingURL=defineCustomElement.js.map