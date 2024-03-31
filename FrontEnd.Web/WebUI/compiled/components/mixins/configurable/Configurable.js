import { DataTypes } from "../../../utils/data/DataTypes";
export default function Configurable(Base) {
    return class ConfigurableMixin extends Base {
        static get properties() {
            return {
                source: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Function
                    ],
                    defer: true,
                    canChange: function () {
                        return true;
                    },
                    afterChange: async function (value) {
                        await this.updateComplete;
                        const descriptor = (typeof value === "function" ?
                            value() :
                            value);
                        this.configure(descriptor);
                    }
                }
            };
        }
    };
}
//# sourceMappingURL=Configurable.js.map