import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { ISelectionContainer } from "./SelectionContainer";
export interface ISelectionContainerHolder {
    selectionContainer?: ISelectionContainer;
}
export default function SelectionContainerPassthrough<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase;
