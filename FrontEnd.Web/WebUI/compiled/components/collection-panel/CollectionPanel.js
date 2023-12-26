import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import notifyError from "../../services/errors/notifyError";
import { DataTypes } from "../../utils/data/DataTypes";
import Fetcher from "../../utils/data/transfer/Fetcher";
import notifySuccess from "../../services/success/notifySuccess";
export default class CollectionPanel extends CustomElement {
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
            loadRecordUrl: {
                attribute: 'load-record-url',
                type: DataTypes.String
            },
            updateUrl: {
                attribute: 'update-url',
                type: DataTypes.String
            },
            deleteUrl: {
                attribute: 'delete-url',
                type: DataTypes.String
            },
            formContent: {
                attribute: 'form-content',
                type: DataTypes.Function,
                defer: true
            },
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
                    render: function (_value, record) {
                        return html `
<gcs-button 
    kind="warning" 
    size="large" 
    click=${() => showEditForm(record)}
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
        if (!this.createUrl) {
            return null;
        }
        return html `
<gcs-overlay 
    id="add-overlay" 
    slot="body"
>
    <gcs-panel>

        <gcs-panel-header
            slot="header"
            icon-name="database-add"
            close
        >
            <gcs-localized-text slot="title">Add Record</gcs-localized-text>
        </gcs-panel-header>
        
        <gcs-form 
            id="create-form"
            slot="body"
            submit-url=${this.createUrl}
        >
        ${this.renderFormBody()}
        </gcs-form>
        
    </gcs-panel>

</gcs-overlay>`;
    }
    renderFormBody() {
        const { formContent } = this;
        if (formContent) {
            return formContent();
        }
        else {
            return html `
<gcs-alert 
    kind="danger" 
>
    <gcs-localized-text>No content for the form has been found.</gcs-localized-text>
</gcs-alert>`;
        }
    }
    renderUpdateDialog() {
        if (!this.updateUrl) {
            return null;
        }
        return html `
<gcs-overlay 
    id="update-overlay" 
    slot="body"
>
    <gcs-panel>

        <gcs-panel-header
            slot="header"
            icon-name="database-check"
            close
        >
            <localized-label slot="title">Update Record</localized-label>
        </gcs-panel-header>
        
        <gcs-form 
            id="update-form"
            slot="body"
            load-url=${this.loadRecordUrl}
            auto-load="false"
            submit-url=${this.createUrl}
        >
        ${this.renderFormBody()}
        </gcs-form>
        
    </gcs-panel>

</gcs-overlay>`;
    }
    renderDeleteDialog() {
        return html `
<gcs-overlay 
    id="delete-overlay" 
    slot="body"
>
</gcs-overlay>`;
    }
    showAddForm() {
        const overlay = this.findChild((n) => n.id === 'add-overlay');
        overlay.showing = true;
    }
    showEditForm(record) {
        const form = this.findChild((n) => n.id === 'update-form');
        const { idField } = this;
        const params = {
            [idField]: record[idField]
        };
        form.loadRemote(params);
        const overlay = this.findChild((n) => n.id === 'update-overlay');
        overlay.showing = true;
    }
    showConfirmDelete(record) {
        const overlay = this.findChild((n) => n.id === 'delete-overlay');
        const { deleteRecord } = this;
        overlay.content = () => html `
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
        overlay.showing = true;
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
        const overlay = this.findChild((n) => n.id === 'delete-overlay');
        overlay.showing = false;
        const grid = this.findChild((n) => n.id === 'data-grid');
        grid.load();
        notifySuccess(this, 'Record was successfully deleted.');
    }
}
defineCustomElement('gcs-collection-panel', CollectionPanel);
//# sourceMappingURL=CollectionPanel.js.map