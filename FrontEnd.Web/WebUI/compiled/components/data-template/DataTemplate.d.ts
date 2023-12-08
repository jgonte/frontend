import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
export default class DataTemplate extends CustomElement {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
}
