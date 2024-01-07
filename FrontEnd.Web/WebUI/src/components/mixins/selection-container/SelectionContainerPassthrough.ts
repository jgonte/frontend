import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { DataTypes } from "../../../utils/data/DataTypes";
import { ISelectionContainer, SelectionTypes } from "./SelectionContainer";

/**
 * Describes a class that holds a selection continer
 */
export interface ISelectionContainerHolder {

    selectionContainer?: ISelectionContainer;
}

/**
 * Holds the properties to pass through the inner selection container
 */
export default function SelectionContainerPassthrough<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase
 {
    return class SelectionContainerPassthroughMixin extends Base
        //implements ISelectionContainerHolder
     {

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
                 * The handler to call when the selection has changed
                 */
                selectionChanged: {
                    attribute: 'selection-changed',
                    type: DataTypes.Function,
                    defer: true
                },

                // Properties that pass through values to the selection container
                selection: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Array
                    ],
                    setValue(selection: unknown) {

                        const {
                            selectionContainer
                        } = this as unknown as ISelectionContainerHolder;

                        if (selectionContainer) {

                            selectionContainer.selection = selection as SelectionTypes;
                        }
                    },
                    getValue() {

                        const {
                            selectionContainer
                        } = this as unknown as ISelectionContainerHolder;

                        if (!selectionContainer) {

                            return [];
                        }

                        return selectionContainer.selection;
                    }
                }
            };
        }
    }
}