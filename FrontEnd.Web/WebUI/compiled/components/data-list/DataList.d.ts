import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { GenericRecord } from "../../utils/types";
declare const DataList_base: CustomHTMLElementConstructor;
export default class DataList extends DataList_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    _applyTemplate(record: GenericRecord): NodePatchingData;
}
export {};
