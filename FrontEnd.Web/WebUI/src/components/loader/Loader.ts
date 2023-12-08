import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import Loadable from "../mixins/data/Loadable";
import Errorable from "../mixins/errorable/Errorable";
import LoaderData from "./LoaderData";

/**
 * Wrapper to allow loading data for a child component
 */
export default class Loader extends
	Loadable(
		Errorable(
			CustomElement as CustomHTMLElementConstructor
		)
	) {

	static get properties(): Record<string, CustomElementPropertyMetadata> {

		return {

			/**
			 * The data field to use to populate the data
			 * Defaults to "data"
			 */
			dataField: {
				attribute: 'data-field',
				type: DataTypes.String,
				value: 'data'
			}
		}
	}

	render(): NodePatchingData {

		return html`
<div style="position: relative;">
    ${this.renderLoading()}
    <slot id="data-holder"></slot>
</div>`;
	}

	didMountCallback() {

		// Bind to the data property of the child (assuming a single child)
		this.dataHolder = ((this.document as ShadowRoot).getElementById('data-holder') as HTMLSlotElement)
			.assignedElements({ flatten: false })[0]; // Only include elements

		this.dataHolder.loader = this; // Inject the loader

		super.didMountCallback?.();
	}

	handleLoadedData(data: LoaderData) {

		this.dataHolder[this.dataField] = data.payload || data;
	}
}

defineCustomElement('gcs-loader', Loader);