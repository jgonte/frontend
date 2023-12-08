import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
export default class HashRouter extends CustomElement {
    private _lastHash?;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    route(): void;
    private _routeMatches;
    private _getSource;
    rewriteHash(path: string): void;
}
