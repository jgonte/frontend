import css from "../../../custom-element/styles/css";

export const dataGridHeaderStyles = css`
:host {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    background-color: var(--header-bg-color);
    color: var(--header-text-color)
}`;