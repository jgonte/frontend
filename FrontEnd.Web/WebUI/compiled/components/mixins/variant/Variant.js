import { variants } from "../../../design-system/createVariantStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
export default function Variant(Base) {
    return class VariantMixin extends Base {
        static get properties() {
            return {
                variant: {
                    type: DataTypes.String,
                    value: variants[0],
                    reflect: true,
                    inherit: true,
                    options: variants
                }
            };
        }
    };
}
//# sourceMappingURL=Variant.js.map