import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import IntlProvider from "../../services/intl/IntlProvider";
declare const LocalizedText_base: CustomHTMLElementConstructor;
export default class LocalizedText extends LocalizedText_base {
    static get styles(): string;
    private _key;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): NodePatchingData;
    handleLanguageChanged(provider: IntlProvider): void;
}
export {};
