import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import { hoverableStyles } from "./Hoverable.styles";

export default function Hoverable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class HoverableMixin extends Base {

        static get styles(): string {

            return mergeStyles(super.styles, hoverableStyles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the element is hoverable
                 */
                hoverable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true
                }
            };
        }
    }
}