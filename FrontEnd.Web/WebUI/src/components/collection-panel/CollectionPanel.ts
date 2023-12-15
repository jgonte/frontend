import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import notifyError from "../../services/errors/notifyError";
import { DataTypes } from "../../utils/data/DataTypes";
import Fetcher from "../../utils/data/transfer/Fetcher";
import { GenericRecord } from "../../utils/types";
import Dialog from "../dialog.ts/Dialog";

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
            onData: () => this.handleSuccessfulDelete(),
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
                    render: function (/*value: unknown, record: unknown*/) {
                        return html`
<gcs-button 
    kind="warning" 
    size="large" 
    click=${showEditForm}
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

        if (loadUrl) {

            return html`
<gcs-loader 
    slot="body" 
    load-url=${loadUrl}
>
    <gcs-data-grid
        
        id-field=${this.idField}
        columns=${columns} 
    >
    </gcs-data-grid>
</gcs-loader>`;
        }
        else {

            return html`
<gcs-data-grid 
    slot="body" 
    id-field=${this.idField}
    columns=${columns} 
    data=${this.data}
>
</gcs-data-grid>`;
        }
    }


    renderInsertDialog(): NodePatchingData {

        return html`
<gcs-dialog 
    id="add-dialog" 
    slot="body"
>
    Add record
</gcs-dialog>`;
    }

    renderUpdateDialog(): NodePatchingData {

        return html`
<gcs-dialog 
    id="update-dialog" 
    slot="body"
>
    Generate a dynamic form or use an existing one
</gcs-dialog>`;
    }

    renderDeleteDialog(): NodePatchingData {

        return html`
<gcs-dialog 
    id="delete-dialog" 
    slot="body"
>
</gcs-dialog>`;
    }

    showAddForm() {

        const dialog = this.findChild((n: { id: string; }) => n.id === 'add-dialog');

        (dialog as Dialog).showing = true;
    }

    showEditForm() {

        const dialog = this.findChild((n: { id: string; }) => n.id === 'update-dialog');

        (dialog as Dialog).showing = true;
    }

    showConfirmDelete(record: GenericRecord) {

        const dialog = this.findChild((n: { id: string; }) => n.id === 'delete-dialog') as Dialog;

        const {
            deleteRecord
        } = this;

        dialog.content = () => html`
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

    async deleteRecord(record: GenericRecord) {

        const {
            idField,
            deleteUrl
        } = this;

        const id = record[idField];

        await this._deleteFetcher?.fetch({
            url: deleteUrl,
            method: 'DELETE',
            data: id as string
        });
    }

    handleSuccessfulDelete() {

        const dialog = this.findChild((n: { id: string; }) => n.id === 'delete-dialog') as Dialog;

        dialog.showing = false;

        //TODO: Show a successfully delete alert
    }
}

defineCustomElement('gcs-collection-panel', CollectionPanel);