import css from "../../custom-element/styles/css";
export const displayableFieldStyles = css `
input, 
select,
textarea {
    flex: 1 0 0px;
    outline: none;
    border-style: solid;
    border-color: #d0d0d0;
    border-radius: var(--gcs-border-radius);
    font-size: inherit;
}

textarea,
select {
    min-width: 200px;
    font-family: inherit;
}

input[type='date'] {
    font-family: inherit;
}

input:focus,
textarea:focus,
select:focus {
    border: solid var(--gcs-header-bg-color);
}`;
//# sourceMappingURL=DisplayableField.styles.js.map