import Tool from "../Tool";
import { IContentHidable } from "../../../utils/types";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
export declare const expanderChangedEvent = "expanderChangedEvent";
export default class ExpanderTool extends Tool implements IContentHidable {
    constructor();
    static get state(): Record<string, CustomElementStateMetadata>;
    iconName: () => "chevron-down" | "chevron-up";
    hideContent(): void;
    updateShowing(showing: boolean): void;
    handleClick(evt: Event): void;
}
