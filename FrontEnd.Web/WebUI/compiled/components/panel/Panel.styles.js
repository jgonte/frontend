import css from "../../custom-element/styles/css";
export const panelStyles = css `
:host {
    display: grid;
    grid-template-rows: auto 1fr auto;
}

#header,
#footer {
    background-color: var(--header-bg-color);
    color: var(--header-text-color);
}`;
//# sourceMappingURL=Panel.styles.js.map