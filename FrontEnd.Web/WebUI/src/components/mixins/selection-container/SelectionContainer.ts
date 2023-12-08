import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { DataTypes } from "../../../utils/data/DataTypes";
import { GenericRecord } from "../../../utils/types";
import Selector from "../../selector/Selector";
import { selectionChangedEvent } from "../selectable/Selectable";

export type SelectionTypes = Array<string> & { [x: string]: string };

export interface ISelectionContainer extends HTMLElement {
    isSelectionContainer: boolean;

    selectionChanged?: (selection: SelectionTypes, selectedChildren: CustomElement[]) => void;
}

/**
 * Manages the selection of its children
 */
export default function SelectionContainer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SelectionContainerMixin extends Base implements ISelectionContainer {

        isSelectionContainer = true; // Mark the instance as a selection 

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the component is selectable
                 */
                selectable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true,
                    //inherit: true
                },

                /**
                 * Whether we can process multiple selection
                 */
                multiple: {
                    type: DataTypes.Boolean,
                    reflect: true,
                    value: false
                },

                /**
                 * The name of the field that contains the ID of the record
                 */
                // Needed to remove a record from a multiple selection
                idField: {
                    attribute: 'id-field',
                    type: DataTypes.String,
                    value: 'id'
                },

                /**
                 * The selected item or items. It is an attribute since it can be passed through a property initially
                 */
                selection: {
                    type: DataTypes.Array,
                    value: [],
                    reflect: true
                },

                /**
                 * The handler to call when the selection has changed
                 */
                selectionChanged: {
                    attribute: 'selection-changed',
                    type: DataTypes.Function,
                    defer: true
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                /**
                 * To track the current selected children to send messages
                 */
                selectedChildren: {
                    value: []
                }
            };
        }

        // The mixin constructor requires the parameters signature to be of type any
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {

            super(args);

            this.updateSelection = this.updateSelection.bind(this);
        }

        connectedCallback(): void {
            
            super.connectedCallback?.();

            this.addEventListener(selectionChangedEvent, this.updateSelection as EventListenerOrEventListenerObject);
        }

        disconnectedCallback(): void {
            
            super.disconnectedCallback?.();

            this.removeEventListener(selectionChangedEvent, this.updateSelection as EventListenerOrEventListenerObject);
        }

        updateSelection(event: CustomEvent) {

            event.stopPropagation();

            const {
                selectable,
                multiple,
                selection,
                selectionChanged,
                idField
            } = this;

            if (selectable !== true) {

                return;
            }

            const {
                element,
                selected,
                value
            } = event.detail;

            if (multiple === true) {

                if (selected === true) { // Add the value to the selection

                    this.selection = [...selection, value];

                    this.selectedChildren.push(element);
                }
                else { // Remove the value from the selection

                    if (idField !== undefined) {

                        this.selection = selection.filter((record: GenericRecord) => record[idField] !== value[idField]);
                    }
                    else {

                        this.selection = selection.filter((record: unknown) => record !== value);
                    }

                    this.selectedChildren = this.selectedChildren.filter((el: CustomElement) => el !== element);
                }
            }
            else { // Replace the old selection with the new one

                const selectedChild = this.selectedChildren[0];

                // Deselect previous selected child without dispatching the selectionChanged event
                if (selectedChild !== undefined) {

                    selectedChild.selected = false;
                }

                if (selected === true) {

                    this.selection = [value];

                    this.selectedChildren = [element];
                }
                else {

                    this.selectedChildren = [];
                }
            }

            if (selectionChanged !== undefined) {

                selectionChanged(this.selection, this.selectedChildren);
            }
        }

        deselectById(id: unknown) {

            const {
                selectedChildren,
                idField
            } = this;

            const selectedChild = selectedChildren.filter((el: { selectValue: { [x: string]: unknown; }; }) => el.selectValue[idField] === id)[0];

            selectedChild.setSelected(false);
        }

        selectByValue(value: unknown) {
    
            const selectors = (this?.shadowRoot as ShadowRoot).querySelectorAll('gcs-selector');

            const selector = Array.from(selectors).filter(c => (c as Selector).selectValue[this.idField] === value)[0] as Selector;

            selector.setSelected(true);
        }
    }
}
