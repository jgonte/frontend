import { IContentHidable } from "../../utils/types";
import CustomElement from "../CustomElement";

// The elements being shown
const _openPopups: HTMLElement[] = [];

/**
 * Closes a popup when the target is not a direct parent of the popup element
 * @param target 
 */
function closeOtherPopups(target: HTMLElement) {

    let count = _openPopups.length;

    while (count > 0) {

        const popup = _openPopups[count - 1]; // Peek the last element

        if (popup === target) {

            break;
        }

        const targetChildren = (target as CustomElement).adoptedChildren;

        const popupIsChildOfTarget = targetChildren &&
            Array.from(targetChildren)
                .includes(popup);

        if (popupIsChildOfTarget) {

            break;            
        }

        (popup as IContentHidable).hideContent?.(); 

        --count;
    }
}

/**
 * Tracks the popups currently showing on the page
 * Ensures there is only one showing
 */
const popupManager = {

    /**
     * Called when a popup source is going to show its content so other popups need to be hidden
     * @param element The popup source that is going to be shown
     */
    add(element: HTMLElement) {

        closeOtherPopups(element);

        _openPopups.push(element);
    },

    remove(element: HTMLElement) {

        const index = _openPopups.indexOf(element);

        if (index !== -1) {

            _openPopups.splice(index, 1);
        }
    }
};

/**
 * Global handle to close all open popups if user clicks outside the one being shown
 */
document.addEventListener('click',
    event => closeOtherPopups(event.target as HTMLElement)
);

export default popupManager;