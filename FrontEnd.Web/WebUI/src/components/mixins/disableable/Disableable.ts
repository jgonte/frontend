import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElement from "../../../custom-element/mixins/metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import { disableableStyles } from "./Disableable.styles";

export default function Disableable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class DisableableMixin extends Base {

        static get styles(): string {

            return mergeStyles(super.styles, disableableStyles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the element is disabled
                 */
                disabled: {
                    type: DataTypes.Boolean,
                    value: false,
                    reflect: true,
                    inherit: true, // When set in a form field or a form, propagate to its children
                    afterChange: (value: unknown): void => {

                        if (value === true) {

                            (this as unknown as CustomHTMLElement).enableEvents?.();
                        }
                        else {

                            (this as unknown as CustomHTMLElement).disableEvents?.();
                        }
                    }
                }
            };
        }

    }
}