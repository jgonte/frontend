import SelectionContainerPassthrough from "../../mixins/selection-container/SelectionContainerPassthrough";
import RemoteLoadableHolderPassthrough from "../../mixins/remote-loadable/RemoteLoadablePassthrough";
import CollectionDataHolder from "../../mixins/data-holder/CollectionDataHolder";
import DisplayableField from "../DisplayableField";
import Focusable from "../../mixins/focusable/Focusable";
import isPrimitive from "../../../utils/isPrimitive";
import { changeEvent } from "../Field";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
export default class ComboBox extends SelectionContainerPassthrough(RemoteLoadableHolderPassthrough(CollectionDataHolder(Focusable(DisplayableField)))) {
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
        return html `
<gcs-drop-down>
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
        return html `
<gcs-selector select-value=${record}>
    ${display}
</gcs-selector>`;
    }
    onSelectionChanged(selection, oldSelection, selectedChildren) {
        this._tempValue = this.unwrapValue(selection);
        this.handleInput();
        this.value = this._tempValue;
        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue: oldSelection,
            newValue: selection
        });
        this.selectionChanged?.(selection, oldSelection, selectedChildren);
    }
    renderContent() {
        return html `
<gcs-data-list 
    id="selection-container"
    slot="content" 
    data=${this.data}
    load-url=${this.loadUrl}
    item-template=${this.renderItem} 
    initialized=${dataList => this.selectionContainer = dataList}
    multiple=${this.multiple}
    id-field=${this.idField} 
    selection-changed=${this.onSelectionChanged}>
</gcs-data-list>`;
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
        const { deselectById } = this.selectionContainer;
        if (multipleSelectionTemplate !== undefined) {
            return multipleSelectionTemplate(selection, deselectById);
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
    <gcs-close-tool close=${() => deselectById(record[idField])}></gcs-close-tool>
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