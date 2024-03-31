import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
export default class CellEditor extends CustomElement {
    private _field?;
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    static get state(): Record<string, CustomElementStateMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    acceptChanges(): void;
    rejectChanges(): void;
    handleFieldAdded(event: CustomEvent): void;
    render(): NodePatchingData | null;
    renderField(value: unknown): NodePatchingData;
}
