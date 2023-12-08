import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import isClass from "../../utils/isClass";
import { DynamicObject, GenericRecord } from "../../utils/types";
import Button from "../button/Button";
import Form, { formConnectedEvent, formDisconnectedEvent } from "../form/Form";
import Submittable from "../mixins/data/Submittable";
import Errorable from "../mixins/errorable/Errorable";

export default class Wizard extends
    Errorable(
        Submittable(
            CustomElement
        )
    ) {

    // The shared data of the wizard
    sharedData: DynamicObject = {};

    // The forms loaded by the wizard
    private _forms: Map<string, Form> = new Map<string, Form>();

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The steps of the wizard
             */
            steps: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                // required = false - The themes are set when the application initializes which happens after the connectedCallback of this component
            },

            /**
             * Callback when the wizard is mounted
             */
            start: {
                type: DataTypes.Function,
                defer: true
            },

            /**
             * Callback when the back button is clicked
             */
            back: {
                type: DataTypes.Function,
                defer: true
            },

            /**
             * Callback when the next button is clicked
             */
            next: {
                type: DataTypes.Function,
                defer: true
            },

            /**
             * Callback when the finish button is clicked
             */
            finish: {
                type: DataTypes.Function,
                defer: true
            },

            /**
             * Callback when the finish was clicked and a successful response was returned from the server
             */
            done: {
                type: DataTypes.Function,
                defer: true
            }
        };
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            selectedStep: {
                value: 0
            }
        };
    }

    constructor() {

        super();

        this.handleNext = this.handleNext.bind(this);

        this.handleBack = this.handleBack.bind(this);

        this.handleFinish = this.handleFinish.bind(this);
    }

    render(): NodePatchingData {

        return html`
${this.renderStep()}
${this.renderButtons()}
`;
    }

    renderStep(): NodePatchingData {

        let step = this.steps[this.selectedStep];

        if (isClass(step)) {

            step = new step;
        }

        if (step.render !== undefined) {

            return step.render();
        }
        else if (typeof step === 'function') {

            return step();
        }
        else {

            throw new Error('Unexpected step type');
        }
    }

    renderButtons(): NodePatchingData {

        return html`
<div>
    <gcs-button 
        id="button-back"
        kind="primary" 
        onClick=${this.handleBack}
    >
        <gcs-icon name="arrow-left-square"></gcs-icon>
        <gcs-localized-text>Back</gcs-localized-text>   
    </gcs-button>

    <gcs-button 
        id="button-next"
        kind="primary"
        onClick=${this.handleNext}
    >
        <gcs-localized-text>Next</gcs-localized-text>   
        <gcs-icon name="arrow-right-square"></gcs-icon>
    </gcs-button>

    <gcs-button 
        id="button-finish"
        kind="primary"
        onClick=${this.handleFinish}
    >
        <gcs-localized-text>Finish</gcs-localized-text>   
        <gcs-icon name="box-arrow-right"></gcs-icon>
    </gcs-button>

</div>`;
    }

    handleBack(): void {

        --this.selectedStep;

        this._hideBackButtonIfNecessary();

        this._hideNextButtonIfNecessary();

        this._hideFinishButtonIfNecessary();

        // Wait for the step to load the previous form(s)
        setTimeout(() => {

            if (this.back === undefined) {

                this._populateFormsFromSharedData();
            }
            else {

                const forms = Array.from(this._forms.values());

                this.back(forms);
            }
        });
    }

    handleNext(): void {

        if (this.next === undefined) {

            if (this._populateSharedDataFromForms() === false) {

                return; // Stay on the same screen
            }
        }
        else {

            const forms = Array.from(this._forms.values());

            if (this.next(forms) === false) {

                return; // Stay on the same screen
            }
        }

        ++this.selectedStep;

        this._hideBackButtonIfNecessary();

        this._hideNextButtonIfNecessary();

        this._hideFinishButtonIfNecessary();
    }

    handleFinish(): void {

        if (this.finish === undefined) {

            if (this._populateSharedDataFromForms() === false) {

                return; // Stay on the same screen
            }

            this.submit(); //Post using the data of sharedData
        }
        else {

            const forms = Array.from(this._forms.values());

            this.finish(forms);
        }
    }

    // Must be implemented from Submittable
    /**
     * Called when a response from a submission is received from a server
     * @param data The data returned by the server
     */
    handleSubmitResponse(data: GenericRecord) {

        // Assume that getting here is a successful 
        this.done?.(data);
    }

    getSubmitData(): DynamicObject {

        return this.sharedData;
    }

    didMountCallback(): void {

        this._hideBackButtonIfNecessary();

        this._hideNextButtonIfNecessary();

        this._hideFinishButtonIfNecessary();

        this.start?.();
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(formConnectedEvent, this.handleFormConnected as unknown as EventListenerOrEventListenerObject);

        this.addEventListener(formDisconnectedEvent, this.handleFormDisconnected as unknown as EventListenerOrEventListenerObject);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(formConnectedEvent, this.handleFormConnected as unknown as EventListenerOrEventListenerObject);

        this.removeEventListener(formDisconnectedEvent, this.handleFormDisconnected as unknown as EventListenerOrEventListenerObject);
    }

    handleFormConnected(event: CustomEvent): void {

        const {
            form
        } = event.detail;

        form.hideSubmitButton = true;

        this._forms.set(form.name, form);
    }

    handleFormDisconnected(event: CustomEvent): void {

        const {
            form
        } = event.detail;

        form.hideSubmitButton = false;

        this._forms.delete(form.name);
    }

    /**
     * Disables the back button if the step is the first one
     */
    private _hideBackButtonIfNecessary() {

        const backButton = (this.document as ShadowRoot).getElementById('button-back') as Button;

        backButton.hidden = this.selectedStep <= 0;
    }

    /**
     * Disables the next button if the step is the last one
     */
    private _hideNextButtonIfNecessary() {

        const nextButton = (this.document as ShadowRoot).getElementById('button-next') as Button;

        nextButton.hidden = this.selectedStep >= this.steps.length - 1;
    }

    /**
     * Disables the finish button if the step is the last one
     */
    private _hideFinishButtonIfNecessary() {

        const finishButton = (this.document as ShadowRoot).getElementById('button-finish') as Button;

        finishButton.hidden = this.selectedStep != this.steps.length - 1;
    }

    private _populateFormsFromSharedData() {

        this._forms.forEach(f => {

            f.setData(this.sharedData);
        });
    }

    private _populateSharedDataFromForms(): boolean {

        const forms = Array.from(this._forms.values());

        const results = forms.map(f => {

            if (!f.validate()) {

                return false;
            }

            this.sharedData = { ...this.sharedData, ...f.getData() };

            return true;
        });

        return !results.includes(false);
    }
}

defineCustomElement('gcs-wizard', Wizard);