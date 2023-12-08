import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import Clickable from "../mixins/clickable/Clickable";
import Nuanced from "../Nuanced";

export default abstract class Tool
    extends Clickable(
        Nuanced
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * What action to execute when the tool has been closed
             */
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

    render(): NodePatchingData {

        const {
            iconName,
        } = this;

        return html`<gcs-icon name=${typeof iconName === 'function' ? iconName() : iconName}></gcs-icon>`;
    }
}