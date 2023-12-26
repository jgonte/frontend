import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
import isClass from "../../utils/isClass";
import { formConnectedEvent, formDisconnectedEvent } from "../form/Form";
import Submittable from "../mixins/submittable/Submittable";
export default class Wizard extends Submittable(CustomElement) {
    sharedData = {};
    _forms = new Map();
    static get properties() {
        return {
            steps: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
            },
            start: {
                type: DataTypes.Function,
                defer: true
            },
            back: {
                type: DataTypes.Function,
                defer: true
            },
            next: {
                type: DataTypes.Function,
                defer: true
            },
            finish: {
                type: DataTypes.Function,
                defer: true
            },
            done: {
                type: DataTypes.Function,
                defer: true
            }
        };
    }
    static get state() {
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
    render() {
        return html `
${this.renderStep()}
${this.renderButtons()}
`;
    }
    renderStep() {
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
    renderButtons() {
        return html `
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
    handleBack() {
        --this.selectedStep;
        this._hideBackButtonIfNecessary();
        this._hideNextButtonIfNecessary();
        this._hideFinishButtonIfNecessary();
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
    handleNext() {
        if (this.next === undefined) {
            if (this._populateSharedDataFromForms() === false) {
                return;
            }
        }
        else {
            const forms = Array.from(this._forms.values());
            if (this.next(forms) === false) {
                return;
            }
        }
        ++this.selectedStep;
        this._hideBackButtonIfNecessary();
        this._hideNextButtonIfNecessary();
        this._hideFinishButtonIfNecessary();
    }
    handleFinish() {
        if (this.finish === undefined) {
            if (this._populateSharedDataFromForms() === false) {
                return;
            }
            this.submit();
        }
        else {
            const forms = Array.from(this._forms.values());
            this.finish(forms);
        }
    }
    handleSubmitResponse(data) {
        this.done?.(data);
    }
    getSubmitData() {
        return this.sharedData;
    }
    didMountCallback() {
        this._hideBackButtonIfNecessary();
        this._hideNextButtonIfNecessary();
        this._hideFinishButtonIfNecessary();
        this.start?.();
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(formConnectedEvent, this.handleFormConnected);
        this.addEventListener(formDisconnectedEvent, this.handleFormDisconnected);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(formConnectedEvent, this.handleFormConnected);
        this.removeEventListener(formDisconnectedEvent, this.handleFormDisconnected);
    }
    handleFormConnected(event) {
        const { form } = event.detail;
        form.hideSubmitButton = true;
        this._forms.set(form.name, form);
    }
    handleFormDisconnected(event) {
        const { form } = event.detail;
        form.hideSubmitButton = false;
        this._forms.delete(form.name);
    }
    _hideBackButtonIfNecessary() {
        const backButton = this.document.getElementById('button-back');
        backButton.hidden = this.selectedStep <= 0;
    }
    _hideNextButtonIfNecessary() {
        const nextButton = this.document.getElementById('button-next');
        nextButton.hidden = this.selectedStep >= this.steps.length - 1;
    }
    _hideFinishButtonIfNecessary() {
        const finishButton = this.document.getElementById('button-finish');
        finishButton.hidden = this.selectedStep != this.steps.length - 1;
    }
    _populateFormsFromSharedData() {
        this._forms.forEach(f => {
            f.setData(this.sharedData);
        });
    }
    _populateSharedDataFromForms() {
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
//# sourceMappingURL=Wizard.js.map