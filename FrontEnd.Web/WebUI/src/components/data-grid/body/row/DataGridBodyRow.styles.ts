import css from "../../../../custom-element/styles/css";

export const dataGridBodyRowStyles = css`
:host {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
}

:host(:nth-of-type(even)) {
    background-color: var(--alt-bg-color);
}

:host(:nth-of-type(odd)) {
    background-color: var(--bg-color);
}`;