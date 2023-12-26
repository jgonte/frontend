import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
export default class DataGridHeader extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData[];
}
