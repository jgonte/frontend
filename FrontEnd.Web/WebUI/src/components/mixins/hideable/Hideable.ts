import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { RenderReturnTypes } from "../../../custom-element/mixins/metadata/types/IRenderable";
import { DataTypes } from "../../../utils/data/DataTypes";

export default function Hideable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class HideableMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                hidden: {
                    type: DataTypes.Boolean,
                    value: false,
                    reflect: true
                }
            };
        }

        render(): RenderReturnTypes {

            if (this.hidden === true) {

                return null;
            }

            return super.render();
        }
    };
}