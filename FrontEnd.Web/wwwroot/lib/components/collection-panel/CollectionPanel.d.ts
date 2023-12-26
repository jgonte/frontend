import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";
export default class CollectionPanel extends CustomElement {
    private _deleteFetcher?;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    constructor();
    connectedCallback(): void;
    render(): NodePatchingData;
    renderToolbar(): NodePatchingData | null;
    renderDataGrid(): NodePatchingData;
    renderInsertDialog(): NodePatchingData | null;
    renderFormBody(): NodePatchingData;
    renderUpdateDialog(): NodePatchingData | null;
    renderDeleteDialog(): NodePatchingData;
    showAddForm(): void;
    showEditForm(record: GenericRecord): void;
    showConfirmDelete(record: GenericRecord): void;
    deleteRecord(record: GenericRecord): Promise<void>;
    handleSuccessfulDelete(): void;
}
