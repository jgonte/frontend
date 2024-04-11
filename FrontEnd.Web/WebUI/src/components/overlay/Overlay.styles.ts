import css from "../../custom-element/styles/css";

export const overlayStyles = css`
:host {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: var(--gcs-bg-color-primary-3);
    transition: 0.3s;
    /* center */
    display: flex;
    align-items: center;
    justify-content: center;
}`