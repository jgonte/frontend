import css from "../../custom-element/styles/css";

export const panelStyles = css`
:host {
    display: grid;
    grid-template-rows: auto 1fr auto;
    background-color: var(--bg-color);
    border-radius: var(--gcs-border-radius)
}

#header,
#footer {
    background-color: var(--header-bg-color);
    color: var(--header-text-color);
}`;