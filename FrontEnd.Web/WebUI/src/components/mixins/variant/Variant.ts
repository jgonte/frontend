import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { variants } from "../../../design-system/createVariantStyles";
import { DataTypes } from "../../../utils/data/DataTypes";

export default function Variant<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class VariantMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                  * The variant of the element
                  */
                variant: {
                    type: DataTypes.String,
                    value: variants[0],
                    reflect: true,
                    inherit: true,
                    options: variants
                }
            };
        }

        // The Kind mixin also handles the variant styles since they are related
    }
}