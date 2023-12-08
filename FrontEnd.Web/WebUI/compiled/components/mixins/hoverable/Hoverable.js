import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import { hoverableStyles } from "./Hoverable.styles";
export default function Hoverable(Base) {
    return class HoverableMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, hoverableStyles);
        }
        static get properties() {
            return {
                hoverable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true
                }
            };
        }
    };
}
//# sourceMappingURL=Hoverable.js.map