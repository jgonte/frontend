import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
export default class ToolTip extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _positionContent;
}
