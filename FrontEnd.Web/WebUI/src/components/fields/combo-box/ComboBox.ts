import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import { DynamicObject, GenericRecord } from "../../../utils/types";
import SelectionContainer, { SelectionTypes } from "../../mixins/selection-container/SelectionContainer";
import CollectionDataHolder from "../../mixins/data-holder/CollectionDataHolder";
import DisplayableField from "../DisplayableField";
import isPrimitive from "../../../utils/isPrimitive";
import CustomElement from "../../../custom-element/CustomElement";
import { changeEvent } from "../Field";

export default class ComboBox extends
    SelectionContainer(
        CollectionDataHolder(
            DisplayableField as unknown as CustomHTMLElementConstructor
        )
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field that contains the field of the record to display in the selection
             */
            displayField: {
                attribute: 'display-field',
                type: DataTypes.String,
                value: 'text'
            },

            /**
             * The template to render the item (record) in the (data) list
             */
            itemTemplate: {
                attribute: 'item-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the header of the combo box
             */
            headerTemplate: {
                attribute: 'header-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            selectTemplate: {
                attribute: 'select-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            singleSelectionTemplate: {
                attribute: 'single-selection-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            multipleSelectionTemplate: {
                attribute: 'multiple-selection-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            }
        };
    }

    constructor() {

        super();

        this.renderItem = this.renderItem.bind(this);

        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    render(): NodePatchingData {

        return html`<gcs-drop-down>
            ${this.renderHeader()}
            ${this.renderContent()}
        </gcs-drop-down>`;
    }

    renderHeader(): NodePatchingData {

        const {
            selection,
            multiple
        } = this;

        if (selection.length === 0) {

            return this.renderSelectTemplate(); // No selection
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

    renderItem(record: GenericRecord): NodePatchingData {

        const {
            itemTemplate,
            displayField
        } = this;

        const display = itemTemplate !== undefined ?
            itemTemplate(record) :
            record[displayField];

        return html`<gcs-selector select-value=${record}>${display}</gcs-selector>`;
    }

    onSelectionChanged(selection: GenericRecord, selectedChildren: CustomElement[]) {

        this.oldSelection = this.selection;

        this.selection = selection; // Do not unwrap the value of the selection since it will render only the value

        this._tempValue = this.unwrapValue(selection); // handleInput needs the temp value to be set

        this.handleInput();

        this.handleChange();

        this.selectedChildren = selectedChildren;

        this.selectionChanged?.(selection, selectedChildren);
    }

    // Override handle change
    handleChange(): void {

        this.value = this._tempValue;

        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue: this.oldSelection,
            newValue: this.selection
        });
    }

    renderContent(): NodePatchingData {

        const {
            data,
            renderItem,
            multiple,
            idField,
            onSelectionChanged
        } = this;

        if (data?.length > 0) { // There are records

            return html`
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

            return html`
<gcs-alert 
    slot="content"
    kind="warning">
    <gcs-localized-text>No Data Available</gcs-localized-text>
</gcs-alert>`;
        }
    }

    renderSelectTemplate(): NodePatchingData {

        const {
            selectTemplate
        } = this;

        if (selectTemplate !== undefined) {

            return selectTemplate();
        }
        else {

            return html`<gcs-localized-text slot="header">Please select</gcs-localized-text>`;
        }
    }

    renderSingleSelectionTemplate(selection: SelectionTypes): NodePatchingData {

        const {
            singleSelectionTemplate,
            displayField
        } = this;

        if (singleSelectionTemplate !== undefined) {

            return singleSelectionTemplate(selection);
        }
        else {

            const value = isPrimitive(selection) ?
                selection :
                selection[displayField];

            return html`<span slot="header">${value}</span>`;
        }
    }

    renderMultipleSelectionTemplate(selection: SelectionTypes): NodePatchingData {

        const {
            multipleSelectionTemplate,
            idField,
            displayField
        } = this;


        if (multipleSelectionTemplate !== undefined) {

            return multipleSelectionTemplate(selection, this.deselectById);
        }
        else {

            // Transform the data
            const data = selection.map((item: string): DynamicObject => {

                return {
                    [idField]: item[idField],
                    [displayField]: item[displayField]
                };
            });

            const itemTemplate = (record: DynamicObject) => html`
<gcs-pill kind="primary" variant="contained">
    ${record[displayField] as string}
    <gcs-close-tool close=${() => this.deselectById(record[idField])}></gcs-close-tool>
</gcs-pill>`;

            return html`
<gcs-data-list
    slot="header" 
    style="display: flex; flex-wrap: wrap; max-width: 500px; border: solid 1px black;" 
    data=${data} 
    item-template=${itemTemplate}>
</gcs-data-list>`;
        }
    }

    /**
     * Unwraps the value from array/object before being set
     * @param value 
     * @returns 
     */
    beforeValueSet(value: unknown): unknown {

        return this.unwrapValue(value);
    }

    onValueChanged(value: unknown, oldValue: unknown): void {

        super.onValueChanged?.(value, oldValue);

        value = this.unwrapValue(value);

        this.content.selectByValue(value);
    }

    /**
     * Unwraps a value from array/object to a primitive
     * @param value The value to unwrap
     * @returns The unwrapped value if any
     */
    private unwrapValue(value: unknown) {

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

    private unwrapSingleValue(value: unknown) {

        if (typeof value === 'object') {

            value = (value as GenericRecord)[this.idField];
        }
        
        return value;
    }
}

defineCustomElement('gcs-combo-box', ComboBox);