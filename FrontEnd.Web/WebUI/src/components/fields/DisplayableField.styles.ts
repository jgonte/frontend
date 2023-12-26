import css from "../../custom-element/styles/css";

export const displayableFieldStyles = css`
input, 
select,
textarea {
    flex: 1 0 0px;
    outline: none;
    border-style: solid;
    border-color: #d0d0d0;
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
    border-style: solid;
    border-color: var(--header-bg-color)
}`;