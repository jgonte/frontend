import classMetadataRegistry from "./classMetadataRegistry";
import { DataTypes } from "../../../utils/data/DataTypes";
export default function MetadataInitializer(Base) {
    return class MetadataInitializerMixin extends Base {
        static get observedAttributes() {
            if (!classMetadataRegistry.has(this)) {
                classMetadataRegistry.set(this, {
                    properties: new Map(),
                    propertiesByAttribute: new Map(),
                    observedAttributes: [],
                    state: new Map(),
                    styles: undefined,
                    shadow: true
                });
            }
            const { metadata } = this;
            this.initializeComponent(metadata);
            this.initializeProperties(metadata);
            this.initializeState(metadata);
            this.initializeStyles(metadata);
            return metadata.observedAttributes;
        }
        static get metadata() {
            return classMetadataRegistry.get(this);
        }
        static initializeComponent(metadata) {
            const { component } = this;
            if (component === undefined) {
                metadata.shadow = true;
                return;
            }
            metadata.shadow = component.shadow;
        }
        static initializeProperties(metadata) {
            const properties = this.getAllProperties();
            Object.entries(properties).forEach(([key, value]) => this.initializeProperty(key, value, metadata));
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
        static getAllProperties() {
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
        static initializeProperty(name, propertyMetadata, metadata) {
            propertyMetadata.name = name;
            if (propertyMetadata.attribute === undefined) {
                propertyMetadata.attribute = name;
            }
            Object.defineProperty(this.prototype, name, {
                get() {
                    let { type } = propertyMetadata;
                    const { defer } = propertyMetadata;
                    const value = this._properties[name];
                    if (!Array.isArray(type)) {
                        type = [type];
                    }
                    if (type.includes(DataTypes.Function) &&
                        typeof value === 'function' &&
                        defer !== true) {
                        return value();
                    }
                    return value;
                },
                set(value) {
                    this.setProperty(name, value);
                },
                configurable: true,
                enumerable: true,
            });
            metadata.properties.set(name, propertyMetadata);
            const { attribute, type } = propertyMetadata;
            metadata.propertiesByAttribute.set(attribute, propertyMetadata);
            if (!type.includes(DataTypes.Object) &&
                !type.includes(DataTypes.Array) &&
                type !== DataTypes.Function) {
                metadata.observedAttributes.push(attribute.toLowerCase());
            }
        }
        static initializeState(metadata) {
            const state = this.getAllState();
            Object.entries(state).forEach(([name, stateMetadata]) => {
                stateMetadata.name = name;
                Object.defineProperty(this.prototype, name, {
                    get() {
                        return this._state[name];
                    },
                    set(value) {
                        this.setState(name, value);
                    },
                    configurable: true,
                    enumerable: true,
                });
                metadata.state.set(name, stateMetadata);
            });
            const baseClass = Object.getPrototypeOf(this.prototype).constructor;
            if (baseClass !== undefined) {
                const baseClassMetadata = baseClass.metadata;
                if (baseClassMetadata !== undefined) {
                    metadata.state = new Map([...metadata.state, ...baseClassMetadata.state]);
                }
            }
        }
        static getAllState() {
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
        static initializeStyles(metadata) {
            const { styles } = this;
            if (styles === undefined) {
                return;
            }
            metadata.styles = styles;
        }
    };
}
//# sourceMappingURL=MetadataInitializer.js.map