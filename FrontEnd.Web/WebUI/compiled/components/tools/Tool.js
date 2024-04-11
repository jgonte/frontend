import iconName from "../icon/props/iconName";
import html from "../../rendering/html";
import Clickable from "../mixins/clickable/Clickable";
import Nuanced from "../Nuanced";
export default class Tool extends Clickable(Nuanced) {
    static get properties() {
        return {
            iconName: iconName(true)
        };
    }
    render() {
        const { iconName, } = this;
        return html `<gcs-icon name=${typeof iconName === 'function' ? iconName() : iconName}></gcs-icon>`;
    }
}
//# sourceMappingURL=Tool.js.map