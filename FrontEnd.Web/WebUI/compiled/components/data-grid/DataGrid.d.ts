import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
declare const DataGrid_base: CustomHTMLElementConstructor;
export default class DataGrid extends DataGrid_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderHeader(): NodePatchingData;
    renderBody(): NodePatchingData[];
    load(): void;
}
export {};
