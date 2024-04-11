import css from "../../../custom-element/styles/css";
export const collapsibleStyles = css `
:host([disabled="true"]),
:host([disabled=""]) {
    cursor: not-allowed;
}

*[disabled="true"],
*[disabled=""] {
    cursor: not-allowed;
}`;
//# sourceMappingURL=Collapsible.styles.js.map