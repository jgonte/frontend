import css from "../../custom-element/styles/css";

export const toolbarStyles = css`
:host {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    border-width: var(--gcs-border-width);
    border-radius: var(--gcs-border-radius);
    padding: var(--gcs-padding);
    /* background-color: var(--gcs-bg-color-primary-2);
    color: var(--gcs-color-primary-2); */
}

.item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--gcs-padding);
}`;