import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import SelectionContainer from "../../mixins/selection-container/SelectionContainer";
import DataCollectionHolder from "../../mixins/data/DataCollectionHolder";
import DisplayableField from "../DisplayableField";
import isPrimitive from "../../../utils/isPrimitive";
import { changeEvent } from "../Field";
export default class ComboBox extends SelectionContainer(DataCollectionHolder(DisplayableField)) {
    static get properties() {
        return {
            displayField: {
                attribute: 'display-field',
                type: DataTypes.String,
                value: 'text'
            },
            itemTemplate: {
                attribute: 'item-template',
                type: DataTypes.Function,
                defer: true
            },
            headerTemplate: {
                attribute: 'header-template',
                type: DataTypes.Function,
                defer: true
            },
            selectTemplate: {
                attribute: 'select-template',
                type: DataTypes.Function,
                defer: true
            },
            singleSelectionTemplate: {
                attribute: 'single-selection-template',
                type: DataTypes.Function,
                defer: true
            },
            multipleSelectionTemplate: {
                attribute: 'multiple-selection-template',
                type: DataTypes.Function,
                defer: true
            }
        };
    }
    constructor() {
        super();
        this.renderItem = this.renderItem.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }
    render() {
        return html `<gcs-drop-down>
            ${this.renderHeader()}
            ${this.renderContent()}
        </gcs-drop-down>`;
    }
    renderHeader() {
        const { selection, multiple } = this;
        if (selection.length === 0) {
            return this.renderSelectTemplate();
        }
        else {
            if (multiple === true) {
                return this.renderMultipleSelectionTemplate(selection);
            }
            else {
                return this.renderSingleSelectionTemplate(selection[0]);
            }
        }
    }
    renderItem(record) {
        const { itemTemplate, displayField } = this;
        const display = itemTemplate !== undefined ?
            itemTemplate(record) :
            record[displayField];
        return html `<gcs-selector select-value=${record}>${display}</gcs-selector>`;
    }
    onSelectionChanged(selection, selectedChildren) {
        this.oldSelection = this.selection;
        this.selection = selection;
        this._tempValue = this.unwrapValue(selection);
        this.handleInput();
        this.handleChange();
        this.selectedChildren = selectedChildren;
        this.selectionChanged?.(selection, selectedChildren);
    }
    handleChange() {
        this.value = this._tempValue;
        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue: this.oldSelection,
            newValue: this.selection
        });
    }
    renderContent() {
        const { data, renderItem, multiple, idField, onSelectionChanged } = this;
        if (data?.length > 0) {
            return html `
<gcs-data-list 
    slot="content" 
    data=${data} 
    item-template=${renderItem} 
    initialized=${dataList => this.content = dataList}
    multiple=${multiple}
    id-field=${idField} 
    selection-changed=${onSelectionChanged}>
</gcs-data-list>`;
        }
        else {
            this.content = null;
            return html `
<gcs-alert 
    slot="content"
    kind="warning">
    <gcs-localized-text>No Data Available</gcs-localized-text>
</gcs-alert>`;
        }
    }
    renderSelectTemplate() {
        const { selectTemplate } = this;
        if (selectTemplate !== undefined) {
            return selectTemplate();
        }
        else {
            return html `<gcs-localized-text slot="header">Please select</gcs-localized-text>`;
        }
    }
    renderSingleSelectionTemplate(selection) {
        const { singleSelectionTemplate, displayField } = this;
        if (singleSelectionTemplate !== undefined) {
            return singleSelectionTemplate(selection);
        }
        else {
            const value = isPrimitive(selection) ?
                selection :
                selection[displayField];
            return html `<span slot="header">${value}</span>`;
        }
    }
    renderMultipleSelectionTemplate(selection) {
        const { multipleSelectionTemplate, idField, displayField } = this;
        if (multipleSelectionTemplate !== undefined) {
            return multipleSelectionTemplate(selection, this.deselectById);
        }
        else {
            const data = selection.map((item) => {
                return {
                    [idField]: item[idField],
                    [displayField]: item[displayField]
                };
            });
            const itemTemplate = (record) => html `
<gcs-pill kind="primary" variant="contained">
    ${record[displayField]}
    <gcs-close-tool close=${() => this.deselectById(record[idField])}></gcs-close-tool>
</gcs-pill>`;
            return html `
<gcs-data-list
    slot="header" 
    style="display: flex; flex-wrap: wrap; max-width: 500px; border: solid 1px black;" 
    data=${data} 
    item-template=${itemTemplate}>
</gcs-data-list>`;
        }
    }
    beforeValueSet(value) {
        return this.unwrapValue(value);
    }
    onValueChanged(value, oldValue) {
        super.onValueChanged?.(value, oldValue);
        value = this.unwrapValue(value);
        this.content.selectByValue(value);
    }
    unwrapValue(value) {
        if (Array.isArray(value)) {
            if (this.multiple === true) {
                return value.map(v => this.unwrapSingleValue(v));
            }
            else {
                value = value[0];
                return this.unwrapSingleValue(value);
            }
        }
        else {
            return this.unwrapSingleValue(value);
        }
    }
    unwrapSingleValue(value) {
        if (typeof value === 'object') {
            value = value[this.idField];
        }
        return value;
    }
}
defineCustomElement('gcs-combo-box', ComboBox);
//# sourceMappingURL=ComboBox.js.map