import CustomHTMLElementConstructor from "./mixins/metadata/types/CustomHTMLElementConstructor";
import { GenericRecord } from "../utils/types";
import { RenderReturnTypes } from "./mixins/metadata/types/IRenderable";
declare const CustomElement_base: CustomHTMLElementConstructor;
export default class CustomElement extends CustomElement_base {
    static readonly isCustomElement: boolean;
    constructor();
    render(): RenderReturnTypes;
    connectedCallback(): void;
    disconnectedCallback(): void;
    dispatchCustomEvent(type: string, detail: GenericRecord): Promise<void>;
}
export {};
