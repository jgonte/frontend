export interface EquivalentTypeComparer {
    test: (o: unknown) => boolean;
    compare: (o1: unknown, o2: unknown) => boolean;
}
export declare const typeComparers: EquivalentTypeComparer[];
export default function areEquivalent(o1: unknown, o2: unknown): boolean;
