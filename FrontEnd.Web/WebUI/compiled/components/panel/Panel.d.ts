import CustomElement from "../../custom-element/CustomElement";
import { RenderReturnTypes } from "../../custom-element/mixins/metadata/types/IRenderable";
export default class Panel extends CustomElement {
    static get styles(): string;
    render(): RenderReturnTypes;
}
