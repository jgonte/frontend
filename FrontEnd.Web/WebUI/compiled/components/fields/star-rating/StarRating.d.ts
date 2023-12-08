import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { SelectionTypes } from "../../mixins/selection-container/SelectionContainer";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
declare const StarRating_base: CustomHTMLElementConstructor;
export default class StarRating extends StarRating_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData[];
    selectionChanged: (selection: SelectionTypes) => void;
}
export {};
