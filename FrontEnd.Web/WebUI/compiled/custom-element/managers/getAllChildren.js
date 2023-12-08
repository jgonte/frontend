function getChildren(node) {
    const children = [];
    if (node instanceof HTMLSlotElement) {
        const childNodes = node.assignedNodes({ flatten: true });
        children.push(...childNodes);
    }
    else if (node instanceof HTMLElement) {
        const slots = node.querySelectorAll('slot');
        slots.forEach((slot) => {
            const childNodes = slot.assignedNodes({ flatten: true });
            children.push(...childNodes);
        });
        let childNodes = Array.from(node.childNodes);
        children.push(...childNodes);
        if (node.shadowRoot === null) {
            return children;
        }
        node = node.shadowRoot;
        childNodes = Array.from(node.childNodes);
        children.push(...childNodes);
    }
    return children;
}
export default function getAllChildren(node) {
    const children = [node];
    getChildren(node).forEach((child) => {
        children.push(...getAllChildren(child));
    });
    return children;
}
//# sourceMappingURL=getAllChildren.js.map