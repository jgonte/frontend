import DisplayableField from "../DisplayableField";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import SelectionContainer from "../../mixins/selection-container/SelectionContainer";
const getStarStyle = (selected) => selected == true ?
    'color: yellow;' :
    'color: lightgray;';
export default class StarRating extends SelectionContainer(DisplayableField) {
    static get properties() {
        return {
            max: {
                type: DataTypes.Number,
                value: 5,
                reflect: true
            }
        };
    }
    render() {
        const { max, value } = this;
        const stars = [];
        for (let i = 0; i < max; ++i) {
            const selected = i < value;
            stars.push(html `
<gcs-selector key=${i} select-value=${i + 1} selected=${selected}>
    <gcs-icon name="star-fill" style=${getStarStyle(selected)}></gcs-icon>
</gcs-selector>`);
        }
        return stars;
    }
    selectionChanged = (selection) => {
        this.value = selection[0];
    };
}
defineCustomElement('gcs-star-rating', StarRating);
//# sourceMappingURL=StarRating.js.map