import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { NodePatchingData } from "../nodes/NodePatchingData";

/**
 * Tests whether the object is a NodePatchingData object
 * @param o 
 * @returns 
 */
export default function isNodePatchingData(o: unknown) : boolean {

    if (isUndefinedOrNull(o)) {

        return false;
    }
    
    return (o as NodePatchingData).patcher !== undefined;
}