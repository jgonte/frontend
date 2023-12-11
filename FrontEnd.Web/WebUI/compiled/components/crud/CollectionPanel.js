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
    constructor() {
        super();
        this.showAddForm = this.showAddForm.bind(this);
        this.showEditForm = this.showEditForm.bind(this);
        this.showConfirmDelete = this.showConfirmDelete.bind(this);
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
        const { showAddForm } = this;
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
        const { showEditForm, showConfirmDelete } = this;
        let { columns } = this;
        columns = [
            ...columns,
            {
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
            },
            {
                render: function () {
                    return html `
                <gcs-button 
                    kind="danger" 
                    size="large"
                    click=${showConfirmDelete}
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
    Are you sure you want to delete the record?
</gcs-dialog>`;
    }
    showAddForm() {
        const element = this.findChild((n) => n.id === 'add-dialog');
        element.showing = true;
    }
    showEditForm() {
        const element = this.findChild((n) => n.id === 'update-dialog');
        element.showing = true;
    }
    showConfirmDelete() {
        const element = this.findChild((n) => n.id === 'delete-dialog');
        element.showing = true;
    }
}
defineCustomElement('gcs-collection-panel', CollectionPanel);
//# sourceMappingURL=CollectionPanel.js.map