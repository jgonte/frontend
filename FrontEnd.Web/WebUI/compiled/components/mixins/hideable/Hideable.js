import { DataTypes } from "../../../utils/data/DataTypes";
export default function Hideable(Base) {
    return class HideableMixin extends Base {
        static get properties() {
            return {
                hidden: {
                    type: DataTypes.Boolean,
                    value: false,
                    reflect: true
                }
            };
        }
        render() {
            if (this.hidden === true) {
                return null;
            }
            return super.render();
        }
    };
}
//# sourceMappingURL=Hideable.js.map