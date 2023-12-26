import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import notifyError from "../../services/errors/notifyError";
import { DataTypes } from "../../utils/data/DataTypes";
import Fetcher from "../../utils/data/transfer/Fetcher";
import { GenericRecord } from "../../utils/types";
import DataGrid from "../data-grid/DataGrid";
import Overlay from "../overlay/Overlay";
import notifySuccess from "../../services/success/notifySuccess";

/**
 * Panel to handle adding, updating and deleting a collection of records
 */
export default class CollectionPanel extends CustomElement {

    private _deleteFetcher?: Fetcher;

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the columns to render each row
             */
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            },

            /**
             * The records of the grid
             */
            data: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                //required: true
                //TODO: required: props => !props.loadUrl;
            },

            /**
             * The name of the field that contains the ID of the record
             */
            idField: {
                attribute: 'id-field',
                type: DataTypes.String,
                value: 'id'
            },

            /**
             * The URL to load the data grid
             */
            loadUrl: {
                attribute: 'load-url',
                type: DataTypes.String
            },

            /**
             * The URL to post the data to create
             */
            createUrl: {
                attribute: 'create-url',
                type: DataTypes.String
            },

            /**
             * The URL to load the data single record to be updated in the update form
             */
            loadRecordUrl: {
                attribute: 'load-record-url',
                type: DataTypes.String
            },
            /**
             * The URL to post the data to update
             */
            updateUrl: {
                attribute: 'update-url',
                type: DataTypes.String
            },

            /**
             * The URL to post the data to delete
             */
            deleteUrl: {
                attribute: 'delete-url',
                type: DataTypes.String
            },

            /**
             * The content of the create/update form to render
             */
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

    render(): NodePatchingData {

        return html`
<gcs-panel id="collection-panel">
    ${this.renderToolbar()}
    ${this.renderDataGrid()}  
    ${this.renderInsertDialog()} 
    ${this.renderUpdateDialog()}  
    ${this.renderDeleteDialog()}  
</gcs-panel>
`;
    }

    renderToolbar(): NodePatchingData | null {

        const {
            createUrl,
            showAddForm
        } = this;

        if (!createUrl) {

            return null;
        }

        return html`
<div slot="header">
    <gcs-button 
        click=${showAddForm}
        kind="primary">
        <gcs-icon name="person-add"></gcs-icon>
        <gcs-localized-text>Add</gcs-localized-text>
    </gcs-button>
</div>`;
    }

    renderDataGrid(): NodePatchingData {

        const {
            updateUrl,
            showEditForm,
            deleteUrl,
            showConfirmDelete,
            loadUrl
        } = this;

        let {
            columns
        } = this;

        if (updateUrl) {

            columns = [
                ...columns,
                {
                    value: 'edit',
                    render: function (_value: unknown, record: GenericRecord) {
                        return html`
<gcs-button 
    kind="warning" 
    size="large" 
    click=${() => showEditForm(record)}
>
    Edit
</gcs-button>`
                    }
                }
            ];
        }

        if (deleteUrl) {

            columns = [
                ...columns,
                {
                    value: 'delete',
                    render: function (_value: unknown, record: GenericRecord) {
                        return html`
<gcs-button 
    kind="danger" 
    click=${() => showConfirmDelete(record)}
>
    Delete
</gcs-button>`
                    }
                }
            ];
        }

        return html`
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

    renderInsertDialog(): NodePatchingData | null {

        if (!this.createUrl) {

            return null;
        }

        return html`
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

    renderFormBody(): NodePatchingData {

        const {
            formContent
        } = this;

        if (formContent) {

            return formContent();
        }
        else {

            return html`
<gcs-alert 
    kind="danger" 
>
    <gcs-localized-text>No content for the form has been found.</gcs-localized-text>
</gcs-alert>`;
        }
    }

    renderUpdateDialog(): NodePatchingData | null {

        if (!this.updateUrl) {

            return null;
        }

        return html`
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

    renderDeleteDialog(): NodePatchingData {

        return html`
<gcs-overlay 
    id="delete-overlay" 
    slot="body"
>
</gcs-overlay>`;
    }

    showAddForm() {

        const overlay = this.findChild((n: { id: string; }) => n.id === 'add-overlay');

        (overlay as Overlay).showing = true;
    }

    showEditForm(record: GenericRecord) {

        const form = this.findChild((n: { id: string; }) => n.id === 'update-form');

        const {
            idField
        } = this;

        const params =
        {
            [idField]: record[idField]
        };

        form.loadRemote(params);

        const overlay = this.findChild((n: { id: string; }) => n.id === 'update-overlay');

        (overlay as Overlay).showing = true;
    }

    showConfirmDelete(record: GenericRecord) {

        const overlay = this.findChild((n: { id: string; }) => n.id === 'delete-overlay') as Overlay;

        const {
            deleteRecord
        } = this;

        overlay.content = () => html`
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

    async deleteRecord(record: GenericRecord) {

        const {
            idField,
            deleteUrl
        } = this;

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

        const overlay = this.findChild((n: { id: string; }) => n.id === 'delete-overlay') as Overlay;

        overlay.showing = false;

        const grid = this.findChild((n: { id: string; }) => n.id === 'data-grid') as DataGrid;

        grid.load();

        notifySuccess(this, 'Record was successfully deleted.');
    }
}

defineCustomElement('gcs-collection-panel', CollectionPanel);