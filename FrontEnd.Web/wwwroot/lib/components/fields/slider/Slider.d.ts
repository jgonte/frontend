import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import DisplayableField from "../DisplayableField";
export default class Slider extends DisplayableField {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    refreshSlider(value: number): void;
    connectedCallback(): void;
    updateX(x: number): void;
    eventHandler(e: MouseEvent): void;
}
