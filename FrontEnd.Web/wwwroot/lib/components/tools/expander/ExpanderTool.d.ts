import Tool from "../Tool";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
export declare const expanderChangedEvent = "expanderChanged";
export default class ExpanderTool extends Tool {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    iconName: () => "chevron-down" | "chevron-up";
    handleClick(evt: Event): void;
}
