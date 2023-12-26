import css from "../../custom-element/styles/css";

export const rowStyles = css`
:host {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: inherit;
    border-color: inherit;
    border-radius: inherit;
}

.item {
    padding: var(--gcs-padding);
}

.middle {
    word-wrap: break-word; 
    max-height: 80vh; 
    overflow: auto;
}`;