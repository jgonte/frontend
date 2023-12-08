import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import DisplayableField from "../DisplayableField";
import { sliderStyles } from "./Slider.styles"

export default class Slider extends DisplayableField {

    static get styles(): string {

        return sliderStyles;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The value of the slider
             */
            value: {
                type: DataTypes.Number,
                value: 0,
                reflect: true,
                afterUpdate: function () { // Do not use an arrow function so we can use Function.prototype.call()

                    (this as unknown as Slider).refreshSlider(this.value as number);
                }
            }
        }
    }

    render(): NodePatchingData {

        return html`
            <div class="bg-overlay"></div>
            <div class="thumb"></div>
        `;
    }

    refreshSlider(value: number): void {

        const thumb = this.querySelector('.thumb') as HTMLElement;

        if (thumb !== null) {

            thumb.style.left = (value / 100 * this.offsetWidth - thumb.offsetWidth / 2) + 'px';
        }
    }

    connectedCallback() {

        super.connectedCallback?.();

        document.addEventListener('mousemove', e => this.eventHandler(e));

        document.addEventListener('mouseup', e => this.eventHandler(e));

        this.addEventListener('mousedown', e => this.eventHandler(e));

        // this.refreshSlider(this.value); 
        //                                  
        // this.setColor(this.backgroundcolor);
    }

    updateX(x: number) {

        // Offset the horizontal position to use the center of the thumbnail
        let hPos = x - (this.querySelector('.thumb') as HTMLElement)?.offsetWidth / 2;

        // Restrict horizontal position to confines of component bounds
        if (hPos > this.offsetWidth) {

            hPos = this.offsetWidth;
        }

        if (hPos < 0) {

            hPos = 0;
        }

        // Calculate the percentage horizontal position and set the value attribute through the setter API
        this.value = (hPos / this.offsetWidth) * 100; 3
    }

    eventHandler(e: MouseEvent) {

        const bounds = this.getBoundingClientRect();

        // Calculates horizontal position relative to left edge of the component
        const x = e.clientX - bounds.left;

        switch (e.type) {

            // Set a boolean to indicate the user is dragging, update the "value" attribute, and update the slider position
            case 'mousedown':
                {
                    this.isDragging = true;

                    this.updateX(x);

                    this.refreshSlider(this.value);
                }
                break;

            //Set the boolean to false to indicate the user is no longer dragging
            case 'mouseup':
                {
                    this.isDragging = false;
                }
                break;

            // If the boolean indicates the user is dragging, updates the “value” attribute and updates the slider position
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