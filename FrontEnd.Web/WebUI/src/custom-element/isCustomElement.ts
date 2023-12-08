/**
 * Hack to determine whether the node is one of our custom elements
 * @param element The node to test
 */
export default function isCustomElement(element: HTMLElement) : boolean {

    return element.tagName.toLowerCase().startsWith('gcs-');
}