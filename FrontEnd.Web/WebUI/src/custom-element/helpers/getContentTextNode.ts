/**
     * Retrieves the child text content of a node as a string
     * @returns The text content as a string
     */
export default function getContentTextNode(element: HTMLElement): Text | null{

    const textNodes = Array.from(element.childNodes)
        .filter(n => n.nodeType == element.TEXT_NODE);
        
    if (!textNodes) {
        
        return null;
    }
    
    return textNodes[0] as Text;
}