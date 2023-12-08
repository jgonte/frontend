import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";
export default interface DataGridColumnDescriptor {
    name: string;
    display: string | (() => NodePatchingData);
    width: string;
    sortable: boolean;
    headerStyle: string | GenericRecord;
    render: (value: unknown, record: Record<string, unknown>, column: DataGridColumnDescriptor) => NodePatchingData;
}
