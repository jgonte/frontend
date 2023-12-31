import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
export declare const inputEvent = "inputEvent";
declare const DisplayableField_base: CustomHTMLElementConstructor;
export default abstract class DisplayableField extends DisplayableField_base {
    _initialValue?: unknown;
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    connectedCallback(): void;
    handleInput(event: Event): void;
    get isModified(): boolean;
    acceptChanges(): void;
    reset(): void;
}
export {};
