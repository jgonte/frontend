import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
export default class FormField extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    static get state(): Record<string, CustomElementStateMetadata>;
    render(): NodePatchingData;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleInput(event: CustomEvent): void;
    handleValidation(event: CustomEvent): void;
}
