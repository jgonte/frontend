import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";

export function renderEmptyData(slot: string | null = null) : NodePatchingData {

    return html`
<gcs-alert 
    kind="warning"
    slot=${slot}
>
    <gcs-localized-text>No Records Found</gcs-localized-text>
</gcs-alert>`;
}