import css from "../../../custom-element/styles/css";

export const sliderStyles = css`

gcs-slider {
    display: inline-block;
    position: relative;
    border-radius: 3px;
    height: 50px;
    width: 500px;
    background-image: linear-gradient(45deg, #ccc 25%,
        transparent 25%),linear-gradient(-45deg, #ccc 25%,
        transparent 25%),linear-gradient(45deg, transparent 75%,
        #ccc 75%),linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}

.bg-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 3px;
    background: linear-gradient(to right, #ff0000 0%, #ff000000 100%);
}

.thumb {
    margin-top: -1px;
    left: 5px;
    width: 5px;
    height: calc(100% - 5px);
    position: absolute;
    border-style: solid;
    border-width: 3px;
    border-color: white;
    border-radius: 3px;
    pointer-events: none;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                0 6px 20px 0 rgba(0, 0, 0, 0.19);

}`;
