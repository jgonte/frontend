import Successful from "../mixins/successful/Successful";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import notifyError from "../../services/errors/notifyError";
import { DataTypes } from "../../utils/data/DataTypes";
import Fetcher from "../../utils/data/transfer/Fetcher";
export default class CollectionPanel extends Successful(CustomElement) {
    _deleteFetcher;
    static get properties() {
        return {
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            },
            data: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
            },
            idField: {
                attribute: 'id-field',
                type: DataTypes.String,
                value: 'id'
            },
            loadUrl: {
                attribute: 'load-url',
                type: DataTypes.String
            },
            createUrl: {
                attribute: 'create-url',
                type: DataTypes.String
            },
            updateUrl: {
                attribute: 'update-url',
                type: DataTypes.String
            },
            deleteUrl: {
                attribute: 'delete-url',
                type: DataTypes.String
            }
        };
    }
    constructor() {
        super();
        this.showAddForm = this.showAddForm.bind(this);
        this.showEditForm = this.showEditForm.bind(this);
        this.showConfirmDelete = this.showConfirmDelete.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }
    connectedCallback() {
        super.connectedCallback?.();
        this._deleteFetcher = new Fetcher({
            onSuccess: () => this.handleSuccessfulDelete(),
            onError: error => notifyError(this, error)
        });
    }
    render() {
        return html `
<gcs-panel id="collection-panel">
    ${this.renderToolbar()}
    ${this.renderDataGrid()}  
    ${this.renderInsertDialog()} 
    ${this.renderUpdateDialog()}  
    ${this.renderDeleteDialog()}  
</gcs-panel>
`;
    }
    renderToolbar() {
        const { createUrl, showAddForm } = this;
        if (!createUrl) {
            return null;
        }
        return html `
<div slot="header">
    <gcs-button 
        click=${showAddForm}
        kind="primary">
        <gcs-icon name="person-add"></gcs-icon>
        <gcs-localized-text>Add</gcs-localized-text>
    </gcs-button>
</div>`;
    }
    renderDataGrid() {
        const { updateUrl, showEditForm, deleteUrl, showConfirmDelete, loadUrl } = this;
        let { columns } = this;
        if (updateUrl) {
            columns = [
                ...columns,
                {
                    value: 'edit',
                    render: function () {
                        return html `
<gcs-button 
    kind="warning" 
    size="large" 
    click=${showEditForm}
>
    Edit
</gcs-button>`;
                    }
                }
            ];
        }
        if (deleteUrl) {
            columns = [
                ...columns,
                {
                    value: 'delete',
                    render: function (_value, record) {
                        return html `
<gcs-button 
    kind="danger" 
    click=${() => showConfirmDelete(record)}
>
    Delete
</gcs-button>`;
                    }
                }
            ];
        }
        return html `
<gcs-data-grid 
    id="data-grid"
    slot="body" 
    id-field=${this.idField}
    columns=${columns}
    load-url=${loadUrl}
    data=${this.data}
>
</gcs-data-grid>`;
    }
    renderInsertDialog() {
        return html `
<gcs-dialog 
    id="add-dialog" 
    slot="body"
>
    Add record
</gcs-dialog>`;
    }
    renderUpdateDialog() {
        return html `
<gcs-dialog 
    id="update-dialog" 
    slot="body"
>
    Generate a dynamic form or use an existing one
</gcs-dialog>`;
    }
    renderDeleteDialog() {
        return html `
<gcs-dialog 
    id="delete-dialog" 
    slot="body"
>
</gcs-dialog>`;
    }
    showAddForm() {
        const dialog = this.findChild((n) => n.id === 'add-dialog');
        dialog.showing = true;
    }
    showEditForm() {
        const dialog = this.findChild((n) => n.id === 'update-dialog');
        dialog.showing = true;
    }
    showConfirmDelete(record) {
        const dialog = this.findChild((n) => n.id === 'delete-dialog');
        const { deleteRecord } = this;
        dialog.content = () => html `
<gcs-alert
    kind="danger" 
    close
>
    <gcs-localized-text>Are you sure you want to delete the record?</gcs-localized-text>
    <gcs-row>
        <gcs-button slot="middle"
            click=${async () => await deleteRecord(record)} 
            kind="danger"
            variant="outlined"
        >
            <gcs-localized-text>Delete</gcs-localized-text>
            <gcs-icon name="trash"></gcs-icon>
        </gcs-button>
    </gcs-row>  
</gcs-alert>`;
        dialog.showing = true;
    }
    async deleteRecord(record) {
        const { idField, deleteUrl } = this;
        const id = record[idField];
        await this._deleteFetcher?.fetch({
            url: deleteUrl,
            method: 'DELETE',
            params: {
                'id': id
            }
        });
    }
    handleSuccessfulDelete() {
        const dialog = this.findChild((n) => n.id === 'delete-dialog');
        dialog.showing = false;
        const grid = this.findChild((n) => n.id === 'data-grid');
        grid.load();
        this.renderSuccess('Record was successfully deleted.');
    }
}
defineCustomElement('gcs-collection-panel', CollectionPanel);
//# sourceMappingURL=CollectionPanel.js.map