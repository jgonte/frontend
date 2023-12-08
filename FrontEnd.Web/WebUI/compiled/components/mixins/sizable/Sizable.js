import createSizeStyles, { sizes } from "../../../design-system/createSizeStyles";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
export default function Sizable(Base) {
    return class SizableMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, createSizeStyles(this));
        }
        static get properties() {
            return {
                size: {
                    type: DataTypes.String,
                    value: sizes[1],
                    reflect: true,
                    inherit: true,
                    options: sizes
                }
            };
        }
    };
}
//# sourceMappingURL=Sizable.js.map