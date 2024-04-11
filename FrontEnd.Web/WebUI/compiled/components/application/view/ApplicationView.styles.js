import css from "../../../custom-element/styles/css";
export const applicationViewStyles = css `
:host {
  	/* Ensure it covers the entire viewport */
  	position: fixed;
  	top: 0;
  	bottom: 0;
  	width: 100%;
  	overflow: hidden;
  	//pointer-events: none; /* The user can click through it */
  	transition: background-color 300ms ease-in; /* Background color animation used for the backdrop */
  	/* Holy grail layout */
  	display: grid;
  	grid-template: auto auto 1fr auto / auto 1fr auto;
}

#header,
#subheader,
#footer {
  	grid-column: 1 / 4;
}

#header,
#footer {
  	grid-column: 1 / 4;
	background-color: var(--gcs-bg-color-primary-3);
	color: var(--gcs-color-primary-3);
	padding: var(--gcs-padding);
}

#subheader { 
	background-color: var(--gcs-bg-color-primary-2);
	color: var(--gcs-color-primary-2);
}

#left {
	grid-column: 1 / 2;
}

#center {
	grid-column: 2 / 3;
}

#right {
	grid-column: 3 / 4;
}

#left,
#center,
#right {
  	height: 100%; 
	display: block;
	position: relative;
  	overflow-y: scroll;
}`;
//# sourceMappingURL=ApplicationView.styles.js.map