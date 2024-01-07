import { DataTypes } from "../../../../utils/data/DataTypes";
import { ParameterlessVoidFunction } from "../../../../utils/types";
import CustomElementStateMetadata from "./CustomElementStateMetadata";
export default interface CustomElementPropertyMetadata extends CustomElementStateMetadata {
    attribute?: string;
    type: DataTypes | DataTypes[];
    defer?: boolean;
    reflect?: boolean;
    inherit?: boolean;
    required?: boolean;
    beforeSet?: (value: unknown) => unknown;
    canChange?: (value: unknown, oldValue: unknown) => boolean;
    setValue?: (value: unknown) => void;
    beforeGet?: (value: unknown) => unknown;
    getValue?: () => unknown;
    afterChange?: (value: unknown, oldValue: unknown) => void;
    afterUpdate?: ParameterlessVoidFunction;
}
