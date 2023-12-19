import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
declare const DataTemplate_base: typeof CustomElement;
export default class DataTemplate extends DataTemplate_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
}
export {};
