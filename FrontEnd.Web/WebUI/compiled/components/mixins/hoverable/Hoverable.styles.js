import css from "../../../custom-element/styles/css";
export const hoverableStyles = css `
:host([hoverable]:hover) {
    background-color: var(--hover-bg-color);
    color: var(--hover-text-color);
    transition: all 0.3s ease;
}`;
//# sourceMappingURL=Hoverable.styles.js.map