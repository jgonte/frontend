import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../../utils/types";
import { SelectionTypes } from "../../mixins/selection-container/SelectionContainer";
declare const ComboBox_base: CustomHTMLElementConstructor;
export default class ComboBox extends ComboBox_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    constructor();
    render(): NodePatchingData;
    renderHeader(): NodePatchingData;
    renderItem(record: GenericRecord): NodePatchingData;
    onSelectionChanged(selection: GenericRecord, oldSelection: GenericRecord, selectedChildren: CustomElement[]): void;
    renderContent(): NodePatchingData;
    renderSelectTemplate(): NodePatchingData;
    renderSingleSelectionTemplate(selection: string): NodePatchingData;
    renderMultipleSelectionTemplate(selection: SelectionTypes): NodePatchingData;
    beforeValueSet(value: unknown): unknown;
    onValueChanged(value: unknown, oldValue: unknown): void;
    private unwrapValue;
    private unwrapSingleValue;
}
export {};
