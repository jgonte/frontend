import css from "../../../../custom-element/styles/css";

export const dataGridHeaderCellStyles = css`
:host {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0.5em;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0px;
    white-space: nowrap;

    white-space: normal;
    justify-content: start;
    font-weight: 700;
}`;