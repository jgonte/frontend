import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import IntlProvider from "../../services/intl/IntlProvider";
export default class LocalizedText extends CustomElement {
    static get styles(): string;
    private _key;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): NodePatchingData;
    handleLanguageChanged(provider: IntlProvider): void;
}
