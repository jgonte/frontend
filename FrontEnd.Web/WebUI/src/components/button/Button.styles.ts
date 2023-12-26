import css from "../../custom-element/styles/css";

export const buttonStyles = css`
button {
    display: inline-flex;
    align-items: center;
    justify-content: start;
    user-select: none;
    cursor: pointer;
    font-size: inherit;
    border-width: var(--gcs-border-width);
    border-radius: var(--gcs-border-radius);
    margin: var(--gcs-margin);
    
    /* outline: 0;
      margin-right: 8px;
      margin-bottom: 12px;
      line-height: 1.5715;
      position: relative;
    
      font-weight: 400;
      white-space: nowrap;
      text-align: center;
      background-image: none;
      border: 1px solid transparent;
      -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, .015);
      box-shadow: 0 2px 0 rgba(0, 0, 0, .015);
      -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
       */
}

:host([variant='outlined']) button {
    border-style: solid;
}

:host([variant='text']) button {
    border-style: none;
}`;