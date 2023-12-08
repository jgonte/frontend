import html from "../../rendering/html";
export default function renderTip(kind, trigger, text = '') {
    return html `<gcs-tool-tip>
        <gcs-pill kind=${kind} slot="trigger">${trigger}</gcs-pill>
        <gcs-localized-text slot="content">${text}</gcs-localized-text>
    </gcs-tool-tip>`;
}
//# sourceMappingURL=renderTip.js.map