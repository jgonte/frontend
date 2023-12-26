import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import getContentTextNode from "../../custom-element/helpers/getContentTextNode";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import appCtrl from "../../services/appCtrl";
import IntlProvider from "../../services/intl/IntlProvider";
import { DataTypes } from "../../utils/data/DataTypes";
import { localizedTextStyles } from "./LocalizedText.styles";

export default class LocalizedText extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, localizedTextStyles);
    }

    private _key: string = '';

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The language to translate to if different from the page
             */
            lang: {
                type: DataTypes.String,
                reflect: true
            }
        };
    }

    connectedCallback() {

        super.connectedCallback?.();

        const {
            intlProvider
        } = appCtrl;

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

                this._key = content; // Keep the initial value as the key

                // Replace the content with the translated one
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

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }

    handleLanguageChanged(provider: IntlProvider) {

        const {
            _key,
            lang
        } = this;

        const textNode = getContentTextNode(this);

        if (textNode === null) {

            throw new Error('Localized text must have content');
        }

        // Replace the content with the translated one
        textNode.textContent = provider?.getTranslation(lang, _key) || textNode.textContent;
    }
}

defineCustomElement('gcs-localized-text', LocalizedText);