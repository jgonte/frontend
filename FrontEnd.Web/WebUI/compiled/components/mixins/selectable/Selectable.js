import Clickable from "../clickable/Clickable";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import { selectableStyles } from "./Selectable.styles";
export const selectionChangedEvent = 'selectionChangedEvent';
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
        handleClick(evt) {
            evt.stopPropagation();
            this.setSelected(!this.selected);
        }
        setSelected(selected) {
            if ((this.selected || false) === selected) {
                return;
            }
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