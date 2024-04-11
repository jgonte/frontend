import css from "../../custom-element/styles/css";
export const panelStyles = css `
:host {
    display: grid;
    grid-template-rows: auto 1fr auto;
    background-color: var(--bg-color);
    border: var(--gcs-border-width) solid var(--gcs-bg-color-primary-3);
    border-radius: var(--gcs-border-radius);
    margin: var(--gcs-margin);
    background-color: var(--gcs-bg-color-primary-1);
    color: var(--gcs-color-primary-1);
}

#body {
    overflow: auto;
}

#header,
#footer {
    background-color: var(--gcs-bg-color-primary-3);
    color: var(--gcs-color-primary-3);
}

#collapsible-content {
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
}`;
//# sourceMappingURL=Panel.styles.js.map