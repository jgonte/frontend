import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import Dialog from "../dialog.ts/Dialog";

/**
 * Panel to handle adding, updating and deleting a collection of records
 */
export default class CollectionPanel extends CustomElement {

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
                required: true
            },
            
            /**
             * The name of the field that contains the ID of the record
             */
            idField: {
                attribute: 'id-field',
                type: DataTypes.String,
                value: 'id'
            },
        };
    }

    render(): NodePatchingData {

        return html`
<gcs-center>
    <gcs-panel>
        ${this.renderToolbar()}
        ${this.renderDataGrid()}  
        ${this.renderInsertDialog()} 
        ${this.renderUpdateDialog()}  
        ${this.renderDeleteDialog()}  
    </gcs-panel>
</gcs-center>
`;
    }

    renderToolbar(): NodePatchingData {

        return html`
<div slot="header">
    <gcs-button 
        click=${this.showAddForm}
        kind="primary">
        <gcs-icon name="person-add"></gcs-icon>
        <gcs-localized-text>Add</gcs-localized-text>
    </gcs-button>
</div>`;
    }

    renderDataGrid(): NodePatchingData {

        const me = this;

        let {
            columns
        } = this;

        columns = [
            ...columns,
            {
                render: function (/*value: unknown, record: unknown*/) {
                    return html`
                <gcs-button 
                    kind="warning" 
                    size="large" 
                    click=${me.showEditForm}
                >
                    Edit
                </gcs-button>`
                }
            },
            {
                render: function (/*value: unknown, record: unknown*/) {
                    return html`
                <gcs-button 
                    kind="danger" 
                    size="large"
                    click=${me.showConfirmDelete}
                >
                    Delete
                </gcs-button>`
                }
            }
        ];

        return html`
<gcs-data-grid 
    slot="body" 
    id-field=${this.idField}
    columns=${columns} 
    data=${this.data}
>
</gcs-data-grid>`;
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

    renderDeleteDialog(): NodePatchingData {

        return html`
<gcs-dialog 
    id="delete-dialog" 
    slot="body"
>
    Are you sure you want to delete the record?
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

    showAddForm() {

        const element = Array.from(this.adoptingParent.adoptedChildren)[2];

        (element as Dialog).showing = true;
    }

    showEditForm() {

        const element = Array.from(this.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptedChildren)[3];

        (element as Dialog).showing = true;
    }

    showConfirmDelete() {

        const element = Array.from(this.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptedChildren)[4];

        (element as Dialog).showing = true;
    }
}

defineCustomElement('gcs-collection-panel', CollectionPanel);