import css from "../../../../custom-element/styles/css";

export const dataGridBodyRowStyles = css`
:host {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

:host(:nth-of-type(even)) {
    background-color: var(--alt-bg-color);
}

:host(:nth-of-type(odd)) {
    background-color: var(--bg-color);
}

.data-cell {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
}`;