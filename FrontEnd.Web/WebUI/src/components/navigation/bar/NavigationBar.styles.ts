import css from "../../../custom-element/styles/css";

export const navigationBarStyles = css`
:host {  
    background-color: var(--alt-bg-color);
    display: flex;
    height: 100%;
}

.horizontal {
    display: flex;
    justify-content: space-evenly;   
}

.vertical {    
    flex-basis: 250px;
    flex-shrink: 0;
}`;