import css from "../../custom-element/styles/css";

export const toolTipStyles = css`
:host {
    position: relative;
    display: inline-block;
}
  
#content {
    position: absolute; 
    visibility: hidden;
    background-color: var(--gcs-tooltip-bg-color);
    color: var(--gcs-tooltip-color);
    padding: var(--gcs-padding);
    border-radius: var(--gcs-border-radius);
    opacity: 0;
    transition: opacity 0.3s;
}

/* position */
.top {
    left: 50%;
    bottom: 100%;
    transform: translateX(-50%);
}

.bottom {
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
}

.left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
}

.right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
}

/* arrow */
#content::after {
    content: "";
    position: absolute;
    border-width: 5px;
    border-style: solid;
}

#content.top::after {
    top: 100%; /* At the bottom of the tooltip */  
    left: 50%;
    margin-left: -5px;
    border-color: var(--gcs-tooltip-bg-color) transparent transparent transparent;
}

#content.bottom::after {
    bottom: 100%;  /* At the top of the tooltip */
    left: 50%;
    margin-left: -5px; 
    border-color: transparent transparent var(--gcs-tooltip-bg-color) transparent;
}

#content.left::after {
    top: 50%;
    left: 100%; /* To the right of the tooltip */
    margin-top: -5px;
    border-color: transparent transparent transparent var(--gcs-tooltip-bg-color);
}

#content.right::after {
    top: 50%;
    right: 100%; /* To the left of the tooltip */   
    margin-top: -5px;
    border-color: transparent var(--gcs-tooltip-bg-color) transparent transparent;
}
  
/* Show the container text when you mouse over the container container */
:host(:hover) #content {
    visibility: visible;
    opacity: 1;
}`;