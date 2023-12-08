import css from "../../custom-element/styles/css";
export const dropDownStyles = css `
:host {
  position: relative;
  border-width: var(--gcs-border-width);
  padding: 0 0 0 1rem;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.show {
    display:block;
}`;
//# sourceMappingURL=DropDown.styles.js.map