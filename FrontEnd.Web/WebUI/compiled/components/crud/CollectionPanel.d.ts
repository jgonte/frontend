import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
export default class CollectionPanel extends CustomElement {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderToolbar(): NodePatchingData;
    renderDataGrid(): NodePatchingData;
    renderInsertDialog(): NodePatchingData;
    renderDeleteDialog(): NodePatchingData;
    renderUpdateDialog(): NodePatchingData;
    showAddForm(): void;
    showEditForm(): void;
    showConfirmDelete(): void;
}
