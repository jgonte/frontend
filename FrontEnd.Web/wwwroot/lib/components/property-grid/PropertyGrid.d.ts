import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { RenderReturnTypes } from "../../custom-element/mixins/metadata/types/IRenderable";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";
import { IComponentDescriptor } from "../mixins/configurable/models/IComponentDescriptor";
declare const PropertyGrid_base: typeof CustomElement;
export default class PropertyGrid extends PropertyGrid_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): RenderReturnTypes;
    configure(source: IComponentDescriptor): void;
    private _renderLabel;
    private _renderIcon;
    _applyTemplate(record: GenericRecord): NodePatchingData;
}
export {};
