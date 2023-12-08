import CustomElement from "../../custom-element/CustomElement";
import CustomElementStateMetadata from "../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
export default class DropDown extends CustomElement {
    static get styles(): string;
    static get state(): Record<string, CustomElementStateMetadata>;
    constructor();
    render(): NodePatchingData;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleDropChanged(evt: CustomEvent): void;
    hideContent(): void;
}
