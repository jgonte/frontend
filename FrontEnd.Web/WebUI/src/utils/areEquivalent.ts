import isUndefinedOrNull from "./isUndefinedOrNull";
import { GenericRecord } from "./types";

export interface EquivalentTypeComparer {

    /**
     * Function to test whether to execute the comparison
     */
    test: (o: unknown) => boolean;

    /**
     * Function to do the actual comparison
     */
    compare: (o1: unknown, o2: unknown) => boolean;
}

/**
 * The array type comparer
 * The reason for this complexity is to allow the addition of extensible comparers
 */
 export const typeComparers: EquivalentTypeComparer[] = [];

 const arrayComparer = {
 
     test: (o: unknown) => Array.isArray(o),
 
     compare: (o1: unknown, o2: unknown): boolean => {
 
         if (!Array.isArray(o2)) {
 
             return false;
         }
     
         if ((o1 as Array<unknown>).length !== o2.length) {
     
             return false;
         }
         else {
     
             const length = (o1 as Array<unknown>).length;
 
             for (let i = 0; i < length; ++i) {
     
                 if (!areEquivalent((o1 as Array<unknown>)[i], o2[i])) {
     
                     return false;
                 }
             }
     
             return true;
         }
     }
 };
 
 typeComparers.push(arrayComparer);

/**
 * The date type comparer
 * The reason for this complexity is to allow the addition of extensible comparers
 */
const dateComparer = {

    test: (o: unknown) => o instanceof Date,

    compare: (o1: unknown, o2: unknown): boolean => {

        return (o1 as Date).getTime() === (o2 as Date).getTime()
    }
};

// Push it before the more general object comparer
typeComparers.push(dateComparer);

const objectComparer = {

    test: (o: unknown) => typeof o === 'object',

    compare: (o1: unknown, o2: unknown): boolean => {

        if (typeof o2 !== 'object') {

            return false;
        }

        if (Object.getOwnPropertyNames(o1).length !== Object.getOwnPropertyNames(o2).length) {

            return false;
        }
    
        for (const prop in o1 as object) {
    
            if ((o1 as object).hasOwnProperty(prop)) {
    
                if ((o2 as object).hasOwnProperty(prop)) {
    
                    if (typeof (o1 as GenericRecord)[prop] === 'object') {
    
                        if (!areEquivalent((o1 as GenericRecord)[prop], (o2 as GenericRecord)[prop])) {
    
                            return false;
                        }
                    }
                    else {
    
                        if ((o1 as GenericRecord)[prop] !== (o2 as GenericRecord)[prop]) {
    
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

export default function areEquivalent(o1: unknown, o2: unknown): boolean {

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

        return false; // Different classes
    }

    const length = typeComparers.length;

    for (let i = 0; i < length; ++i) {

        const {
            test,
            compare
        } = typeComparers[i];

        if (test(o1) === true) {

            return compare(o1, o2);
        } 
    }
    
    return false;
}