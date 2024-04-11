import css from "../../../custom-element/styles/css";
export const navigationLinkStyles = css `
:host {
    background-color: var(--gcs-bg-color-primary-2);
    color: var(--gcs-color-primary-2);
    margin: var(--gcs-margin);
}

:host([active]) {
    background-color: var(--gcs-bg-color-tertiary-1);
    color: var(--gcs-color-tertiary-1);
	transition: all 0.3s ease;
}

:host([active]:hover) {
    background-color: var(--gcs-bg-color-secondary-2);
    color: var(--gcs-color-secondary-2);
    transition: all 0.3s ease;
}`;
//# sourceMappingURL=NavigationLink.styles.js.map