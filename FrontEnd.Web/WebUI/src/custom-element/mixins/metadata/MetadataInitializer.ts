import CustomHTMLElementConstructor from "./types/CustomHTMLElementConstructor";
import classMetadataRegistry from "./classMetadataRegistry";
import CustomElementMetadata from "./types/CustomElementMetadata";
import CustomElementPropertyMetadata from "./types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./types/CustomElementStateMetadata";
import { DataTypes } from "../../../utils/data/DataTypes";
import CustomHTMLElement from "./types/CustomHTMLElement";

/**
 * Initializes a web component type (not an instance) from the metadata provided
 * @param Base The base class to extend
 * @returns The mixin class
 */
export default function MetadataInitializer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class MetadataInitializerMixin extends Base {

        static get observedAttributes(): string[] {

            // Initialize the metadata for this (derived) custom element
            if (!classMetadataRegistry.has(this)) {

                classMetadataRegistry.set(this, {
                    properties: new Map<string, CustomElementPropertyMetadata>(),
                    propertiesByAttribute: new Map<string, CustomElementPropertyMetadata>(),
                    observedAttributes: [],
                    state: new Map<string, CustomElementStateMetadata>(),
                    styles: undefined,
                    shadow: true
                });
            }

            const {
                metadata
            } = this;

            this.initializeComponent(metadata);

            this.initializeProperties(metadata);

            this.initializeState(metadata);

            this.initializeStyles(metadata);

            return metadata.observedAttributes;
        }

        /**
         * Retrieves the metadata for the given custom element
         * It returns undefined for the base CustomElement so we know when to stop merging the properties
         */
        static get metadata(): CustomElementMetadata | undefined {

            return classMetadataRegistry.get(this);
        }

        static initializeComponent(metadata: CustomElementMetadata): void {

            const {
                component
            } = this;
        
            if (component === undefined) {
        
                metadata.shadow = true; // It is true by default
        
                return;
            }
        
            metadata.shadow = component.shadow;
        }

        static initializeProperties(metadata: CustomElementMetadata): void {

            // console.log(`static initializeProperty type: '${this.name}'`);

            const properties = this.getAllProperties();

            // console.dir(properties);

            Object.entries(properties).forEach(([key, value]) => this.initializeProperty(key, value, metadata));

            // Merge the properties of the base class if any so we can validate and initialize
            // the values of the properties of the base class in the instance
            const baseClass = Object.getPrototypeOf(this.prototype)?.constructor;

            if (baseClass !== undefined) {

                const baseClassMetadata = baseClass.metadata;

                if (baseClassMetadata !== undefined) {

                    metadata.properties = new Map([...metadata.properties, ...baseClassMetadata.properties]);

                    metadata.propertiesByAttribute = new Map([...metadata.propertiesByAttribute, ...baseClassMetadata.propertiesByAttribute]);

                    metadata.observedAttributes = [...metadata.observedAttributes, ...baseClassMetadata.observedAttributes];
                }
            }
        }

        /**
         * Retrieve the state of this and the base mixins
         * @returns The merged state
         */
        static getAllProperties(): Record<string, CustomElementPropertyMetadata> {

            let properties = this.properties || {};

            let baseClass = Object.getPrototypeOf(this.prototype).constructor;

            while (baseClass.isCustomElement === true) {

                if (baseClass.properties !== undefined) {

                    properties = { ...properties, ...baseClass.properties };
                }

                baseClass = Object.getPrototypeOf(baseClass.prototype)?.constructor;
            }

            return properties;
        }

        static initializeProperty(name: string, propertyMetadata: CustomElementPropertyMetadata, metadata: CustomElementMetadata): void {

            propertyMetadata.name = name; // Set the name of the property

            // Set the name of the attribute as same as the name of the property if no attribute name was provided
            if (propertyMetadata.attribute === undefined) {

                propertyMetadata.attribute = name;
            }

            Object.defineProperty(
                this.prototype,
                name,
                {
                    get(): unknown {

                        let {
                            type
                        } = propertyMetadata;

                        const {
                            defer,
                            getValue,
                            beforeGet
                        } = propertyMetadata;

                        if (getValue !== undefined) {

                            return getValue.call(this);
                        }

                        const value = this._properties[name];

                        if (!Array.isArray(type)) {

                            type = [type];
                        }

                        if (type.includes(DataTypes.Function) &&
                            typeof value === 'function' &&
                            defer !== true) { // Only call the function if the type is a Function and it is not deferred

                            return value();
                        }

                        if (beforeGet) {

                            return beforeGet.call(this, value);
                        }

                        return value;
                    },
                    set(this: CustomHTMLElement, value: unknown) {

                        this.setProperty(name, value);
                    },
                    configurable: true,
                    enumerable: true,
                }
            );

            // Add it to the metadata properties so the properties of the instances can be validated and initialized
            metadata.properties.set(name, propertyMetadata);

            const {
                attribute,
                type
            } = propertyMetadata;

            // Index the property descriptor by the attribute name
            metadata.propertiesByAttribute.set(attribute, propertyMetadata); // Index by attribute name

            // Add the observed attribute if the type is not an object or an array
            if (!type.includes(DataTypes.Object) &&
                !type.includes(DataTypes.Array) &&
                type !== DataTypes.Function) { // Pure function type

                metadata.observedAttributes.push(attribute.toLowerCase());
            }

        }

        static initializeState(metadata: CustomElementMetadata): void {

            const state = this.getAllState();
        
            Object.entries(state).forEach(([name, stateMetadata]) => {
        
                (stateMetadata as CustomElementStateMetadata).name = name; // Set the name of the state property
        
                Object.defineProperty(
                    this.prototype,
                    name,
                    {
                        get(): unknown {
        
                            return this._state[name];
                        },
                        set(this: CustomHTMLElement, value: unknown) {
        
                            this.setState(name, value);
                        },
                        configurable: true,
                        enumerable: true,
                    }
                );
        
                // Add it to the metadata properties so the properties of the instances can be validated and initialized
                metadata.state.set(name, stateMetadata as CustomElementStateMetadata);
            });
        
            // Add the properties of the state base class if any so we can validate and initialize
            // the values of the properties of the state of the base class in the instance
            const baseClass = Object.getPrototypeOf(this.prototype).constructor;
        
            if (baseClass !== undefined) {
        
                const baseClassMetadata = baseClass.metadata;
        
                if (baseClassMetadata !== undefined) {
        
                    metadata.state = new Map([...metadata.state, ...baseClassMetadata.state]);
                }
            }
        }
        
        /**
         * Retrieve the state of this and the base mixins
         * @returns The merged state
         */
        static getAllState(): Record<string, CustomElementStateMetadata> {
        
            let state = this.state || {};
        
            let baseClass = Object.getPrototypeOf(this.prototype).constructor;
        
            while (baseClass.isCustomElement === true) {
        
                if (baseClass.state !== undefined) {
        
                    state = { ...state, ...baseClass.state };
                }
        
                baseClass = Object.getPrototypeOf(baseClass.prototype)?.constructor;
            }
        
            return state;
        }

        static initializeStyles(metadata: CustomElementMetadata): void {

            const {
                styles
            } = this;
        
            if (styles === undefined) {
        
                return;
            }
        
            // Do not inherit the styles of the base custom element by default
            // metadata.styles = Array.isArray(styles) ?
            //     [...metadata.styles, ...styles] :
            //     [...metadata.styles, styles];
        
            metadata.styles = styles;
        }
    }
}