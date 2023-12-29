const _zIndexInitial = 1000;

const _zIndexIncrement = 10;

const _elements: HTMLElement[] = [];

const zIndexManager = {

    /**
     * Adds an element to the manager
     * @param element Element whose z-index is going to be managed by the manager
     */
    add(element: HTMLElement) {

        const el = _elements[_elements.length - 1];

        if (el) {

            const zIndex = parseInt(el.style.zIndex) + _zIndexIncrement;

            element.style.zIndex = zIndex.toString();
        }
        else {

            element.style.zIndex = _zIndexInitial.toString();
        }

        _elements.push(element);
    },

    /**
     * Removes an element from the manager
     * @param element Element to be removed from the manager
     */
    remove(element: HTMLElement) {

        const el = _elements.pop();

        if (el &&
            el !== element) {

            console.error('Removed element must be the last one');
        }
    }
}

export default zIndexManager;