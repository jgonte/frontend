import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";

export default function renderTip(kind: string, trigger: string, text: string = ''): NodePatchingData {

    return html`<gcs-tool-tip>
        <gcs-pill kind=${kind} slot="trigger">${trigger}</gcs-pill>
        <gcs-localized-text slot="content">${text}</gcs-localized-text>
    </gcs-tool-tip>`;
}