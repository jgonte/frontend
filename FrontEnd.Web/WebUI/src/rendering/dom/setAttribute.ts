import isCustomElement from "../../custom-element/isCustomElement";
import valueConverter from "../../custom-element/mixins/helpers/valueConverter";
import CustomHTMLElement from "../../custom-element/mixins/metadata/types/CustomHTMLElement";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { GenericRecord } from "../../utils/types";
import { ExtensibleHTMLElement } from "../nodes/NodePatchingData";

export default function setAttribute(
	node: ExtensibleHTMLElement,
	attributeName: string,
	propertyName: string,
	value: unknown
): void {

	// console.warn(`Setting attribute name: '${attributeName}', node type: '${node.localName}', is initialized: '${node.isInitialized === true}'  ${(() => {
	// 	console.dir(value);
	// 	return '';
	// })()}`);

	const type = typeof value;

	const isComplexType = (type === "function" || type === "object"); // This includes arrays too

	// If the node is a custom element but not initialized yet, then set the temporary properties to call them in the constructor to initialize the final properties
	if (isCustomElement(node) &&
		node.isInitialized !== true) {

		if (isComplexType) {

			node._$tempProperties ??= {};

			((node as CustomHTMLElement)._$tempProperties as GenericRecord)[propertyName] = value;

			// Remove the attribute if any, most likely will have a placeholder
			node.removeAttribute(attributeName);
		}
		else { // Simple type, set its attribute

			setPrimitiveAttribute(node, attributeName, value);
		}

		return;
	}

	// Here the custom element is initialized, set the attribute/property according to the type of the value and configuration
	if (isUndefinedOrNull(value) ||
		value === false) {

		node.removeAttribute(attributeName);

		if (attributeName === "value") {

			node.value = "";
		}
		else {

			node[propertyName] = value;
		}
	}
	else {

		// If we are here that means that the node has been already initialized or it is not a custom element
		if (isComplexType) {

			node[propertyName] = value; // Bypass the stringification of the attribute

			node.removeAttribute(attributeName); // It is similar to an event. Do not show as attribute
		}
		else { // Any other type

			setPrimitiveAttribute(node, attributeName, value);
		}
	}
}

function setPrimitiveAttribute(node: ExtensibleHTMLElement, attributeName: string, value: unknown) {

	if (isUndefinedOrNull(value) ||
		value === false) { // false means the abscense of the attribute

		node.removeAttribute(attributeName);

		return;
	}

	if (attributeName === "value") { // Set the value besides setting the attribute

		(node as unknown as HTMLInputElement).value = value as string;
	}

	const v = valueConverter.toAttribute(value);

	node.setAttribute(attributeName, v);
}