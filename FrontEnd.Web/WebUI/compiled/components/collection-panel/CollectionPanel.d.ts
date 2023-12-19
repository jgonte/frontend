import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";
declare const CollectionPanel_base: typeof CustomElement;
export default class CollectionPanel extends CollectionPanel_base {
    private _deleteFetcher?;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    constructor();
    connectedCallback(): void;
    render(): NodePatchingData;
    renderToolbar(): NodePatchingData | null;
    renderDataGrid(): NodePatchingData;
    renderInsertDialog(): NodePatchingData;
    renderUpdateDialog(): NodePatchingData;
    renderDeleteDialog(): NodePatchingData;
    showAddForm(): void;
    showEditForm(): void;
    showConfirmDelete(record: GenericRecord): void;
    deleteRecord(record: GenericRecord): Promise<void>;
    handleSuccessfulDelete(): void;
}
export {};
