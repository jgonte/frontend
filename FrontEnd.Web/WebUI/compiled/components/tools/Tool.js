import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
import Clickable from "../mixins/clickable/Clickable";
import Nuanced from "../Nuanced";
export default class Tool extends Clickable(Nuanced) {
    static get properties() {
        return {
            iconName: {
                type: [
                    DataTypes.String,
                    DataTypes.Function
                ],
                defer: true,
                required: true
            }
        };
    }
    render() {
        const { iconName, } = this;
        return html `<gcs-icon name=${typeof iconName === 'function' ? iconName() : iconName}></gcs-icon>`;
    }
}
//# sourceMappingURL=Tool.js.map