import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import iconName from "../icon/props/iconName";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Clickable from "../mixins/clickable/Clickable";
import Nuanced from "../Nuanced";

export default abstract class Tool
    extends Clickable(
        Nuanced
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            iconName: iconName(true)
        };
    }

    render(): NodePatchingData {

        const {
            iconName,
        } = this;

        return html`<gcs-icon name=${typeof iconName === 'function' ? iconName() : iconName}></gcs-icon>`;
    }
}