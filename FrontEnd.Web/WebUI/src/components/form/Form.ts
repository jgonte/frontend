import Submittable from "../mixins/submittable/Submittable";
import Validatable from "../mixins/validatable/Validatable";
import Loadable from "../mixins/remote-loadable/RemoteLoadable";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { ValidationContext } from "../../utils/validation/validators/Validator";
import Field, { fieldAddedEvent, changeEvent } from "../fields/Field";
import { formStyles } from "./Form.styles";
import { DynamicObject, GenericRecord } from "../../utils/types";
import labelWidth from "./labelWidth";
import labelAlign from "./labelAlign";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import DataResponse from "../../utils/data/transfer/DataResponse";
import { DataTypes } from "../../utils/data/DataTypes";
import notifyError from "../../services/errors/notifyError";

export const formConnectedEvent = "formConnectedEvent";

export const formDisconnectedEvent = "formDisconnectedEvent";

export default class Form extends
    Submittable(
        Validatable(
            Loadable(
                CustomElement
            )
        )
    ) {

    private _fields: Map<string, Field> = new Map<string, Field>();

    constructor() {

        super();

        this.handleFieldAdded = this.handleFieldAdded.bind(this);

        this.handleChange = this.handleChange.bind(this);

        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    static get styles(): string {

        return formStyles;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The width of the labels of the form
             */
            labelWidth,

            /**
             * Label alignment
             */
            labelAlign,

            hideSubmitButton: {
                attribute: 'hide-submit-button',
                type: DataTypes.Boolean,
                value: false
            }
        };
    }

    render(): NodePatchingData {

        const {
            labelWidth,
            labelAlign
        } = this;

        return html`
<form>
    ${this.renderLoading()}
    ${this.renderSubmitting()}
    <slot label-width=${labelWidth} label-align=${labelAlign} key="form-fields"></slot>
    ${this._renderButton()}
</form>`;
    }

    private _renderButton(): NodePatchingData | null {

        if (this.hideSubmitButton) {

            return null;
        }

        // Doing onClick=${this.submit} binds the button instead of the form to the submit function
        return html`
<gcs-button key="submit-button" kind="primary" variant="contained" click=${() => this.submit()}>
    <gcs-localized-text>Submit</gcs-localized-text>
    <gcs-icon name="box-arrow-right"></gcs-icon>
</gcs-button>`;
    }

    getSubmitData(): DynamicObject {

        return this.getData();
    }

    submit(): void {

        if (this.modifiedFields.length === 0) {

            notifyError(this, 'This form has not been modified');

            return;
        }

        if (this.validate()) {

            super.submit();
        }
    }

    createValidationContext(): ValidationContext {

        return {
            dataProvider: this,
            warnings: [],
            errors: []
        }
    }

    /**
     * Handles the data that was loaded from the server
     * @param data The data returned by the server
     */
    handleLoadedData(data: DataResponse) {

        this.setData((data.payload ?? data) as DynamicObject, true); // Set the fields as not being changed
    }

    /**
     * Called when a response from a submission is received from a server
     * @param data The data returned by the server
     */
    handleSubmitResponse(data: GenericRecord) {

        console.log(JSON.stringify(data));

        const d = data.payload ?? data;

        this.setData(d as DynamicObject, true); // Set the fields as not being changed
    }

    setData(data: DynamicObject, acceptChanges: boolean = false): void {

        console.log(JSON.stringify(data));

        for (const key in data) {

            if (data.hasOwnProperty(key)) {

                const field = this._fields.get(key);

                if (field !== undefined) {

                    const value = data[key];

                    field.value = value; // Here beforeValueSet will be called to transform the value if needed

                    if (acceptChanges === true) {

                        field.acceptChanges();
                    }
                }
                else { // The field does not need to exist for the given data member but let the programmer know it is missing

                    console.warn(`Field of name: '${key}' was not found for data member with same name`);
                }
            }
        }
    }

    /**
     * Retrieves the record from the form
     * @returns 
     */
    getData(): DynamicObject {

        const data: DynamicObject = {};

        for (const [key, field] of this._fields) {

            const value = field.serializeValue !== undefined ?
                field.serializeValue() :
                field.value;

            if (!isUndefinedOrNull(value)) {

                data[key] = value;
            }
        }

        return data;
    }

    validate(): boolean {

        let valid = super.validate();

        this._fields.forEach(field => {

            const v = field.validate();

            if (valid === true) {

                valid = v;
            }
        });

        return valid;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(fieldAddedEvent, this.handleFieldAdded as EventListenerOrEventListenerObject);

        this.addEventListener(changeEvent, this.handleChange as EventListenerOrEventListenerObject);

        // Notify the parent (wizard) that the form has been connected
        this.dispatchCustomEvent(formConnectedEvent, {
            form: this
        });
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded as EventListenerOrEventListenerObject);

        this.removeEventListener(changeEvent, this.handleChange as EventListenerOrEventListenerObject);

        window.removeEventListener('beforeunload', this.handleBeforeUnload);

        // Notify the parent (wizard) that the form has been disconnected
        this.dispatchCustomEvent(formDisconnectedEvent, {
            form: this
        });
    }

    handleBeforeUnload(evt: BeforeUnloadEvent): void {

        evt.preventDefault();

        // Google Chrome requires returnValue to be set.
        evt.returnValue = '';
    }

    handleFieldAdded(event: CustomEvent): void {

        const {
            field
        } = event.detail;

        field.form = this;

        this._fields.set(field.name, field); // Add the field to the form   
    }

    handleChange(event: CustomEvent): void {

        const {
            name,
            newValue
        } = event.detail;

        //console.log('valueChanged: ' + JSON.stringify(event.detail));

        this.setData({
            [name]: newValue
        });

        setTimeout(() => {

            if (this.modifiedFields.length > 0) {

                window.addEventListener('beforeunload', this.handleBeforeUnload);
            }
            else {

                window.removeEventListener('beforeunload', this.handleBeforeUnload);
            }
        });
    }

    get modifiedFields(): Field[] {

        return Array.from(this._fields.values())
            .filter(f => f.isModified);
    }

    reset() {

        // Clear the fields
        Array.from(this.modifiedFields)
            .forEach(f => f.reset());

        // Clear the validation messages of the form
        this.warnings = [];

        this.errors = [];
    }
}

defineCustomElement('gcs-form', Form);