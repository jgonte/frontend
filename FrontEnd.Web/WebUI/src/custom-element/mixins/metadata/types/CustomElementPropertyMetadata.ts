import { DataTypes } from "../../../../utils/data/DataTypes";
import { ParameterlessVoidFunction } from "../../../../utils/types";
import CustomElementStateMetadata from "./CustomElementStateMetadata";

/**
 * Describes the configurator of the properties
 */
export default interface CustomElementPropertyMetadata extends CustomElementStateMetadata {

    /**
     * The name of the HTML attribute mapped to the property
     */
    attribute?: string;

    /**
     * The type of the property. If not provided it defaults to a string
     */
    type: DataTypes | DataTypes[];

    /**
     * When the type of the property is a function and we don't want to evaluate the function when initializing it value
     * but we want to call that function at a later time
     */
    defer?: boolean;

    /**
     * Whether to reflect the change of the property in its mapped HTML attribute
     */
    reflect?: boolean;

    /**
     * Whether to request the value of the property in the parent if it is not set in the child. e.g., size, kind, etc.
     */
    inherit?: boolean;

    /**
     * Whether the property must have a value by the time the connectedCallback method is called
     */
    required?: boolean;

    /**
     * Hook to allow for extra manipulation of the property value before being set
     */
    beforeSet?: (value: unknown) => unknown;

    /**
     * Function to execute to determine whether the property can be changed.
     * If the return is false then the process of changing the property will be cancelled
     */
    canChange?: (value: unknown, oldValue: unknown) => boolean;

    /**
     * Function to execute when the value of the property has changed
     */
    afterChange?: (value: unknown, oldValue: unknown) => void;

    /**
     * Called when the property has changed but after the DOM has been updated
     * Used to perform modifications to the DOM after updating it
     */
    afterUpdate?: ParameterlessVoidFunction;
}