import css from "../../../custom-element/styles/css";
export const disableableStyles = css `
:host([disabled="true"]),
:host([disabled=""]) {
    cursor: not-allowed;
}

*[disabled="true"],
*[disabled=""] {
    cursor: not-allowed;
}`;
//# sourceMappingURL=Disableable.styles.js.map