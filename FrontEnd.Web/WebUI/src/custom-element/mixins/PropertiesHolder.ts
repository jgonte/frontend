import areEquivalent from "../../utils/areEquivalent";
import { DataTypes } from "../../utils/data/DataTypes";
import getGlobalFunction, { AnyFunction } from "../../utils/getGlobalFunction";
import isClass from "../../utils/isClass";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { GenericRecord } from "../../utils/types";
import ensureValueIsInOptions from "./helpers/ensureValueIsInOptions";
import findSelfOrParent from "./helpers/findSelfOrParent";
import valueConverter from "./helpers/valueConverter";
import CustomElementPropertyMetadata from "./metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElement from "./metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";

/**
 * The protected members
 */
interface InheritedPropertiesHandler extends CustomHTMLElement {

    setInheritedProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>, parent: CustomHTMLElement): void;
}

/**
 * Attributes that need to be part of the component to allow certain functionality but do not need to be stored as a property
 */
const externalAttributes = [
    'id',
    'style',
    'slot'
];

/**
 * Attributes that listen for property and state changes. They are basically properties that can be set as attributes
 * and need to be configured before the other properties so the can notify changes
 * The get configured during the constructor of the element
 */
const instrinsicAttributes = [
    {
        attribute: 'initialized',
        property: 'initialized'
    },
    {
        attribute: 'property-changed',
        property: 'propertyChanged'
    },
    {
        attribute: 'state-changed',
        property: 'stateChanged'
    }
];

const instrinsicAttributeNames = instrinsicAttributes.map(a => a.attribute);

/**
 * Sets up the properties of the custom element
 * @param Base 
 * @returns 
 */
