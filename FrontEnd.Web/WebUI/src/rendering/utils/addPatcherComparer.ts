import areEquivalent, { EquivalentTypeComparer, typeComparers } from "../../utils/areEquivalent";
import { NodePatchingData } from "../nodes/NodePatchingData";
import isNodePatchingData from "./isNodePatchingData";

let patcherComparerAdded = false;

const patcherComparer: EquivalentTypeComparer = {

    test: (o: unknown) => isNodePatchingData(o),

    compare: (o1: unknown, o2: unknown): boolean => {

        const {
            patcher: patcher1,
            values: values1
        } = o1 as NodePatchingData;

        const {
            patcher: patcher2,
            values: values2
        } = o2 as NodePatchingData;

        if (patcher2 === undefined) {

            return false;
        }

        if (patcher1 === patcher2) {

            return areEquivalent(values1, values2);
        }
        else {

            return false;
        }
    }
};

export default function addPatcherComparer() {

    if (patcherComparerAdded === false) {

        typeComparers.unshift(patcherComparer);

        patcherComparerAdded = true;
    }
}