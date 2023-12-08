/**
 * Apply the classes to an HTML elements if the props keyed by the name of the class
 * has a value that evaluates to true
 * @param element 
 * @param props 
 */
export default function applyClasses(element: HTMLElement, props: Record<string, boolean>): void {
    
    for (const key in props) {

        if (props.hasOwnProperty(key)) {

            if (props[key] === true) {

                element.classList.add(key);
            }
            else {

                element.classList.remove(key);
            }
        }
    }
}