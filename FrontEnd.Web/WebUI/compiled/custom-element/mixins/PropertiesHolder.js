import areEquivalent from "../../utils/areEquivalent";
import { DataTypes } from "../../utils/data/DataTypes";
import getGlobalFunction from "../../utils/getGlobalFunction";
import isClass from "../../utils/isClass";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import ensureValueIsInOptions from "./helpers/ensureValueIsInOptions";
import findSelfOrParent from "./helpers/findSelfOrParent";
import valueConverter from "./helpers/valueConverter";
const externalAttributes = [
    'id',
    'style',
    'slot'
];
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
export default function PropertiesHolder(Base) {
    return class PropertiesHolderMixin extends Base {
        _properties = {};
        _changedProperties = new Map();
        _explicitlyInitializedProperties = new Set();
        constructor(...args) {
            super(args);
            this._initializeIntrinsicProperties();
            const { properties } = this.constructor.metadata;
            if (this._$tempProperties !== undefined &&
                Object.entries(this._$tempProperties).length > 0) {
                const instrinsicProperties = instrinsicAttributes.map(a => a.property);
                instrinsicProperties.forEach(p => {
                    const value = this._$tempProperties?.[p];
                    if (value !== undefined) {
                        this[p] = value.bind(this);
                    }
                });
                for (const [name] of properties) {
                    const value = this._$tempProperties?.[name];
                    if (value !== undefined) {
                        this._setProperty(name, value);
                    }
                }
                delete this._$tempProperties;
            }
            this._initializeProperties(properties);
        }
        connectedCallback() {
            super.connectedCallback?.();
            const { properties } = this.constructor.metadata;
            this._validateRequiredProperties(properties);
        }
        _initializeIntrinsicProperties() {
            instrinsicAttributes.forEach(attr => {
                const { attribute, property } = attr;
                const val = this.getAttribute(attribute);
                if (val !== null) {
                    const fcn = typeof val === 'string' ?
                        getGlobalFunction(val) :
                        val;
                    this[property] = fcn.bind(this);
                }
            });
        }
        _initializeProperties(propertiesMetadata) {
            for (const [name, property] of propertiesMetadata) {
                const { attribute, value: defaultValue, type } = property;
                if (instrinsicAttributeNames.includes(attribute)) {
                    continue;
                }
                if (externalAttributes.includes(attribute)) {
                    continue;
                }
                const oldValue = this._properties[name];
                if (oldValue !== undefined) {
                    continue;
                }
                let newValue = this.getAttribute(attribute);
                if (newValue !== null) {
                    newValue = valueConverter.toProperty(newValue, type);
                    this._explicitlyInitializedProperties.add(name);
                    this._setProperty(name, newValue);
                }
                else if (defaultValue !== undefined) {
                    this._setProperty(name, defaultValue);
                }
            }
        }
        _validateRequiredProperties(propertiesMetadata) {
            const missingValueAttributes = [];
            propertiesMetadata.forEach(p => {
                const { required, attribute, name } = p;
                if (required === true &&
                    (this._properties[name] === undefined &&
                        this[name] === undefined)) {
                    missingValueAttributes.push(attribute);
                }
            });
            if (missingValueAttributes.length > 0) {
                throw new Error(`The attributes: [${missingValueAttributes.join(', ')}] must have a value`);
            }
        }
        didAdoptChildCallback(parent, child) {
            const { metadata } = child.constructor;
            if (metadata === undefined) {
                return;
            }
            const { properties } = metadata;
            child.setInheritedProperties(properties, parent);
        }
        setInheritedProperties(propertiesMetadata, parent) {
            for (const [name, property] of propertiesMetadata) {
                const { inherit } = property;
                if (inherit !== true) {
                    continue;
                }
                if (this._explicitlyInitializedProperties.has(name)) {
                    continue;
                }
                const selfOrParent = findSelfOrParent(parent, p => !isUndefinedOrNull(p[name]));
                if (selfOrParent !== null) {
                    this.setProperty(name, selfOrParent[name]);
                }
            }
            setTimeout(() => this.update(), 0);
        }
        attributeChangedCallback(attributeName, oldValue, newValue) {
            if (areEquivalent(oldValue, newValue)) {
                return;
            }
            console.log(`attributeChangedCallback -> attributeName: '${attributeName}', old value: [${oldValue}], new value: [${newValue}]`);
            super.attributeChangedCallback?.(attributeName, oldValue, newValue);
            this._setAttribute(attributeName, newValue);
        }
        _setAttribute(attribute, value) {
            const propertyMetadata = this.constructor.metadata.propertiesByAttribute.get(attribute);
            if (propertyMetadata === undefined) {
                throw new Error(`Attribute: '${attribute}' is not configured for custom element: '${this.constructor.name}'`);
            }
            const { name, type } = propertyMetadata;
            if (typeof value === 'string') {
                value = valueConverter.toProperty(value, type);
            }
            this.setProperty(name, value);
            return true;
        }
        _setProperty(name, value) {
            const propertyMetadata = this.constructor.metadata?.properties?.get(name);
            if (propertyMetadata === undefined) {
                throw new Error(`Property: '${name}' is not configured for custom element: '${this.constructor.name}'`);
            }
            const { attribute, type, reflect, options, beforeSet, canChange, afterChange, defer } = propertyMetadata;
            ensureValueIsInOptions(value, options);
            if (typeof value === 'function') {
                if (defer === true &&
                    !isClass(value)) {
                    value = value.bind(this);
                }
                else if (!isClass(value)) {
                    value = value();
                }
            }
            else if (!type.includes(DataTypes.Function) &&
                defer === true) {
                throw new Error('defer can only be used for function');
            }
            if (beforeSet !== undefined) {
                value = beforeSet.call(this, value);
            }
            const oldValue = this._properties[name];
            if (areEquivalent(oldValue, value)) {
                return false;
            }
            if (canChange?.call(this, value, oldValue) === false) {
                return false;
            }
            if (value === undefined ||
                value === false) {
                delete this._properties[name];
            }
            else {
                this._properties[name] = value;
            }
            afterChange?.call(this, value, oldValue);
            this.onPropertyChanged(name, value, oldValue);
            const reflectOnAttribute = reflect === true ? attribute : undefined;
            if (reflectOnAttribute !== undefined) {
                if (isUndefinedOrNull(value) ||
                    value === false) {
                    this.removeAttribute(reflectOnAttribute);
                }
                else {
                    value = valueConverter.toAttribute(value);
                    this.setAttribute(reflectOnAttribute, value);
                }
            }
            this._changedProperties.set(name, propertyMetadata);
            return true;
        }
        onPropertyChanged(name, value, oldValue) {
            this.propertyChanged?.(name, value, oldValue);
        }
        callAfterUpdate() {
            this._changedProperties.forEach(p => {
                if (p.afterUpdate !== undefined) {
                    p.afterUpdate.call(this);
                }
            });
        }
        clearChangedProperties() {
            this._changedProperties.clear();
        }
    };
}
//# sourceMappingURL=PropertiesHolder.js.map