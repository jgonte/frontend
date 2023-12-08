import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";

export default interface DataGridColumnDescriptor {

    /**
     * The name of the column
     */
    name: string;

    /**
     * The display (label) of the column
     */
    display: string | (() => NodePatchingData);

    /**
     * The CSS width of the column
     */
    width: string;

    /**
     * Whether the column can be sorted
     */
    sortable: boolean;

    /**
     * The style for the header of the column (column)
     */
    headerStyle: string | GenericRecord;

    /**
     * The custom renderer of the column
     */
    render: (value: unknown, record: Record<string, unknown>, column: DataGridColumnDescriptor) => NodePatchingData;
}