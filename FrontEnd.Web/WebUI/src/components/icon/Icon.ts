import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import appCtrl from "../../services/appCtrl";
import { DataTypes } from "../../utils/data/DataTypes";
import Sizable from "../mixins/sizable/Sizable";
import { iconStyles } from "./Icon.styles";

const iconsCache = new Map<string, string>();

export default class Icon extends Sizable(
    CustomElement as CustomHTMLElementConstructor
) {

    static get styles(): string {

        return mergeStyles(super.styles, iconStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the icon
             */
            name: {
                type: DataTypes.String,
                required: true
            }
        };
    }

    async render(): Promise<NodePatchingData | null> {

        const {
            name
        } = this;

        if (name === undefined) {

            return null;
        }

        const {
            iconsPath
        } = appCtrl;

        if (iconsPath === undefined) {

            throw new Error('Path to the icons has not been configured');
        }

        const iconPath = `${iconsPath}${typeof name === 'function' ? name() : name}.svg`;

        let svg: string | undefined = undefined;

        if (iconsCache.has(iconPath)) {

            svg = iconsCache.get(iconPath);
        }
        else {

            const response = await fetch(iconPath);

            svg = await response.text();

            if (svg.match(/script/i) ||
                svg.match(/onerror/i)) {

                throw new Error(`Potencial XSS threat in file: ${iconPath}`);
            }

            iconsCache.set(iconPath, svg);
        }

        return html([svg] as unknown as TemplateStringsArray);
    }
}

defineCustomElement('gcs-icon', Icon);