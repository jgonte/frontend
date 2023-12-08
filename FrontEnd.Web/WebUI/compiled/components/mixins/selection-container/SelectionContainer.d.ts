import CustomElement from "../../../custom-element/CustomElement";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
export type SelectionTypes = Array<string> & {
    [x: string]: string;
};
export interface ISelectionContainer extends HTMLElement {
    isSelectionContainer: boolean;
    selectionChanged?: (selection: SelectionTypes, selectedChildren: CustomElement[]) => void;
}
export default function SelectionContainer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase;
