import Disableable from "../mixins/disableable/Disableable";
import Field from "./Field";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { displayableFieldStyles } from "./DisplayableField.styles";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { DataTypes } from "../../utils/data/DataTypes";
import areEquivalent from "../../utils/areEquivalent";
import { validationEvent } from "../mixins/validatable/Validatable";

export const inputEvent = "inputEvent";

/**
 * Fields that are displayed on a form (not a hidden field, for example)
 */
export default abstract class DisplayableField extends
    Disableable(
        Field as unknown as CustomHTMLElementConstructor
    ) {

    /** 
     * The initial value of the tracked component 
     * A component is considered "modified" if its current value is different from the initial one
     */
    _initialValue?: unknown = null;

    static get styles(): string {

        return mergeStyles(super.styles, displayableFieldStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /** 
             * The style to pass to the input field
             */
            inputStyle: {
                attribute: 'input-style',
                type: DataTypes.String
            }
        };
    }

    connectedCallback(): void {

        super.connectedCallback?.();

        this._initialValue = this.value;// Set the initial value
    }

    /**
     * Called every time the input changes.
     * Used to trigger validation and flagging the parent form field (if any) as modified
     * @param event The event of the element with the change
     */
    handleInput(event: Event): void {

        if (event !== undefined) { // Coming from an event

            super.handleInput(event);
        }

        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: !areEquivalent(this._initialValue, this._tempValue) // Notify the parent whether the value has changed or not
        });
    }

    /**
     * Whether the field was modified
     */
    get isModified(): boolean {

        return this.value !== this._initialValue;
    }

    acceptChanges(): void {

        this._initialValue = this.value;

        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: false
        });
    }

    /**
     * Resets the field
     */
    reset(): void {
        
        this.value = this._initialValue;

        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: false
        });

        // Clear the validation messages of the form field
        this.dispatchCustomEvent(validationEvent, {
            warnings: [],
            errors: []
        });
    }
}