import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import notifyError from "../../services/errors/notifyError";
import { DataTypes } from "../../utils/data/DataTypes";
import Fetcher from "../../utils/data/transfer/Fetcher";
import notifySuccess from "../../services/success/notifySuccess";
import { closingEvent } from "../tools/close/CloseTool";
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
        this.addEventListener(closingEvent, this.handleClose);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(closingEvent, this.handleClose);
    }
    handleClose(event) {
        const { source } = event.detail;
        switch (source) {
            case 'add-overlay':
                {
                    this.resetForm('create-form');
                }
                break;
            case 'update-overlay':
                {
                }
                break;
            default:
                {
                }
                break;
        }
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
        const { createUrl } = this;
        if (!createUrl) {
            return null;
        }
        return html `
<div slot="header">
    <gcs-button 
        click=${() => this.showOverlay('add-overlay', true)}
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
            close="add-overlay"
        >
            <gcs-localized-text slot="title">Add Record</gcs-localized-text>
        </gcs-panel-header>
        
        <gcs-form 
            id="create-form"
            slot="body"
            submit-url=${this.createUrl}
            auto-load="false"
            update-data-from-response="false"
            submit-success=${() => {
            this.showOverlay('add-overlay', false);
            this.resetForm('create-form');
        }}
        >
        ${this.renderFormBody()}
        </gcs-form>
        
    </gcs-panel>

</gcs-overlay>`;
    }
    showOverlay(id, show) {
        const overlay = this.findAdoptedChildById(id);
        overlay.showing = show;
    }
    resetForm(id) {
        const form = this.findAdoptedChildById(id);
        form.reset();
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
            close="update-overlay"
        >
            <localized-label slot="title">Update Record</localized-label>
        </gcs-panel-header>
        
        <gcs-form 
            id="update-form"
            slot="body"
            id-field=${this.idField}
            load-url=${this.loadRecordUrl}
            auto-load="false"
            submit-url=${this.updateUrl}
            submit-success=${() => {
            this.showOverlay('update-overlay', false);
        }}
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
    showEditForm(record) {
        const form = this.findAdoptedChildById('update-form');
        const { idField } = this;
        const params = {
            [idField]: record[idField]
        };
        form.loadRemote(params);
        this.showOverlay('update-overlay', true);
    }
    showConfirmDelete(record) {
        const overlay = this.findAdoptedChildById('delete-overlay');
        const { deleteRecord } = this;
        overlay.content = () => html `
<gcs-alert
    kind="danger" 
    close="delete-overlay"
>
    <gcs-localized-text>Are you sure you want to delete the record?</gcs-localized-text>
    <div>
        <gcs-button
            click=${async () => await deleteRecord(record)} 
            kind="danger"
            variant="outlined"
        >
            <gcs-localized-text>Delete</gcs-localized-text>
            <gcs-icon name="trash"></gcs-icon>
        </gcs-button>
    </div>
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
                [idField]: id
            }
        });
    }
    handleSuccessfulDelete() {
        this.showOverlay('delete-overlay', false);
        const grid = this.findAdoptedChildById('data-grid');
        grid.load();
        notifySuccess(this, 'Record was successfully deleted.');
    }
}
defineCustomElement('gcs-collection-panel', CollectionPanel);
//# sourceMappingURL=CollectionPanel.js.map