import css from "../../../custom-element/styles/css";

export const selectableStyles = css`
:host([selected]) {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
	transition: all 0.3s ease;
}

:host([selected]:hover) {
    background-color: var(--active-hover-bg-color);
    color: var(--active-hover-text-color);
    transition: all 0.3s ease;
}`;