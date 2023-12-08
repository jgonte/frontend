import css from "../../../custom-element/styles/css";
export const formFieldStyles = css `
:host {
    display: block;
}

#labeled-field {
    display: flex;
    flex-wrap: wrap;
}

#label-container {
    display: grid;
    grid-template-columns: 1fr auto;   
    /* flex-grow: 1; We want to keep the labels with fixed width. not to expand them */
    background-color: var(--alt-bg-color);
    border-radius: var(--gcs-border-radius);
    
}

#label {
    display: flex;
    align-items: center;
    /* background-color: yellow; */
}

/* #tools {
    background-color: lightsalmon;
} */

#field {
    display: flex;
    align-items: center;
    flex-grow: 1;
    /* background-color: lightseagreen; */ 
}`;
//# sourceMappingURL=FormField.styles.js.map