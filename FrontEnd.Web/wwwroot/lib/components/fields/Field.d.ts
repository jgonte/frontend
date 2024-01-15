import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElement from "../../custom-element/mixins/metadata/types/CustomHTMLElement";
import { DataTypes } from "../../utils/data/DataTypes";
import { FieldValidationContext } from "../../utils/validation/validators/field/SingleValueFieldValidator";
export declare const changeEvent = "changeEvent";
export declare const fieldAddedEvent = "fieldAddedEvent";
declare const Field_base: typeof CustomElement;
export default abstract class Field extends Field_base {
    static dataFieldType: DataTypes;
    private _tempValue;
    isField: boolean;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
    hasRequiredValidator(): boolean;
    didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement): void;
    handleBlur(): void;
    handleInput(event: Event): void;
    createValidationContext(): FieldValidationContext & {
        value: unknown;
    };
    private _label?;
    getLabel(): string;
    handleChange(): void;
}
export {};
