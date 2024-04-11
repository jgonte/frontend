import html from "../../../rendering/html";
export default function renderEmptyData(slot = null) {
    return html `
<gcs-alert 
    kind="warning"
    slot=${slot}
>
    <gcs-localized-text>No Records Found</gcs-localized-text>
</gcs-alert>`;
}
//# sourceMappingURL=renderEmptyData.js.map