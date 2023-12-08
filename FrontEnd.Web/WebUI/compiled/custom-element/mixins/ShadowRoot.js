export default function ShadowRoot(Base) {
    return class ShadowRootMixin extends Base {
        constructor(...args) {
            super(...args);
            if (this.constructor.metadata.shadow === true) {
                this.attachShadow({ mode: 'open' });
            }
        }
        get document() {
            return this.shadowRoot !== null ?
                this.shadowRoot :
                this;
        }
    };
}
//# sourceMappingURL=ShadowRoot.js.map