import areEquivalent, { typeComparers } from "../../utils/areEquivalent";
import isNodePatchingData from "./isNodePatchingData";
let patcherComparerAdded = false;
const patcherComparer = {
    test: (o) => isNodePatchingData(o),
    compare: (o1, o2) => {
        const { patcher: patcher1, values: values1 } = o1;
        const { patcher: patcher2, values: values2 } = o2;
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
//# sourceMappingURL=addPatcherComparer.js.map