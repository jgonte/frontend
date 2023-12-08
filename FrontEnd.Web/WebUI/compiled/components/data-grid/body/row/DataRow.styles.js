import css from "../../../../custom-element/styles/css";
export const dataRowStyles = css `
:host {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    line-height: 1.5;
}

:host(:nth-of-type(even)) {
    background-color: var(--alt-bg-color);
}

:host(:nth-of-type(odd)) {
    background-color: var(--bg-color);
}`;
//# sourceMappingURL=DataRow.styles.js.map