import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import getContentTextNode from "../../custom-element/helpers/getContentTextNode";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import appCtrl from "../../services/appCtrl";
import { DataTypes } from "../../utils/data/DataTypes";
import { localizedTextStyles } from "./LocalizedText.styles";
export default class LocalizedText extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, localizedTextStyles);
    }
    _key = '';
    static get properties() {
        return {
            lang: {
                type: DataTypes.String,
                reflect: true
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        const { intlProvider } = appCtrl;
        if (!intlProvider) {
            console.log('intlProvider is null');
        }
        else {
            const pageLang = document.documentElement.lang || navigator.language;
            console.log(`Page language: ${pageLang}`);
            const lang = this.lang || intlProvider?.lang;
            if (pageLang !== lang) {
                intlProvider?.subscribe(this);
                const textNode = getContentTextNode(this);
                if (textNode === null) {
                    throw new Error('Localized text must have content');
                }
                const content = textNode?.textContent || '';
                this._key = content;
                textNode.textContent = intlProvider?.getTranslation(lang, this._key) || content;
            }
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        if (this._key) {
            appCtrl.intlProvider?.unsubscribe(this);
        }
    }
    render() {
        return html `<slot></slot>`;
    }
    handleLanguageChanged(provider) {
        const { _key, lang } = this;
        const textNode = getContentTextNode(this);
        if (textNode === null) {
            throw new Error('Localized text must have content');
        }
        textNode.textContent = provider?.getTranslation(lang, _key) || textNode.textContent;
    }
}
defineCustomElement('gcs-localized-text', LocalizedText);
//# sourceMappingURL=LocalizedText.js.map