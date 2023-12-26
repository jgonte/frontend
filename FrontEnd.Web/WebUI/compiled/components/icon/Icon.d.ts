import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
export default class Icon extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): Promise<NodePatchingData | null>;
}
