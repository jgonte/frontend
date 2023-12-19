import Sizable from "../mixins/sizable/Sizable";
import Submittable from "../mixins/submittable/Submittable";
import Validatable from "../mixins/validatable/Validatable";
import Loadable from "../mixins/remote-loadable/RemoteLoadable";
import Successful from "../mixins/successful/Successful";
import Errorable from "../mixins/errorable/Errorable";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import { fieldAddedEvent, changeEvent } from "../fields/Field";
import { formStyles } from "./Form.styles";
import labelWidth from "./labelWidth";
import labelAlign from "./labelAlign";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { DataTypes } from "../../utils/data/DataTypes";
export const formConnectedEvent = "formConnectedEvent";
export const formDisconnectedEvent = "formDisconnectedEvent";
export default class Form extends Sizable(Submittable(Validatable(Loadable(Successful(Errorable(CustomElement)))))) {
    _fields = new Map();
    modifiedFields = new Set();
    constructor() {
        super();
        this.handleFieldAdded = this.handleFieldAdded.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }
    static get styles() {
        return formStyles;
    }
    static get properties() {
        return {
            labelWidth,
            labelAlign,
            hideSubmitButton: {
                attribute: 'hide-submit-button',
                type: DataTypes.Boolean,
                value: false
            }
        };
    }
    render() {
        const { labelWidth, labelAlign } = this;
        return html `<form>
            ${this.renderLoading()}
            ${this.renderSubmitting()}
            <slot label-width=${labelWidth} label-align=${labelAlign} key="form-fields"></slot>
            ${this._renderButton()}
        </form>`;
    }
    _renderButton() {
        if (this.hideSubmitButton) {
            return null;
        }
        return html `<gcs-button key="submit-button" kind="primary" variant="contained" click=${() => this.submit()}>
           <gcs-localized-text>Submit</gcs-localized-text>
           <gcs-icon name="box-arrow-right"></gcs-icon>
        </gcs-button>`;
    }
    getSubmitData() {
        return this.getData();
    }
    submit() {
        if (this.modifiedFields.size === 0) {
            this.error = 'This form has not been modified';
            return;
        }
        if (this.validate()) {
            super.submit();
        }
    }
    createValidationContext() {
        return {
            dataProvider: this,
            warnings: [],
            errors: []
        };
    }
    handleLoadedData(data) {
        this.setData((data.payload ?? data), true);
    }
    handleSubmitResponse(data) {
        console.log(JSON.stringify(data));
        const d = data.payload ?? data;
        this.setData(d, true);
    }
    setData(data, acceptChanges = false) {
        console.log(JSON.stringify(data));
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const field = this._fields.get(key);
                if (field !== undefined) {
                    const value = data[key];
                    field.value = value;
                    if (acceptChanges === true) {
                        field.acceptChanges();
                    }
                }
                else {
                    console.warn(`Field of name: '${key}' was not found for data member with same name`);
                }
            }
        }
    }
    getData() {
        const data = {};
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
    validate() {
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
        this.addEventListener(fieldAddedEvent, this.handleFieldAdded);
        this.addEventListener(changeEvent, this.handleChange);
        this.dispatchCustomEvent(formConnectedEvent, {
            form: this
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded);
        this.removeEventListener(changeEvent, this.handleChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        this.dispatchCustomEvent(formDisconnectedEvent, {
            form: this
        });
    }
    handleBeforeUnload(evt) {
        evt.preventDefault();
        evt.returnValue = '';
    }
    handleFieldAdded(event) {
        event.stopPropagation();
        const { field } = event.detail;
        field.form = this;
        this._fields.set(field.name, field);
    }
    handleChange(event) {
        event.stopPropagation();
        const { name, newValue } = event.detail;
        console.log('valueChanged: ' + JSON.stringify(event.detail));
        this.setData({
            [name]: newValue
        });
        setTimeout(() => {
            if (this.modifiedFields.size > 0) {
                window.addEventListener('beforeunload', this.handleBeforeUnload);
            }
            else {
                window.removeEventListener('beforeunload', this.handleBeforeUnload);
            }
        });
    }
}
defineCustomElement('gcs-form', Form);
//# sourceMappingURL=Form.js.map