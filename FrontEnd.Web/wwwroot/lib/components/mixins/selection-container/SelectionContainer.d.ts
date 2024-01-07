import CustomElement from "../../../custom-element/CustomElement";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { GenericRecord } from "../../../utils/types";
export type SelectionTypes = Array<string> | GenericRecord;
export interface ISelectionContainer extends HTMLElement {
    isSelectionContainer: boolean;
    selection?: SelectionTypes;
    idField?: string;
    multiple?: boolean;
    selectionChanged?: (selection: SelectionTypes, oldSelection: SelectionTypes, selectedChildren: CustomElement[]) => void;
}
export default function SelectionContainer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase;
