import css from "../../../custom-element/styles/css";

export const navigationBarStyles = css`
:host {
    margin: var(--gcs-margin);
}
.horizontal {
    display: flex;
    justify-content: space-evenly;
}

.vertical {    
    flex-shrink: 0;
}`;