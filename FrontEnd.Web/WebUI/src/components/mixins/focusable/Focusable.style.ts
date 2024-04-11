import css from "../../../custom-element/styles/css";

export const focusableStyles = css`
:host(:focus),
:host(:focus-visible) {
    border: solid var(--gcs-bg-color-primary-3);
}`;