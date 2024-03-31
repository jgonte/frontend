import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
declare const PropertyGridRow_base: typeof CustomElement;
export default class PropertyGridRow extends PropertyGridRow_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleKeyDown(event: KeyboardEvent): void;
    render(): NodePatchingData;
    handleClick(): void;
}
export {};
