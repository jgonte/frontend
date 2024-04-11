import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import Clickable from "../clickable/Clickable";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import { selectableStyles } from "./Selectable.styles";

export const selectionChangedEvent = 'selectionChangedEvent';

/**
 * Allows a component to be selected when clicked
 */
export default function Selectable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SelectableMixin
        extends Clickable(
            Base
        ) {

        static get styles(): string {

            return mergeStyles(super.styles, selectableStyles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the component is selectable
                 */
                selectable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true,
                    inherit: true
                },

                /**
                 * Whether the item is selected
                 */
                selected: {
                    type: DataTypes.Boolean,
                    reflect: true,
                    // Do not use arrow function below so the right "this" binding happens
                    canChange: function () {

                        return (this as unknown as SelectableMixin).selectable === true;
                    }
                },

                /**
                 * The value to return when the component gets selected
                 */
                selectValue: {
                    attribute: 'select-value',
                    type: [
                        DataTypes.String,
                        DataTypes.Object
                    ]
                }
            };
        }

        handleClick(evt: Event) {

            evt.stopPropagation();

            this.setSelected(!this.selected); // Toggle
        }

        /**
         * The difference between setSelected and setting the selected property is that
         * this function dispatches the selectionChangedEvent
         */
        setSelected(selected: boolean): void {

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
    }
}