export default function PropertiesHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class PropertiesHolderMixin extends Base {

        /**
        * The properties of the instance
        */
        private _properties: GenericRecord = {};

        /**
         * Map of the metadata of the changed properties so that the "afterUpdate" method can be called on the property after the update of the DOM
         */
        private _changedProperties: Map<string, CustomElementPropertyMetadata> = new Map<string, CustomElementPropertyMetadata>();

        /**
         * The properties that by the time the component gets connected, do not have any attribute explicitly set in the markup
         */
        private _explicitlyInitializedProperties: Set<string> = new Set<string>();

        /**
         * Initialize the intrinsic properties first so they can react to life cycle events
         */
        // The mixin constructor requires the parameters signature to be of type any
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {

            super(args);

            this._initializeIntrinsicProperties();

            const {
                properties
            } = (this.constructor as CustomHTMLElementConstructor).metadata;

            // If there are temporary properties
            if (this._$tempProperties !== undefined &&
                Object.entries(this._$tempProperties).length > 0) {

                // Set the intrinsic properties
                const instrinsicProperties = instrinsicAttributes.map(a => a.property);

                instrinsicProperties.forEach(p => {

                    const value = this._$tempProperties?.[p];

                    if (value !== undefined) {

                        this[p] = (value as AnyFunction).bind(this); // Intrinsic properties are functions only
                    }
                });

                // Set the configured properties from the temporary ones if any
                for (const [name] of properties) {

                    const value = this._$tempProperties?.[name];

                    if (value !== undefined) {

                        this._setProperty(name as string, value); // Set the temporary property
                    }
                }

                delete this._$tempProperties; // Not needed anymore
            }

            this._initializeProperties(properties);
        }

        connectedCallback() {

            super.connectedCallback?.();

            const {
                properties
            } = (this.constructor as CustomHTMLElementConstructor).metadata;

            // Validate here since the required properties can be set before the component gets connected
            this._validateRequiredProperties(properties);
        }

        /**
         * Initializes the intrinsic properties (listeners to property and state changes)
         */
        private _initializeIntrinsicProperties() {

            instrinsicAttributes.forEach(attr => {

                const {
                    attribute,
                    property
                } = attr;

                const val = this.getAttribute(attribute);

                if (val !== null) {

                    const fcn = typeof val === 'string' ?
                        getGlobalFunction(val) :
                        val;

                    this[property] = (fcn as AnyFunction).bind(this);
                }
            });
        }

        /**
         * Initializes the properties of the component
         * @param propertiesMetadata 
         */
        private _initializeProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            // console.log(`Instance _initializeProperties. type: '${this.constructor.name}'`);

            for (const [name, property] of propertiesMetadata) {

                const {
                    attribute,
                    value: defaultValue,
                    type
                } = property;

                if (instrinsicAttributeNames.includes(attribute as string)) {

                    continue; // Not a part of the properties
                }

                if (externalAttributes.includes(attribute as string)) {

                    continue; // Not a part of the properties
                }

                const oldValue = this._properties[name];

                if (oldValue !== undefined) {

                    continue; // Already initialized
                }

                let newValue = this.getAttribute(attribute as string);

                if (newValue !== null) {

                    newValue = valueConverter.toProperty(newValue, type)

                    this._explicitlyInitializedProperties.add(name);

                    this._setProperty(name as string, newValue); // Coming from an attribute anyway
                }
                else if (defaultValue !== undefined) { // Set a default value if any

                    this._setProperty(name as string, defaultValue);
                }
            }
        }

        /**
         * Validates that all the required properties have been set
         * @param propertiesMetadata 
         */
        private _validateRequiredProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            const missingValueAttributes: string[] = [];

            propertiesMetadata.forEach(p => {
                const {
                    required,
                    attribute,
                    name
                } = p;

                if (required === true &&
                    (this._properties[name as string] === undefined &&
                        this[name as string] === undefined)) { // The attribute for that property has not been set

                    missingValueAttributes.push(attribute as string);
                }
            });

            if (missingValueAttributes.length > 0) {

                throw new Error(`The attributes: [${missingValueAttributes.join(', ')}] must have a value`);
            }
        }

        /**
         * Called when the component added a child or it was added as a child
         * @param parent 
         * @param child 
         */
        didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement): void {

            const {
                metadata
            } = child.constructor as CustomHTMLElementConstructor;

            if (metadata === undefined) { // Probably not a custom component

                return;
            }

            const {
                properties
            } = metadata;

            (child as InheritedPropertiesHandler).setInheritedProperties(properties, parent);
        }

        /**
         * Sets the properties that can be inherited from the value of the parent if any
         * @param propertiesMetadata 
         */
        protected setInheritedProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>, parent: CustomHTMLElement) {

            for (const [name, property] of propertiesMetadata) {

                const {
                    inherit
                } = property;

                if (inherit !== true) {

                    continue; // Not inheritable
                }

                if (this._explicitlyInitializedProperties.has(name)) {

                    continue; // Its value was initially set in the attribute markup
                }

                const selfOrParent = findSelfOrParent(
                    parent,
                    p => !isUndefinedOrNull((p as CustomHTMLElement)[name])
                ) as CustomHTMLElement;

                if (selfOrParent !== null) {

                    //TODO: Subscribe this component to receive notifications when that property changes

                    this.setProperty(name, selfOrParent[name]);
                }
            }

            // The inherited properties are not updating right away
            setTimeout(() => this.update(), 0);
        }

        // Without defining this method, the observedAttributes getter will not be called
        // Also no need to check that the property was configured because if it is not configured, 
        // it will not generate the observedAttribute and therefore this method won't be called for that attribute
        /**
         * Called when there is a change in an attribute
         * @param attributeName
         * @param oldValue 
         * @param newValue 
         */
        attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void {

            if (areEquivalent(oldValue, newValue)) {

                return; // Nothing to change
            }

            console.log(`attributeChangedCallback -> attributeName: '${attributeName}', old value: [${oldValue}], new value: [${newValue}]`);

            super.attributeChangedCallback?.(attributeName, oldValue, newValue);

            this._setAttribute(attributeName, newValue);
        }

        // /**
        //  * Overrides the parent method to verify that it is accessing a configured property
        //  * @param attribute 
        //  * @param value 
        //  */
        // setAttribute(attribute: string, value: any) {

        //     // Verify that the property is one of the configured in the custom element
        //     if ((this.constructor as any)._propertiesByAttribute[attribute] === undefined &&
        //         !(this.constructor as any).metadata.htmlElementProperties.has(attribute)) {

        //         throw new Error(`There is no configured property for attribute: '${attribute}' in type: '${this.constructor.name}'`)
        //     }

        //     super.setAttribute(attribute, value);
        // }

        private _setAttribute(attribute: string, value: string | null): boolean {

            // Verify that the property is one of the configured in the custom element
            const propertyMetadata: CustomElementPropertyMetadata | undefined = (this.constructor as CustomHTMLElementConstructor).metadata.propertiesByAttribute.get(attribute);

            if (propertyMetadata === undefined) {

                throw new Error(`Attribute: '${attribute}' is not configured for custom element: '${this.constructor.name}'`);
            }

            const {
                name,
                type
            } = propertyMetadata;

            if (typeof value === 'string') { // Convert for strings only

                value = valueConverter.toProperty(value as string, type); // Convert from the value returned by the parameter
            }

            this.setProperty(name as string, value); // Call the setProperty of the Reactive mixin

            return true;
        }

        _setProperty(name: string, value: unknown): boolean {

            // Verify that the property is one of the configured in the custom element
            const propertyMetadata: CustomElementPropertyMetadata | undefined = (this.constructor as CustomHTMLElementConstructor).metadata?.properties?.get(name);

            if (propertyMetadata === undefined) {

                throw new Error(`Property: '${name}' is not configured for custom element: '${this.constructor.name}'`);
            }

            const {
                attribute,
                type,
                reflect,
                options,
                beforeSet,
                canChange,
                setValue,
                afterChange,
                defer
                //afterUpdate - We call afterUpdate after the element was updated in the DOM
            } = propertyMetadata;

            ensureValueIsInOptions(value, options);

            if (typeof value === 'function') {

                if (defer === true &&
                    !isClass(value)) { // Do not bind a class

                    value = (value as (...args: unknown[]) => unknown).bind(this); // Store the function as a property
                }
                else if (!isClass(value)) { // Not a class and not deferred

                    value = value(); // Call the function
                }
                // else it is a class - defer it (do nothing) 
            }
            else if (!type.includes(DataTypes.Function) &&
                defer === true) {

                throw new Error('defer can only be used for function');
            }

            if (beforeSet !== undefined) {

                value = beforeSet.call(this, value); // Transform the data if necessary
            }

            // Check if the property has not changed
            const oldValue = this._properties[name];

            if (areEquivalent(oldValue, value)) {

                return false; // Property has not changed
            }

            // Check if the value of the property is allowed to be changed
            if (canChange?.call(this, value, oldValue) === false) {

                return false; // Property is not allowed to change
            }

            if (value === undefined ||
                value === false) {

                delete this._properties[name];
            }
            else { // Set the property

                if (setValue !== undefined) {

                    setValue.call(this, value);
                }
                else {

                    this._properties[name] = value;
                }            
            }

            // Call any afterChange value on the property
            afterChange?.call(this, value, oldValue);

            this.onPropertyChanged(name, value, oldValue);

            const reflectOnAttribute = reflect === true ? attribute : undefined;

            if (reflectOnAttribute !== undefined) { // Synchronize with the attribute of the element

                if (isUndefinedOrNull(value) ||
                    value === false) {

                    this.removeAttribute(reflectOnAttribute);
                }
                else {

                    value = valueConverter.toAttribute(value);

                    this.setAttribute(reflectOnAttribute, value as string); // This will trigger the attributeChangedCallback
                }
            }

            this._changedProperties.set(name, propertyMetadata);

            return true;
        }

        onPropertyChanged(name: string, value: unknown, oldValue: unknown) {

            this.propertyChanged?.(name, value, oldValue); // Call the callback
        }

        /**
         * Calls the afterUpdate method of any changed property if defined
         */
        protected callAfterUpdate() {

            this._changedProperties.forEach(p => p.afterUpdate?.call(this));
        }

        /**
         * Removes the changed properties after the update
         */
        clearChangedProperties() {

            this._changedProperties.clear();
        }
    }
}