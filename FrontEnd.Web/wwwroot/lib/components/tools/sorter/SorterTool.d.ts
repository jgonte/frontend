import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import Tool from "../Tool";
export declare const sorterChanged = "sorterChanged";
export default class SorterTool extends Tool {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    static get state(): Record<string, CustomElementStateMetadata>;
    iconName: () => "arrow-down-up" | "arrow-up" | "arrow-down";
    handleClick(): void;
}
