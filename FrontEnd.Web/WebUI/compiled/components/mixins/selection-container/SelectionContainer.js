import { DataTypes } from "../../../utils/data/DataTypes";
import { selectionChangedEvent } from "../selectable/Selectable";
export default function SelectionContainer(Base) {
    return class SelectionContainerMixin extends Base {
        isSelectionContainer = true;
        static get properties() {
            return {
                selectable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true,
                },
                multiple: {
                    type: DataTypes.Boolean,
                    reflect: true,
                    value: false
                },
                idField: {
                    attribute: 'id-field',
                    type: DataTypes.String,
                    value: 'id'
                },
                selection: {
                    type: DataTypes.Array,
                    value: [],
                    reflect: true
                },
                selectionChanged: {
                    attribute: 'selection-changed',
                    type: DataTypes.Function,
                    defer: true
                }
            };
        }
        static get state() {
            return {
                selectedChildren: {
                    value: []
                }
            };
        }
        constructor(...args) {
            super(args);
            this.updateSelection = this.updateSelection.bind(this);
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.addEventListener(selectionChangedEvent, this.updateSelection);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.removeEventListener(selectionChangedEvent, this.updateSelection);
        }
        updateSelection(event) {
            event.stopPropagation();
            const { selectable, multiple, selection, selectionChanged, idField } = this;
            if (selectable !== true) {
                return;
            }
            const { element, selected, value } = event.detail;
            if (multiple === true) {
                if (selected === true) {
                    this.selection = [...selection, value];
                    this.selectedChildren.push(element);
                }
                else {
                    if (idField !== undefined) {
                        this.selection = selection.filter((record) => record[idField] !== value[idField]);
                    }
                    else {
                        this.selection = selection.filter((record) => record !== value);
                    }
                    this.selectedChildren = this.selectedChildren.filter((el) => el !== element);
                }
            }
            else {
                const selectedChild = this.selectedChildren[0];
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
        deselectById(id) {
            const { selectedChildren, idField } = this;
            const selectedChild = selectedChildren.filter((el) => el.selectValue[idField] === id)[0];
            selectedChild.setSelected(false);
        }
        selectByValue(value) {
            const selectors = (this?.shadowRoot).querySelectorAll('gcs-selector');
            const selector = Array.from(selectors).filter(c => c.selectValue[this.idField] === value)[0];
            if (selector) {
                selector.setSelected(true);
            }
            else {
                this.selectedChildren = [];
                this.selection = [];
            }
        }
    };
}
//# sourceMappingURL=SelectionContainer.js.map