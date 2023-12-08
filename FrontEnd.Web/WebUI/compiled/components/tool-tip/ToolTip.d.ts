import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
export default class ToolTip extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    connectedCallback(): void;
    didMountCallback(): void;
    didUpdateCallback(): void;
    handleResize(): void;
    private _positionContent;
    getFittingPosition(trigger: HTMLElement, content: HTMLElement, pos: string): string;
}
