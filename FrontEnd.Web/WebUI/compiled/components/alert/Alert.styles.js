import css from "../../custom-element/styles/css";
export const alertStyles = css `
:host {
    display: flex;
    max-width: 80%;
    max-height: 80%;
    align-items: center;  
    justify-content: space-between;
    border-style: solid;
    border-width: var(--gcs-border-width);
    column-gap: 1rem;
    border-radius: var(--gcs-border-radius);
    z-index: 10000;
}`;
//# sourceMappingURL=Alert.styles.js.map