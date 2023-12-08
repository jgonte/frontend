import css from "../../custom-element/styles/css";

export const accordionStyles = css`
:host {   
    display: block;
    width: 100%;
}

#content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
}`;