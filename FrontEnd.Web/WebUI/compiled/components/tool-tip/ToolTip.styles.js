import css from "../../custom-element/styles/css";
export const toolTipStyles = css `
.container {
    position: relative;
    display: inline-block;
}
  
.container #content {
    visibility: hidden;
    background-color: #555;
    color: #fff;
    padding: 5px 0;
    border-radius: 6px;
  
    /* position the content */
    position: absolute;
    z-index: 1;  
  
    /* fade in container */
    opacity: 0;
    transition: opacity 0.3s;
}

/* position */
.container #content.top {
    bottom: 100%;
    left: 50%;
    margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
}

.container #content.bottom {
    top: 100%;
    left: 50%;
    margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
}

.container #content.left {
    top: -5px;
    right: 105%;
}

.container #content.right {
    top: -5px;
    left: 105%;
}

/* arrow */
.container #content::after {
    content: "";
    position: absolute;
    border-width: 5px;
    border-style: solid;
}

.container #content.top::after {
    top: 100%; /* At the bottom of the tooltip */  
    left: 50%;
    margin-left: -5px;
    border-color: black transparent transparent transparent;
}

.container #content.bottom::after {
    bottom: 100%;  /* At the top of the tooltip */
    left: 50%;
    margin-left: -5px; 
    border-color: transparent transparent black transparent;
}

.container #content.left::after {
    top: 50%;
    left: 100%; /* To the right of the tooltip */
    margin-top: -5px;
    border-color: transparent transparent transparent black;
}

.container #content.right::after {
    top: 50%;
    right: 100%; /* To the left of the tooltip */   
    margin-top: -5px;
    border-color: transparent black transparent transparent;
}
  
/* Show the container text when you mouse over the container container */
.container:hover #content {
    visibility: visible;
    opacity: 1;
}`;
//# sourceMappingURL=ToolTip.styles.js.map