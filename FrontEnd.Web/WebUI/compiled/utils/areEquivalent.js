import isUndefinedOrNull from "./isUndefinedOrNull";
export const typeComparers = [];
const arrayComparer = {
    test: (o) => Array.isArray(o),
    compare: (o1, o2) => {
        if (!Array.isArray(o2)) {
            return false;
        }
        if (o1.length !== o2.length) {
            return false;
        }
        else {
            const length = o1.length;
            for (let i = 0; i < length; ++i) {
                if (!areEquivalent(o1[i], o2[i])) {
                    return false;
                }
            }
            return true;
        }
    }
};
typeComparers.push(arrayComparer);
const dateComparer = {
    test: (o) => o instanceof Date,
    compare: (o1, o2) => {
        return o1.getTime() === o2.getTime();
    }
};
typeComparers.push(dateComparer);
const objectComparer = {
    test: (o) => typeof o === 'object',
    compare: (o1, o2) => {
        if (typeof o2 !== 'object') {
            return false;
        }
        if (Object.getOwnPropertyNames(o1).length !== Object.getOwnPropertyNames(o2).length) {
            return false;
        }
        for (const prop in o1) {
            if (o1.hasOwnProperty(prop)) {
                if (o2.hasOwnProperty(prop)) {
                    if (typeof o1[prop] === 'object') {
                        if (!areEquivalent(o1[prop], o2[prop])) {
                            return false;
                        }
                    }
                    else {
                        if (o1[prop] !== o2[prop]) {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }
};
typeComparers.push(objectComparer);
export default function areEquivalent(o1, o2) {
    if (o1 === o2) {
        return true;
    }
    if (isUndefinedOrNull(o1) && isUndefinedOrNull(o2)) {
        return true;
    }
    if (isUndefinedOrNull(o1) && !isUndefinedOrNull(o2)) {
        return false;
    }
    if (!isUndefinedOrNull(o1) && isUndefinedOrNull(o2)) {
        return false;
    }
    if (Object.getPrototypeOf(o1) !== Object.getPrototypeOf(o2)) {
        return false;
    }
    const length = typeComparers.length;
    for (let i = 0; i < length; ++i) {
        const { test, compare } = typeComparers[i];
        if (test(o1) === true) {
            return compare(o1, o2);
        }
    }
    return false;
}
//# sourceMappingURL=areEquivalent.js.map