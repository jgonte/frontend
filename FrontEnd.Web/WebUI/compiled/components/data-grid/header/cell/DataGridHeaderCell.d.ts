import CustomElement from "../../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import IDataGridColumnDescriptor from "../../IDataGridColumnDescriptor";
export default class DataGridHeaderCell extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderCellContainer(column: IDataGridColumnDescriptor, display: NodePatchingData): NodePatchingData;
    renderSorter(): NodePatchingData | null;
}
