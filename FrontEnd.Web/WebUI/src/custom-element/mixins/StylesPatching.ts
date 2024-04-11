import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";

/**
 * Updates the element by patching the styles
 * @param Base 
 * @returns 
 */
export default function StylesPatching<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class StylesPatchingMixin extends Base {

        beforeRender(patchingData: NodePatchingData): NodePatchingData {

            const {
                constructor,
                stylesAdded = false
            } = this;

            const styles = (constructor as CustomHTMLElementConstructor).metadata.styles;

            if (styles !== undefined &&
                stylesAdded === false) { // Add a style element to the document

                patchingData = this.addStyles(patchingData, styles);

                this.stylesAdded = true;
            }

            return patchingData;
        }

        addStyles(node: NodePatchingData, styles: string): NodePatchingData {

            const {
                shadowRoot
            } = this;

            const styleNode = document.createElement('style');

            const styleContent = document.createTextNode(styles);

            styleNode.appendChild(styleContent);

            // Not optimal adding the same style sheet to the shadow root when the component is constructed
            // Better to add an adopted stylesheet but that is not widely supported by all the browsers
            // Or add the stylesheet to the template content since it is a static text but then the component can have different patching data
            // and we need to research the relation between component and patching data
            if (shadowRoot !== null) {

                shadowRoot.appendChild(styleNode); // Append the style
            }
            else { // this.shadowRoot === null

                document.body.appendChild(styleNode); // Append the style to the document
            }

            return node;
        }
    }
}