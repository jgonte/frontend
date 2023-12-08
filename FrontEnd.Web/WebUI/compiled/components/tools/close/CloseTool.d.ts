import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import Tool from "../Tool";
export declare const closingEvent = "closingEvent";
export default class CloseTool extends Tool {
    constructor();
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    handleClick(): void;
}
