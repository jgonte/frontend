import CustomHTMLElementConstructor from "./mixins/metadata/types/CustomHTMLElementConstructor";
import ParentChild from "./mixins/ParentChild";
import ReactiveElement from "./mixins/ReactiveElement";
import StylesPatching from "./mixins/StylesPatching";
import NodePatching from "./mixins/NodePatching";
import ShadowRoot from "./mixins/ShadowRoot";
import MetadataInitializer from "./mixins/metadata/MetadataInitializer";
import { GenericRecord } from "../utils/types";
import html from "../rendering/html";
import { RenderReturnTypes } from "./mixins/metadata/types/IRenderable";
import componentsRegistry from "../services/componentsRegistry";

/**
 * The base class for all the custom elements
 */
export default class CustomElement extends
	ParentChild(
		ReactiveElement(
			StylesPatching(
				NodePatching(
					ShadowRoot(
						MetadataInitializer(HTMLElement as CustomHTMLElementConstructor)
					)
				)
			)
		)
	) {
	/**
	 * Flag to allow testing for derived classes of CustomElement
	 */
	static readonly isCustomElement: boolean = true;

	constructor() {

		super();

		this.initialized?.(this); // Call the initialized property if any

		this.isInitialized = true; // Flag the element as initialized
	}

	/**
	 * The render method that needs to be implemented by the derived elements
	 */
	render(): RenderReturnTypes {

		return html`<slot></slot>`;
	}

	connectedCallback() {

		super.connectedCallback?.();

		const id = this.getAttribute('id');

		if (id !== undefined) {

			componentsRegistry.set(id as string, this);
		}
	}

	disconnectedCallback() {

		super.disconnectedCallback?.();

		const id = this.getAttribute('id');

		if (id !== undefined) {

			componentsRegistry.delete(id as string);
		}
	}

	async dispatchCustomEvent(type: string, detail: GenericRecord): Promise<void> {

		await this.updateComplete;

		this.dispatchEvent(
			new CustomEvent(type, {
				detail: detail,
				bubbles: true,
				composed: true, // To bubble through the shadow DOM
			})
		);

		console.log(`Event of type: '${type}' was dispatched by:`);

		console.dir(this);

		console.log(`Event of type: '${type}' was dispatched with detail:`);

		console.dir(detail);
	}
}