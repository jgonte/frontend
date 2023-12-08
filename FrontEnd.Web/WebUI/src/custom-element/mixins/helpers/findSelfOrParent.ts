/**
 * Returns the first parent element whose satisfies the predicate (it returns true)
 * @param element 
 * @param predicate 
 * @returns The first parent element for which the predicate function returns true
 */
export default function findSelfOrParent(element: Node, predicate: (element: Element) => boolean) : Element | null {

    let parent = element;

    do {

        if (predicate(parent as Element) === true) {

            return parent as Element;
        }

        parent = parent.parentNode as Node;

        if (parent instanceof DocumentFragment) { // Possibly a shadow DOM

            parent = (parent as ShadowRoot).host; // Get its host
        }

    } while (parent !== null);

    return null;
}