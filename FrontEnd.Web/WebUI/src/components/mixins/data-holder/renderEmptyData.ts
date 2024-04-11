import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";

/**
 * Renders a message when there is no data for the component
 * It can be used for single or collection data holder
 * @param slot 
 * @returns 
 */
export default function renderEmptyData(slot: string | null = null) : NodePatchingData {

    return html`
<gcs-alert 
    kind="warning"
    slot=${slot}
>
    <gcs-localized-text>No Records Found</gcs-localized-text>
</gcs-alert>`;
}
