import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
declare const DataGridBodyRow_base: CustomHTMLElementConstructor;
export default class DataGridBodyRow extends DataGridBodyRow_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData[];
}
export {};
