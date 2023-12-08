import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import createSizeStyles, { sizes } from "../../../design-system/createSizeStyles"
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";

export default function Sizable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SizableMixin extends Base {

        static get styles(): string {

            return mergeStyles(super.styles, createSizeStyles(this));
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                size: {
                    type: DataTypes.String,
                    value: sizes[1], //medium
                    reflect: true,
                    inherit: true,
                    options: sizes
                }
            };
        }
    }
}