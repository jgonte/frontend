import css from "../../custom-element/styles/css";

export const alertStyles = css`
:host {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: inherit;
    border: var(--gcs-border-width) solid;
    border-radius: var(--gcs-border-radius);
    max-width: 90vw;
}

.item {
    margin: var(--gcs-margin);
}

.middle {
    word-wrap: break-word; 
    max-height: 80vh; 
    overflow: auto;
}`;