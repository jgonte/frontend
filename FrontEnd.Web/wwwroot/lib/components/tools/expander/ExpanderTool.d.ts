import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import Tool from "../Tool";
export declare const expanderChanged = "expanderChanged";
export default class ExpanderTool extends Tool {
    constructor();
    static get state(): Record<string, CustomElementStateMetadata>;
    iconName: () => "chevron-down" | "chevron-up";
    hideContent(): void;
    updateShowing(showing: boolean): void;
    handleClick(): void;
}
