import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";
export default class CollectionPanel extends CustomElement {
    private _deleteFetcher?;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleClose(event: Event): void;
    render(): NodePatchingData;
    renderToolbar(): NodePatchingData | null;
    renderDataGrid(): NodePatchingData;
    renderInsertDialog(): NodePatchingData | null;
    showOverlay(id: string, show: boolean): void;
    resetForm(id: string): void;
    renderFormBody(): NodePatchingData;
    renderUpdateDialog(): NodePatchingData | null;
    renderDeleteDialog(): NodePatchingData;
    showEditForm(record: GenericRecord): void;
    showConfirmDelete(record: GenericRecord): void;
    deleteRecord(record: GenericRecord): Promise<void>;
    handleSuccessfulDelete(): void;
}
