import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import DisplayableField from "../DisplayableField";
import { sliderStyles } from "./Slider.styles";
export default class Slider extends DisplayableField {
    static get styles() {
        return sliderStyles;
    }
    static get properties() {
        return {
            value: {
                type: DataTypes.Number,
                value: 0,
                reflect: true,
                afterUpdate: function () {
                    this.refreshSlider(this.value);
                }
            }
        };
    }
    render() {
        return html `
            <div class="bg-overlay"></div>
            <div class="thumb"></div>
        `;
    }
    refreshSlider(value) {
        const thumb = this.querySelector('.thumb');
        if (thumb !== null) {
            thumb.style.left = (value / 100 * this.offsetWidth - thumb.offsetWidth / 2) + 'px';
        }
    }
    connectedCallback() {
        super.connectedCallback?.();
        document.addEventListener('mousemove', e => this.eventHandler(e));
        document.addEventListener('mouseup', e => this.eventHandler(e));
        this.addEventListener('mousedown', e => this.eventHandler(e));
    }
    updateX(x) {
        let hPos = x - this.querySelector('.thumb')?.offsetWidth / 2;
        if (hPos > this.offsetWidth) {
            hPos = this.offsetWidth;
        }
        if (hPos < 0) {
            hPos = 0;
        }
        this.value = (hPos / this.offsetWidth) * 100;
        3;
    }
    eventHandler(e) {
        const bounds = this.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        switch (e.type) {
            case 'mousedown':
                {
                    this.isDragging = true;
                    this.updateX(x);
                    this.refreshSlider(this.value);
                }
                break;
            case 'mouseup':
                {
                    this.isDragging = false;
                }
                break;
            case 'mousemove':
                {
                    if (this.isDragging) {
                        this.updateX(x);
                        this.refreshSlider(this.value);
                    }
                }
                break;
        }
    }
}
defineCustomElement('gcs-slider', Slider);
//# sourceMappingURL=Slider.js.map