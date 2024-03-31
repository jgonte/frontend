import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";
export default interface IDataGridColumnDescriptor {
    name: string;
    display: string | (() => NodePatchingData);
    width: string;
    sortable: boolean;
    headerStyle: string | GenericRecord;
    render: (value: unknown, record: GenericRecord, column: IDataGridColumnDescriptor) => NodePatchingData;
}
