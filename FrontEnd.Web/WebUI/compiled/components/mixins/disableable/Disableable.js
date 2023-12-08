import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import { disableableStyles } from "./Disableable.styles";
export default function Disableable(Base) {
    return class DisableableMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, disableableStyles);
        }
        static get properties() {
            return {
                disabled: {
                    type: DataTypes.Boolean,
                    value: false,
                    reflect: true,
                    inherit: true,
                    afterChange: (value) => {
                        if (value === true) {
                            this.enableEvents?.();
                        }
                        else {
                            this.disableEvents?.();
                        }
                    }
                }
            };
        }
    };
}
//# sourceMappingURL=Disableable.js.map