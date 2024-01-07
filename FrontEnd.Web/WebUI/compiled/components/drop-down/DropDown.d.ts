import CustomElement from "../../custom-element/CustomElement";
import { IContentHidable } from "../../utils/types";
import CustomElementStateMetadata from "../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
export default class DropDown extends CustomElement implements IContentHidable {
    static get styles(): string;
    static get state(): Record<string, CustomElementStateMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): NodePatchingData;
    handleExpanderChanged(evt: CustomEvent): void;
    handleSelectionChanged(evt: CustomEvent): void;
    hideContent(): void;
}
