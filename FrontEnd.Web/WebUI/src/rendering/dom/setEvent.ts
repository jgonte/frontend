import getGlobalFunction, { AnyFunction } from "../../utils/getGlobalFunction";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { NodePatchingDataValue } from "../nodes/NodePatchingData";

export function setEvent(name: string,
    newValue: NodePatchingDataValue,
    oldValue: NodePatchingDataValue,
    node: Node) {

    const eventName: string = name.slice(2).toLowerCase();

    const nameParts = eventName.split('_'); // Just in case it has the capture parameter in the event

    const useCapture: boolean = nameParts[1]?.toLowerCase() === 'capture'; // The convention is: eventName_capture for capture. Example onClick_capture

    const fcn = typeof newValue === 'string' ?
        getGlobalFunction(newValue) :
        newValue;

    if (isUndefinedOrNull(oldValue) &&
        !isUndefinedOrNull(fcn)) {

        node.addEventListener(eventName, fcn as AnyFunction, useCapture);
    }

    if (!isUndefinedOrNull(oldValue) &&
        isUndefinedOrNull(fcn)) {

        const oldFcn = typeof oldValue === 'string' ?
            getGlobalFunction(oldValue) :
            oldValue;

        node.removeEventListener(eventName, oldFcn as EventListenerOrEventListenerObject, useCapture);
    }

    // Remove the attribute from the HTML
    (node as HTMLElement).removeAttribute(name);

    return newValue;
}