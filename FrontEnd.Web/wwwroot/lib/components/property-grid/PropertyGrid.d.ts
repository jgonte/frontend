import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { RenderReturnTypes } from "../../custom-element/mixins/metadata/types/IRenderable";
import { IComponentDescriptor } from "../mixins/configurable/models/IComponentDescriptor";
declare const PropertyGrid_base: typeof CustomElement;
export default class PropertyGrid extends PropertyGrid_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): RenderReturnTypes;
    configure(source: IComponentDescriptor): void;
    private _renderLabel;
    private _renderIcon;
    private _renderBody;
}
export {};
