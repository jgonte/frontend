import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import Clickable from "../clickable/Clickable";
import { selectableStyles } from "./Selectable.styles";
export const selectionChangedEvent = 'selectionChanged';
export default function Selectable(Base) {
    return class SelectableMixin extends Clickable(Base) {
        static get styles() {
            return mergeStyles(super.styles, selectableStyles);
        }
        static get properties() {
            return {
                selectable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true,
                    inherit: true
                },
                selected: {
                    type: DataTypes.Boolean,
                    reflect: true,
                    canChange: function () {
                        return this.selectable === true;
                    }
                },
                selectValue: {
                    attribute: 'select-value',
                    type: [
                        DataTypes.String,
                        DataTypes.Object
                    ]
                }
            };
        }
        handleClick() {
            this.setSelected(!this.selected);
        }
        setSelected(selected) {
            if (this.selectable === true) {
                this.selected = selected;
                this.dispatchCustomEvent(selectionChangedEvent, {
                    element: this,
                    selected,
                    value: this.selectValue
                });
            }
        }
    };
}
//# sourceMappingURL=Selectable.js.map