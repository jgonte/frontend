import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
export default class CollectionPanel extends CustomElement {
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
                required: true
            },
            idField: {
                attribute: 'id-field',
                type: DataTypes.String,
                value: 'id'
            },
        };
    }
    render() {
        return html `
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
    renderToolbar() {
        return html `
<div slot="header">
    <gcs-button 
        click=${this.showAddForm}
        kind="primary">
        <gcs-icon name="person-add"></gcs-icon>
        <gcs-localized-text>Add</gcs-localized-text>
    </gcs-button>
</div>`;
    }
    renderDataGrid() {
        const me = this;
        let { columns } = this;
        columns = [
            ...columns,
            {
                render: function () {
                    return html `
                <gcs-button 
                    kind="warning" 
                    size="large" 
                    click=${me.showEditForm}
                >
                    Edit
                </gcs-button>`;
                }
            },
            {
                render: function () {
                    return html `
                <gcs-button 
                    kind="danger" 
                    size="large"
                    click=${me.showConfirmDelete}
                >
                    Delete
                </gcs-button>`;
                }
            }
        ];
        return html `
<gcs-data-grid 
    slot="body" 
    id-field=${this.idField}
    columns=${columns} 
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
    renderDeleteDialog() {
        return html `
<gcs-dialog 
    id="delete-dialog" 
    slot="body"
>
    Are you sure you want to delete the record?
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
    showAddForm() {
        const element = Array.from(this.adoptingParent.adoptedChildren)[2];
        element.showing = true;
    }
    showEditForm() {
        const element = Array.from(this.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptedChildren)[3];
        element.showing = true;
    }
    showConfirmDelete() {
        const element = Array.from(this.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptedChildren)[4];
        element.showing = true;
    }
}
defineCustomElement('gcs-collection-panel', CollectionPanel);
//# sourceMappingURL=CollectionPanel.js.map