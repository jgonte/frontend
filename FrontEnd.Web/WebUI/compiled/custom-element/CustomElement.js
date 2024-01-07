import ParentChild from "./mixins/ParentChild";
import ReactiveElement from "./mixins/ReactiveElement";
import StylesPatching from "./mixins/StylesPatching";
import NodePatching from "./mixins/NodePatching";
import ShadowRoot from "./mixins/ShadowRoot";
import MetadataInitializer from "./mixins/metadata/MetadataInitializer";
import html from "../rendering/html";
import componentsRegistry from "../services/componentsRegistry";
export default class CustomElement extends ParentChild(ReactiveElement(StylesPatching(NodePatching(ShadowRoot(MetadataInitializer(HTMLElement)))))) {
    static isCustomElement = true;
    constructor() {
        super();
        this.initialized?.(this);
        this.isInitialized = true;
    }
    render() {
        return html `<slot></slot>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        const id = this.getAttribute('id');
        if (id !== undefined) {
            componentsRegistry.set(id, this);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        const id = this.getAttribute('id');
        if (id !== undefined) {
            componentsRegistry.delete(id);
        }
    }
    async dispatchCustomEvent(type, detail) {
        await this.updateComplete;
        this.dispatchEvent(new CustomEvent(type, {
            detail: detail,
            bubbles: true,
            composed: true,
        }));
        console.log(`Event of type: '${type}' was dispatched by:`);
        console.dir(this);
        console.log(`Event of type: '${type}' was dispatched with detail:`);
        console.dir(detail);
    }
}
//# sourceMappingURL=CustomElement.js.map