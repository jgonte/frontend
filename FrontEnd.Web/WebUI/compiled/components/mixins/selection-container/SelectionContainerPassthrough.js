import { DataTypes } from "../../../utils/data/DataTypes";
export default function SelectionContainerPassthrough(Base) {
    return class SelectionContainerPassthroughMixin extends Base {
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
                selectionChanged: {
                    attribute: 'selection-changed',
                    type: DataTypes.Function,
                    defer: true
                },
                selection: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Array
                    ],
                    setValue(selection) {
                        const { selectionContainer } = this;
                        if (selectionContainer) {
                            selectionContainer.selection = selection;
                        }
                    },
                    getValue() {
                        const { selectionContainer } = this;
                        if (!selectionContainer) {
                            return [];
                        }
                        return selectionContainer.selection;
                    }
                }
            };
        }
    };
}
//# sourceMappingURL=SelectionContainerPassthrough.js.map