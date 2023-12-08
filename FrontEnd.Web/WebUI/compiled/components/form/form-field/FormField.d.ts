import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
declare const FormField_base: CustomHTMLElementConstructor;
export default class FormField extends FormField_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    static get state(): Record<string, CustomElementStateMetadata>;
    render(): NodePatchingData;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleInput(event: CustomEvent): Promise<void>;
    handleValidation(event: CustomEvent): Promise<void>;
}
export {};
