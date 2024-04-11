import CustomElement from "../../custom-element/CustomElement";
import { RenderReturnTypes } from "../../custom-element/mixins/metadata/types/IRenderable";
declare const Panel_base: typeof CustomElement;
export default class Panel extends Panel_base {
    static get styles(): string;
    render(): RenderReturnTypes;
    getCollapsibleContent(): HTMLElement;
}
export {};
