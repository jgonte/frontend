function isUndefinedOrNull(o) {
    return o === undefined ||
        o === null;
}

function isCustomElement(element) {
    return element.tagName.toLowerCase().startsWith('gcs-');
}

function ParentChild(Base) {
    return class ParentChildMixin extends Base {
        adoptingParent = undefined;
        adoptedChildren = new Set();
        async connectedCallback() {
            super.connectedCallback?.();
            this.adoptingParent = await this.findAdoptingParent();
            const { adoptingParent } = this;
            if (isUndefinedOrNull(adoptingParent)) {
                return;
            }
            adoptingParent.adoptedChildren.add(this);
            this.didAdoptChildCallback?.(adoptingParent, this);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            const { adoptingParent } = this;
            if (isUndefinedOrNull(adoptingParent)) {
                return;
            }
            this.willAbandonChildCallback?.(adoptingParent, this);
            adoptingParent.adoptedChildren.delete(this);
        }
        async didMountCallback() {
            await super.didMountCallback?.();
            const slot = this.document.querySelector('slot');
            if (slot === null) {
                const { adoptingParent } = this;
                if (!isUndefinedOrNull(adoptingParent)) {
                    adoptingParent.adoptedChildren.add(this);
                    this.didAdoptChildCallback?.(adoptingParent, this);
                }
                return;
            }
            const children = slot.assignedNodes();
            if (children.length > 0) {
                children.forEach((child) => {
                    this.adoptedChildren.add(child);
                    this.didAdoptChildCallback?.(this, child);
                });
            }
            else {
                slot.addEventListener('slotchange', this.handleSlotChange);
            }
            const { adoptedChildren } = this;
            if (adoptedChildren.size > 0) {
                this.didAdoptChildrenCallback?.(this, adoptedChildren);
            }
        }
        async findAdoptingParent() {
            let parent = this.parentNode;
            while (parent !== null) {
                if (parent instanceof DocumentFragment) {
                    parent = parent.host;
                }
                const tagName = parent.tagName?.toLowerCase();
                if (tagName === 'body') {
                    return null;
                }
                if (isCustomElement(parent)) {
                    await window.customElements.whenDefined(tagName);
                }
                if (parent.constructor.isCustomElement === true) {
                    return parent;
                }
                parent = parent.parentNode;
            }
            return null;
        }
        handleSlotchange(e) {
            console.dir(e);
            alert('kuku');
        }
    };
}

function ensureValueIsInOptions(value, options) {
    if (options !== undefined &&
        !options.includes(value)) {
        throw new Error(`Value: '${value}' is not part of the options: [${options.join(', ')}]`);
    }
}

function StateHolder(Base) {
    return class StateHolderMixin extends Base {
        _state = {};
        connectedCallback() {
            super.connectedCallback?.();
            this._initializeStateWithDefaultValues(this.constructor.metadata.state);
        }
        _initializeStateWithDefaultValues(stateMetadata) {
            for (const [name, state] of stateMetadata) {
                const { value, options } = state;
                ensureValueIsInOptions(value, options);
                if (this._state[name] === undefined &&
                    value !== undefined) {
                    this.setState(name, value);
                }
            }
        }
        _setState(key, value) {
            const stateMetadata = this.constructor.metadata.state.get(key);
            if (stateMetadata === undefined) {
                throw new Error(`There is no configured property for state: '${key}' in type: '${this.constructor.name}'`);
            }
            const { options } = stateMetadata;
            ensureValueIsInOptions(value, options);
            const oldValue = this._state[key];
            if (oldValue === value) {
                return false;
            }
            this._state[key] = value;
            return true;
        }
    };
}

const typeComparers = [];
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
function areEquivalent(o1, o2) {
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

var DataTypes;
(function (DataTypes) {
    DataTypes["Boolean"] = "boolean";
    DataTypes["Number"] = "number";
    DataTypes["BigInt"] = "bigint";
    DataTypes["String"] = "string";
    DataTypes["Date"] = "date";
    DataTypes["Object"] = "object";
    DataTypes["Array"] = "array";
    DataTypes["Function"] = "function";
})(DataTypes || (DataTypes = {}));

function getGlobalFunction(value) {
    const functionName = value.replace('()', '').trim();
    return window[functionName];
}

function isClass(value) {
    return typeof value === 'function' &&
        value.toString().substring(0, 5) == 'class';
}

function findSelfOrParent(element, predicate) {
    let parent = element;
    do {
        if (predicate(parent) === true) {
            return parent;
        }
        parent = parent.parentNode;
        if (parent instanceof DocumentFragment) {
            parent = parent.host;
        }
    } while (parent !== null);
    return null;
}

const valueConverter = {
    toProperty: (value, type) => {
        if (value === null) {
            return null;
        }
        if (!Array.isArray(type)) {
            type = [type];
        }
        if (value[value.length - 2] === '(' && value[value.length - 1] === ')'
            && type.includes(DataTypes.Function)) {
            const fcn = getGlobalFunction(value);
            if (fcn !== undefined) {
                return fcn;
            }
        }
        if (type.includes(DataTypes.Object) ||
            type.includes(DataTypes.Array)) {
            let o;
            try {
                o = JSON.parse(value);
            }
            catch (error) {
                if (!type.includes(DataTypes.String)) {
                    throw error;
                }
            }
            if (o !== undefined) {
                if (!Array.isArray(o) &&
                    !type.includes(DataTypes.Object)) {
                    throw new Error(`value: ${value} is not an array but there is no object type expected`);
                }
                if (Array.isArray(o) &&
                    !type.includes(DataTypes.Array)) {
                    throw new Error(`value: ${value} is an array but there is no array type expected`);
                }
                return o;
            }
        }
        if (type.includes(DataTypes.Boolean)) {
            return true;
        }
        if (type.includes(DataTypes.Number)) {
            return Number(value);
        }
        return value;
    },
    toAttribute: (value) => {
        const type = typeof value;
        if (type === 'boolean') {
            return '';
        }
        if (type === 'object' || Array.isArray(value)) {
            return JSON.stringify(value);
        }
        return value.toString();
    }
};

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
function PropertiesHolder(Base) {
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

function ReactiveElement(Base) {
    return class ReactiveElementMixin extends StateHolder(PropertiesHolder(Base)) {
        _hasPendingUpdate = false;
        _updatePromise = new Promise((resolve, reject) => {
            try {
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
        setProperty(name, value) {
            if (this._setProperty(name, value) === true) {
                this.update();
            }
        }
        setState(key, value) {
            if (this._setState(key, value) === true) {
                this.update();
            }
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.update();
        }
        update() {
            if (this._hasPendingUpdate) {
                return;
            }
            this._updatePromise = this._enqueueUpdate();
        }
        async _enqueueUpdate() {
            this._hasPendingUpdate = true;
            await this._updatePromise;
            return new Promise(async (resolve, reject) => {
                try {
                    await this.updateDom();
                    resolve();
                }
                catch (error) {
                    console.error(error);
                    reject(error);
                }
                finally {
                    this._markUpdated();
                }
            });
        }
        _markUpdated() {
            this._hasPendingUpdate = false;
            this.clearChangedProperties();
        }
        get updateComplete() {
            return this._updatePromise;
        }
    };
}

function StylesPatching(Base) {
    return class StylesPatchingMixin extends Base {
        beforeRender(patchingData) {
            const { constructor, stylesAdded = false } = this;
            const styles = constructor.metadata.styles;
            if (styles !== undefined &&
                stylesAdded === false) {
                patchingData = this.addStyles(patchingData, styles);
                this.stylesAdded = true;
            }
            return patchingData;
        }
        addStyles(node, styles) {
            const { shadowRoot } = this;
            if (shadowRoot !== null) {
                const styleNode = document.createElement('style');
                const styleContent = document.createTextNode(styles);
                styleNode.appendChild(styleContent);
                shadowRoot.appendChild(styleNode);
            }
            else {
                throw new Error('Not implemented');
            }
            return node;
        }
    };
}

function isPrimitive(o) {
    const type = typeof o;
    return type !== 'undefined' &&
        type !== 'object' &&
        type !== 'function';
}

function createNodes(patchingData) {
    if (isPrimitive(patchingData)) {
        return document.createTextNode(patchingData.toString());
    }
    const { patcher, values } = patchingData;
    const doc = patcher.template.content.cloneNode(true);
    const rules = compileRules(doc, patcher.rules);
    const { childNodes } = doc;
    const node = childNodes[0];
    patchingData.node = node;
    node._$patchingData = patchingData;
    patchingData.rules = rules;
    patcher.firstPatch(rules, values);
    return doc;
}
function compileRules(node, rules) {
    return rules.map(r => r.compile(findNode(node, r.path)));
}
function findNode(node, path) {
    for (let i = 0; i < path.length; ++i) {
        node = node.childNodes[path[i]];
    }
    return node;
}

function mountNodes(container, patchingData) {
    if (Array.isArray(patchingData)) {
        patchingData.forEach(pd => {
            container.appendChild(createNodes(pd));
        });
    }
    else {
        container.appendChild(createNodes(patchingData));
    }
}

const beginMarker = "_$bm_";
const endMarker = "_$em_";
const attributeMarkerPrefix = "_$attr:";
const eventMarkerPrefix = "_$evt:";

function isNodePatchingData(o) {
    if (isUndefinedOrNull(o)) {
        return false;
    }
    return o.patcher !== undefined;
}

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
function addPatcherComparer() {
    if (patcherComparerAdded === false) {
        typeComparers.unshift(patcherComparer);
        patcherComparerAdded = true;
    }
}

function transferPatchingData(oldPatchingData, newPatchingData) {
    if (Array.isArray(newPatchingData)) {
        for (let i = 0; i < newPatchingData.length; ++i) {
            transferData(oldPatchingData[i], newPatchingData[i]);
        }
    }
    else if (isNodePatchingData(newPatchingData)) {
        transferData(oldPatchingData, newPatchingData);
    }
    function transferData(oldPatchingData, newPatchingData) {
        if (!isNodePatchingData(oldPatchingData)) {
            return;
        }
        const { node, rules, values } = oldPatchingData;
        if (node === undefined) {
            throw new Error(`Node is required in node patching data: ${oldPatchingData.patcher.templateString}`);
        }
        newPatchingData.node = node;
        newPatchingData.rules = rules;
        newPatchingData.values = values;
    }
}

addPatcherComparer();
function updateNodes(container, oldPatchingData, newPatchingData) {
    if (areEquivalent(oldPatchingData, newPatchingData)) {
        transferPatchingData(oldPatchingData, newPatchingData);
        return;
    }
    if (Array.isArray(newPatchingData)) {
        updateArrayNodes(container, oldPatchingData, newPatchingData);
    }
    else if (isPrimitive(newPatchingData)) {
        container.childNodes[container.childNodes.length - 1].textContent = newPatchingData.toString();
    }
    else {
        const { node } = oldPatchingData;
        if (node === undefined) {
            throw new Error('There must be an existing node');
        }
        const { patcher: oldPatcher, values: oldValues, rules } = oldPatchingData;
        const { patcher, values } = newPatchingData;
        if (oldPatcher === patcher) {
            newPatchingData.rules = rules;
            newPatchingData.node = node;
            if (areEquivalent(oldPatchingData.values, newPatchingData.values)) {
                transferPatchingData(oldPatchingData.values, newPatchingData.values);
                return;
            }
            oldPatcher.patchNode(rules || [], oldValues, values);
            node._$patchingData = newPatchingData;
        }
        else {
            const newNode = createNodes(newPatchingData);
            if (node.data === beginMarker) {
                node.nextSibling.remove();
            }
            container.replaceChild(newNode, node);
        }
    }
}
function updateArrayNodes(container, oldPatchingData, newPatchingData) {
    let { length: oldCount } = oldPatchingData;
    const keyedNodes = new Map();
    for (let i = 0; i < oldCount; ++i) {
        const { node: oldChild } = oldPatchingData[i];
        const key = oldChild.getAttribute?.('key') || null;
        if (key !== null) {
            keyedNodes.set(key, oldChild);
        }
    }
    const { length: newCount } = newPatchingData;
    for (let i = 0; i < newCount; ++i) {
        const oldChild = i < oldPatchingData.length ?
            oldPatchingData[i].node :
            undefined;
        if (oldChild === undefined) {
            mountNodes(container, newPatchingData[i]);
        }
        else {
            const newChildPatchingData = newPatchingData[i];
            const { patcher, values } = newChildPatchingData;
            const { keyIndex } = patcher;
            const valueKey = keyIndex !== undefined ?
                values[keyIndex]?.toString() :
                null;
            const oldChildKey = oldChild.getAttribute?.('key') || null;
            if (oldChildKey === valueKey) {
                updateNodes(oldChild, oldPatchingData[i], newChildPatchingData);
                if (i >= container.childNodes.length) {
                    container.appendChild(oldChild);
                }
            }
            else {
                if (keyedNodes.has(valueKey)) {
                    const keyedNode = keyedNodes.get(valueKey);
                    if (areEquivalent(newChildPatchingData.values, keyedNode._$patchingData.values)) {
                        if (i >= container.childNodes.length) {
                            container.appendChild(keyedNode);
                        }
                        else {
                            container.childNodes[i].replaceWith(keyedNode);
                            --oldCount;
                        }
                        newChildPatchingData.node = keyedNode;
                        const { rules, values } = keyedNode._$patchingData;
                        newChildPatchingData.rules = rules;
                        newChildPatchingData.values = values;
                    }
                }
                else {
                    updateNodes(oldChild, oldPatchingData[i], newChildPatchingData);
                }
            }
        }
    }
    for (let i = oldCount - 1; i >= newCount; --i) {
        oldPatchingData[i].node.remove();
    }
}

function NodePatching(Base) {
    return class NodePatchingMixin extends Base {
        _oldPatchingData = null;
        static get properties() {
            return {
                key: {
                    type: DataTypes.String
                }
            };
        }
        async updateDom() {
            try {
                let newPatchingData = await this.render();
                if (newPatchingData !== null) {
                    newPatchingData = this.beforeRender(newPatchingData);
                }
                const { document, _oldPatchingData } = this;
                if (_oldPatchingData === null) {
                    if (newPatchingData !== null) {
                        await this.mountDom(document, newPatchingData);
                    }
                }
                else {
                    if (newPatchingData !== null) {
                        this.willUpdateCallback?.();
                        updateNodes(document, _oldPatchingData, newPatchingData);
                        await this._waitForChildrenToUpdate();
                        this.callAfterUpdate();
                    }
                    else {
                        this.willUnmountCallback?.();
                        this.document.replaceChildren();
                        this.stylesAdded = false;
                    }
                }
                this._oldPatchingData = newPatchingData;
            }
            catch (error) {
                console.error(error);
            }
        }
        async mountDom(document, newPatchingData) {
            mountNodes(document, newPatchingData);
            await this._waitForChildrenToMount();
            this.callAfterUpdate();
        }
        async _waitForChildrenToMount() {
            await this._waitForChildren();
            this.didMountCallback?.();
        }
        async _waitForChildrenToUpdate() {
            await this._waitForChildren();
            this.didUpdateCallback?.();
        }
        async _waitForChildren() {
            const updatePromises = [...this.adoptedChildren]
                .map(child => child.updateComplete);
            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
            }
        }
    };
}

function ShadowRoot(Base) {
    return class ShadowRootMixin extends Base {
        constructor(...args) {
            super(...args);
            if (this.constructor.metadata.shadow === true) {
                this.attachShadow({ mode: 'open' });
            }
        }
        get document() {
            return this.shadowRoot !== null ?
                this.shadowRoot :
                this;
        }
    };
}

const classMetadataRegistry = new Map();

function MetadataInitializer(Base) {
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

function toCamelCase(str) {
    return (str.slice(0, 1).toLowerCase() + str.slice(1))
        .replace(/([-_ ]){1,}/g, ' ')
        .split(/[-_ ]/)
        .reduce((cur, acc) => {
        return cur + acc[0].toUpperCase() + acc.substring(1);
    });
}

var NodePatcherRuleTypes;
(function (NodePatcherRuleTypes) {
    NodePatcherRuleTypes["PATCH_CHILDREN"] = "patch-children";
    NodePatcherRuleTypes["PATCH_ATTRIBUTE"] = "patch-attribute";
    NodePatcherRuleTypes["PATCH_EVENT"] = "patch-event";
})(NodePatcherRuleTypes || (NodePatcherRuleTypes = {}));

class NodePatcherAttributeRule {
    path;
    name;
    type = NodePatcherRuleTypes.PATCH_ATTRIBUTE;
    property;
    constructor(path, name) {
        this.path = path;
        this.name = name;
        this.property = toCamelCase(this.name);
    }
    compile(node) {
        return {
            type: this.type,
            path: this.path,
            name: this.name,
            property: this.property,
            node
        };
    }
}

class NodePatcherChildrenRule {
    path;
    type = NodePatcherRuleTypes.PATCH_CHILDREN;
    constructor(path) {
        this.path = path;
    }
    compile(node) {
        return {
            type: this.type,
            path: this.path,
            node
        };
    }
}

class NodePatcherEventRule {
    path;
    name;
    type = NodePatcherRuleTypes.PATCH_EVENT;
    constructor(path, name) {
        this.path = path;
        this.name = name;
    }
    compile(node) {
        return {
            type: this.type,
            path: this.path,
            name: this.name,
            node
        };
    }
}

function createNodePatcherRules(node, path = [], rules = []) {
    const { childNodes } = node;
    const { length } = childNodes;
    if (node.data === endMarker) {
        rules.push(new NodePatcherChildrenRule([...path]));
        return rules;
    }
    else if (node.nodeType === Node.TEXT_NODE) {
        return rules;
    }
    else {
        const attributes = node.attributes;
        if (attributes !== undefined) {
            rules = createAttributePatcherRules(attributes, path, rules);
        }
    }
    for (let i = 0; i < length; ++i) {
        rules = createNodePatcherRules(childNodes[i], [...path, i], rules);
    }
    return rules;
}
function createAttributePatcherRules(attributes, path, rules) {
    const { length } = attributes;
    for (let i = 0; i < length; ++i) {
        const value = attributes[i].value;
        if (value.startsWith(attributeMarkerPrefix)) {
            const name = value.split(':')[1];
            rules.push(new NodePatcherAttributeRule(path, name));
        }
        else if (value.startsWith(eventMarkerPrefix)) {
            const name = value.split(':')[1];
            rules.push(new NodePatcherEventRule(path, name));
        }
    }
    return rules;
}

function createTemplateString(strings) {
    let keyIndex = undefined;
    const parts = [];
    if (strings.length === 1) {
        return {
            templateString: trimNode(strings[0]),
            keyIndex
        };
    }
    const length = strings.length - 1;
    let s;
    let beginAttributeOrEvent = false;
    let beginMarkerSet = false;
    for (let i = 0; i < length; ++i) {
        s = strings[i];
        s = trimNode(s);
        if (s.lastIndexOf('>') < s.lastIndexOf('<') &&
            !s.endsWith('=')) {
            throw new Error("Do not surround the placeholder for an attribute with single or double quotes or template a partial attribute");
        }
        if (s.endsWith('=')) {
            if (beginMarkerSet === true) {
                parts.push(`<!--${endMarker}-->`);
                beginMarkerSet = false;
            }
            const name = getAttributeName(s);
            beginAttributeOrEvent = true;
            if (name[0] === 'o' && name[1] === 'n') {
                parts.push(`${s}"${eventMarkerPrefix}${name}"`);
            }
            else {
                if (name === 'key') {
                    keyIndex = i;
                }
                parts.push(`${s}"${attributeMarkerPrefix}${name}"`);
            }
        }
        else {
            if (beginAttributeOrEvent === true) {
                beginAttributeOrEvent = false;
            }
            else if (i > 0) {
                parts.push(`<!--${endMarker}-->`);
            }
            parts.push(`${s}<!--${beginMarker}-->`);
            beginMarkerSet = true;
        }
    }
    if (beginAttributeOrEvent === false) {
        parts.push(`<!--${endMarker}-->`);
    }
    s = strings[length];
    s = trimNode(s);
    parts.push(s);
    return {
        templateString: parts.join(''),
        keyIndex
    };
}
function trimNode(s) {
    const trimmedStart = s.trimStart();
    if (trimmedStart.startsWith('<') ||
        trimmedStart === '') {
        s = trimmedStart;
    }
    const trimmedEnd = s.trimEnd();
    if (trimmedEnd.endsWith('>')) {
        s = trimmedEnd;
    }
    return s;
}
function getAttributeName(s) {
    let b = [];
    for (let i = s.lastIndexOf('=') - 1; i >= 0; --i) {
        if (s[i] === ' ') {
            break;
        }
        b = [s[i], ...b];
    }
    return b.join('');
}

function createTemplate(strings) {
    const { templateString, keyIndex } = createTemplateString(strings);
    const template = document.createElement('template');
    template.innerHTML = templateString;
    return {
        templateString,
        template,
        keyIndex
    };
}

function setAttribute(node, attributeName, propertyName, value) {
    const type = typeof value;
    const isComplexType = (type === "function" || type === "object");
    if (isCustomElement(node) &&
        node.isInitialized !== true) {
        if (isComplexType) {
            node._$tempProperties ??= {};
            node._$tempProperties[propertyName] = value;
            node.removeAttribute(attributeName);
        }
        else {
            setPrimitiveAttribute(node, attributeName, value);
        }
        return;
    }
    if (isUndefinedOrNull(value) ||
        value === false) {
        node.removeAttribute(attributeName);
        if (attributeName === "value") {
            node.value = "";
        }
        else {
            node[propertyName] = value;
        }
    }
    else {
        if (isComplexType) {
            node[propertyName] = value;
            node.removeAttribute(attributeName);
        }
        else {
            setPrimitiveAttribute(node, attributeName, value);
        }
    }
}
function setPrimitiveAttribute(node, attributeName, value) {
    if (isUndefinedOrNull(value) ||
        value === false) {
        node.removeAttribute(attributeName);
        return;
    }
    if (attributeName === "value") {
        node.value = value;
    }
    const v = valueConverter.toAttribute(value);
    node.setAttribute(attributeName, v);
}

addPatcherComparer();
function replaceChild(markerNode, newChild, oldChild) {
    if (isPrimitive(newChild) &&
        isPrimitive(oldChild)) {
        const oldChildNode = findPreviousSibling(markerNode, node => node instanceof Text &&
            node.textContent === oldChild.toString());
        if (oldChildNode !== null) {
            oldChildNode.textContent = newChild.toString();
        }
    }
    else if (isNodePatchingData(oldChild)) {
        let oldChildNode = null;
        findPreviousSibling(markerNode, node => testThisOrAnyParent(node, (n) => {
            if (n._$patchingData === undefined) {
                return false;
            }
            const { patcher, values } = n._$patchingData;
            const { patcher: otherPatcher, values: otherValues } = oldChild;
            const r = patcher === otherPatcher &&
                areEquivalent(values, otherValues);
            if (r === true) {
                oldChildNode = n;
            }
            return r;
        }));
        if (oldChildNode === null) {
            throw new Error('oldChildNode cannot be null');
        }
        const { patcher: oldPatcher, rules, values: oldValues } = oldChildNode._$patchingData;
        const { patcher, values } = newChild;
        if (patcher === oldPatcher) {
            oldPatcher.patchNode(rules || [], oldValues, values);
            newChild.node = oldChild.node;
            oldChildNode._$patchingData.values = values;
        }
        else {
            const { parentNode } = oldChildNode;
            const newChildNode = createNodes(newChild);
            parentNode.replaceChild(newChildNode, oldChildNode);
        }
    }
    else {
        throw new Error('Not implemented');
    }
}
function findPreviousSibling(markerNode, predicate) {
    let { previousSibling } = markerNode;
    while (previousSibling !== null &&
        previousSibling.textContent !== endMarker) {
        if (predicate(previousSibling) === true) {
            return previousSibling;
        }
        previousSibling = previousSibling.previousSibling;
    }
    return null;
}
function testThisOrAnyParent(node, predicate) {
    let parentNode = node;
    while (parentNode !== null) {
        if (predicate(parentNode) === true) {
            return true;
        }
        parentNode = parentNode.parentNode;
    }
    return false;
}

function removeLeftSiblings(markerNode) {
    const { parentNode } = markerNode;
    let sibling = markerNode.previousSibling;
    let endMarkersCount = 1;
    while (sibling !== null) {
        if (sibling.data === endMarker) {
            ++endMarkersCount;
        }
        if (sibling.data === beginMarker &&
            --endMarkersCount === 0) {
            break;
        }
        parentNode?.removeChild(sibling);
        sibling = markerNode.previousSibling;
    }
}

function removeLeftSibling(markerNode) {
    const { parentNode, previousSibling } = markerNode;
    parentNode?.removeChild(previousSibling);
}

function setEvent(name, newValue, oldValue, node) {
    const eventName = name.slice(2).toLowerCase();
    const nameParts = eventName.split('_');
    const useCapture = nameParts[1]?.toLowerCase() === 'capture';
    const fcn = typeof newValue === 'string' ?
        getGlobalFunction(newValue) :
        newValue;
    if (isUndefinedOrNull(oldValue) &&
        !isUndefinedOrNull(fcn)) {
        node.addEventListener(eventName, fcn, useCapture);
    }
    if (!isUndefinedOrNull(oldValue) &&
        isUndefinedOrNull(fcn)) {
        const oldFcn = typeof oldValue === 'string' ?
            getGlobalFunction(oldValue) :
            oldValue;
        node.removeEventListener(eventName, oldFcn, useCapture);
    }
    node.removeAttribute(name);
    return newValue;
}

addPatcherComparer();
class NodePatcher {
    templateString;
    template;
    rules;
    keyIndex;
    isSingleElement;
    constructor(strings) {
        const { templateString, template, keyIndex } = createTemplate(strings);
        this.templateString = templateString;
        this.template = template;
        const childNodes = template.content.childNodes;
        this.isSingleElement = childNodes.length === 1 &&
            childNodes[0].nodeType === Node.ELEMENT_NODE;
        this.rules = createNodePatcherRules(template.content);
        this.keyIndex = keyIndex;
    }
    firstPatch(rules, values = []) {
        const { length } = rules;
        for (let i = 0; i < length; ++i) {
            const value = values[i];
            const rule = rules[i];
            const { type, node } = rule;
            const attributeNames = node.getAttributeNames !== undefined ?
                node.getAttributeNames() :
                undefined;
            const attributesNotSet = new Set(attributeNames);
            switch (type) {
                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        const { parentNode } = node;
                        if (Array.isArray(value)) {
                            const df = document.createDocumentFragment();
                            value.forEach(v => {
                                if (isPrimitive(v)) {
                                    const n = document.createTextNode(v.toString());
                                    parentNode.insertBefore(n, node);
                                }
                                else {
                                    mountNodes(df, v);
                                }
                            });
                            parentNode.insertBefore(df, node);
                        }
                        else if (!isUndefinedOrNull(value)) {
                            parentNode.insertBefore(createNodes(value), node);
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const { name, property } = rule;
                        setAttribute(node, name, property, value);
                        attributesNotSet.delete(name);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const { name } = rule;
                        setEvent(name, value, null, node);
                        attributesNotSet.delete(name);
                    }
                    break;
                default: throw new Error(`firstPatch is not implemented for rule type: ${type}`);
            }
            attributesNotSet.forEach(a => {
                const value = node.getAttribute(a);
                if (value?.startsWith(attributeMarkerPrefix)) {
                    node.removeAttribute(a);
                }
            });
        }
    }
    patchNode(rules, oldValues = [], newValues = []) {
        const { length } = rules;
        for (let i = 0; i < length; ++i) {
            const oldValue = oldValues[i];
            const newValue = newValues[i];
            if (areEquivalent(oldValue, newValue)) {
                transferPatchingData(oldValue, newValue);
                continue;
            }
            const rule = rules[i];
            const { type, node } = rule;
            switch (type) {
                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        if (Array.isArray(newValue)) {
                            patchChildren(node, oldValue, newValue);
                        }
                        else {
                            if (!isUndefinedOrNull(newValue)) {
                                if (isUndefinedOrNull(oldValue)) {
                                    insertBefore(node, newValue);
                                }
                                else {
                                    if (isNodePatchingData(oldValue) &&
                                        oldValue.patcher === newValue.patcher) {
                                        updateNodes(node, oldValue, newValue);
                                    }
                                    else {
                                        replaceChild(node, newValue, oldValue);
                                    }
                                }
                            }
                            else {
                                if (oldValue !== undefined &&
                                    oldValue !== null) {
                                    if (Array.isArray(oldValue) ||
                                        isNodePatchingData(oldValue)) {
                                        removeLeftSiblings(node);
                                    }
                                    else {
                                        removeLeftSibling(node);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const { name, property } = rule;
                        setAttribute(node, name, property, newValue);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const { name } = rule;
                        setEvent(name, newValue, oldValue, node);
                    }
                    break;
                default: throw new Error(`patch is not implemented for rule type: ${type}`);
            }
        }
    }
}
function patchChildren(markerNode, oldChildren = [], newChildren = []) {
    oldChildren = oldChildren || [];
    let { length: oldChildrenCount } = oldChildren;
    const keyedNodes = MapKeyedNodes(oldChildren);
    const { length: newChildrenCount } = newChildren;
    for (let i = 0; i < newChildrenCount; ++i) {
        const newChild = newChildren[i];
        const newChildKey = getKey(newChild);
        const oldChild = oldChildren[i];
        if (oldChild === undefined) {
            if (keyedNodes.has(newChildKey)) {
                const oldChild = keyedNodes.get(newChildKey);
                updateNodes(oldChild.node, oldChild, newChild);
            }
            else {
                insertBefore(markerNode, newChild);
                ++oldChildrenCount;
            }
        }
        else {
            const oldChildKey = getKey(oldChild);
            if (newChildKey === oldChildKey) {
                if (isPrimitive(oldChild)) {
                    replaceChild(markerNode, newChild, oldChild);
                }
                else {
                    updateNodes(oldChild.node, oldChild, newChild);
                }
            }
            else {
                if (keyedNodes.has(newChildKey)) {
                    const oldKeyedChild = keyedNodes.get(newChildKey);
                    updateNodes(oldKeyedChild.node, oldKeyedChild, newChild);
                    replaceChild(markerNode, oldKeyedChild, oldChild);
                }
                else {
                    const { parentNode } = markerNode;
                    const existingChild = parentNode?.childNodes[i + 1];
                    insertBefore(existingChild, newChild);
                    ++oldChildrenCount;
                }
            }
        }
    }
    for (let i = oldChildrenCount - 1; i >= newChildrenCount; --i) {
        removeLeftSibling(markerNode);
    }
}
function MapKeyedNodes(children) {
    const keyedNodes = new Map();
    children.forEach(child => {
        const key = getKey(child);
        if (key !== null) {
            keyedNodes.set(key, child);
        }
    });
    return keyedNodes;
}
function getKey(patchingData) {
    if (isPrimitive(patchingData)) {
        return null;
    }
    const { patcher, values } = patchingData;
    const { keyIndex } = patcher;
    return keyIndex !== undefined ?
        values[keyIndex] :
        null;
}
function insertBefore(markerNode, newChild) {
    markerNode.parentNode.insertBefore(createNodes(newChild), markerNode);
}

const patchersCache = new Map();
function html(strings, ...values) {
    const key = strings.toString();
    let patcher = patchersCache.get(key);
    if (patcher === undefined) {
        patcher = new NodePatcher(strings);
        patchersCache.set(key, patcher);
    }
    return {
        patcher,
        rules: null,
        values
    };
}

const componentsRegistry = new Map();

class CustomElement extends ParentChild(ReactiveElement(StylesPatching(NodePatching(ShadowRoot(MetadataInitializer(HTMLElement)))))) {
    static isCustomElement = true;
    constructor() {
        super();
        this.initialized?.(this);
        this.isInitialized = true;
    }
    render() {
        return html `<slot></slot>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        const id = this.getAttribute('id');
        if (id !== undefined) {
            componentsRegistry.set(id, this);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        const id = this.getAttribute('id');
        if (id !== undefined) {
            componentsRegistry.delete(id);
        }
    }
    async dispatchCustomEvent(type, detail) {
        await this.updateComplete;
        this.dispatchEvent(new CustomEvent(type, {
            detail: detail,
            bubbles: true,
            composed: true,
        }));
        console.log(`Event of type: '${type}' was dispatched with detail:`);
        console.dir(detail);
    }
}

function defineCustomElement(name, constructor) {
    if (customElements.get(name) === undefined) {
        customElements.define(name, constructor);
    }
}

function css(strings, ...values) {
    return values.reduce((acc, val, idx) => [...acc, val, strings[idx + 1]], [strings[0]]).join('');
}

const viewsRegistry = new Map();

function mergeStyles(style1, style2) {
    if (style1 === undefined) {
        return `
${style2}
    `.trim();
    }
    else {
        return `
${style1}

${style2}
    `.trim();
    }
}

const disableableStyles = css `
:host([disabled="true"]),
:host([disabled=""]) {
    cursor: not-allowed;
}

*[disabled="true"],
*[disabled=""] {
    cursor: not-allowed;
}`;

function Disableable(Base) {
    return class DisableableMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, disableableStyles);
        }
        static get properties() {
            return {
                disabled: {
                    type: DataTypes.Boolean,
                    value: false,
                    reflect: true,
                    inherit: true,
                    afterChange: (value) => {
                        if (value === true) {
                            this.enableEvents?.();
                        }
                        else {
                            this.disableEvents?.();
                        }
                    }
                }
            };
        }
    };
}

const hoverableStyles = css `
:host([hoverable]:hover) {
    background-color: var(--hover-bg-color);
    color: var(--hover-text-color);
    transition: all 0.3s ease;
}`;

function Hoverable(Base) {
    return class HoverableMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, hoverableStyles);
        }
        static get properties() {
            return {
                hoverable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true
                }
            };
        }
    };
}

const clickableStyles = css `
:host {
    cursor: pointer
}

* {
    cursor: pointer;
}`;

function Clickable(Base) {
    return class ClickableMixin extends Disableable(Hoverable(Base)) {
        static get styles() {
            return mergeStyles(super.styles, clickableStyles);
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.enableEvents();
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.disableEvents();
        }
        enableEvents() {
            super.enableEvents?.();
            this.addEventListener('click', this.handleClick);
        }
        disableEvents() {
            super.disableEvents?.();
            this.removeEventListener('click', this.handleClick);
        }
    };
}

const cssVariables = new Map();
cssVariables.set("color", "--gcs-color-");
cssVariables.set("background-color", "--gcs-background-color-");
cssVariables.set("color-contained", "--gcs-color-contained-");
cssVariables.set("background-color-contained", "--gcs-background-color-contained-");
cssVariables.set("disabled-color", "--gcs-disabled-color");
cssVariables.set("disabled-background-color", "--gcs-disabled-background-color");
cssVariables.set("font-size", "--gcs-font-size-");
cssVariables.set("icon-size", "--gcs-icon-size-");
cssVariables.set("min-height", "--gcs-min-height");
cssVariables.set("margin", "--gcs-margin");

const variants = ['outlined', 'text', 'contained'];
function addOutlinedStyle(styles, kind, variant, innerSelector = '') {
    styles.push(css `
:host([kind='${kind}'][variant='${variant}']) ${innerSelector} { 
    color: var(${cssVariables.get("color")}${kind}); 
    background-color: var(${cssVariables.get("background-color")}${kind}); 
    border-color: var(${cssVariables.get("color")}${kind}); 
}`);
}
function addTextStyle(styles, kind, variant, innerSelector = '') {
    styles.push(css `
:host([kind='${kind}'][variant='${variant}']) ${innerSelector} { 
    color: var(${cssVariables.get("color")}${kind});
}`);
}
function addContainedStyle(styles, kind, variant, innerSelector = '') {
    styles.push(css `
:host([kind='${kind}'][variant='${variant}']) ${innerSelector} { 
    color: var(${cssVariables.get("color-contained")}${kind}); 
    background-color: var(${cssVariables.get("background-color-contained")}${kind}); 
}`);
}
function createVariantStyles(ctor, kind) {
    const styles = [];
    switch (ctor.name) {
        case "Button":
            {
                variants.forEach(variant => {
                    switch (variant) {
                        case 'outlined':
                            {
                                addOutlinedStyle(styles, kind, variant, 'button:not(disabled)');
                                styles.push(css `
:host([kind='${kind}'][variant='${variant}']) button:disabled { 
    color: var(${cssVariables.get("disabled-color")}); 
    background-color: var(${cssVariables.get("disabled-background-color")}); 
    border-color: var(${cssVariables.get("disabled-color")}); 
}`);
                            }
                            break;
                        case 'text':
                            {
                                addTextStyle(styles, kind, variant, 'button:not(disabled)');
                                styles.push(css `
:host([kind='${kind}'][variant='${variant}']) button:disabled { 
    color: var(${cssVariables.get("disabled-color")});
}`);
                            }
                            break;
                        case 'contained':
                            {
                                addContainedStyle(styles, kind, variant, 'button:not(disabled)');
                                styles.push(css `
:host([kind='${kind}'][variant='${variant}']) button:disabled { 
    color: var(${cssVariables.get("disabled-background-color")}); 
    background-color: var(${cssVariables.get("disabled-color")}); 
}`);
                            }
                            break;
                        default: throw new Error(`createVariantStyles not implemented for variant: '${variant}'`);
                    }
                });
            }
            break;
        default:
            {
                variants.forEach(variant => {
                    switch (variant) {
                        case 'outlined':
                            {
                                addOutlinedStyle(styles, kind, variant);
                            }
                            break;
                        case 'text':
                            {
                                addTextStyle(styles, kind, variant);
                            }
                            break;
                        case 'contained':
                            {
                                addContainedStyle(styles, kind, variant);
                            }
                            break;
                        default: throw new Error(`createVariantStyles not implemented for variant: '${variant}'`);
                    }
                });
            }
            break;
    }
    return css `${styles.join('\n')}`;
}

const kinds = ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger'];
function createKindStyles(ctor) {
    const styles = [];
    switch (ctor.name) {
        case "LocalizedText":
        case "Icon":
            break;
        case "Button":
        case "Badge":
        case "Pill":
        case "CloseTool":
        case "ExpanderTool":
        case "SorterTool":
            {
                kinds.forEach(kind => styles.push(createVariantStyles(ctor, kind)));
            }
            break;
        default:
            {
                console.warn(`Setting default kind styles for element: '${ctor.name}'`);
                kinds.forEach(kind => styles.push(css `
:host([kind='${kind}']) { 
    color: var(${cssVariables.get("color")}${kind}); 
    background-color: var(${cssVariables.get("background-color")}${kind}); 
}`));
            }
            break;
    }
    return css `${styles.join('\n')}`;
}
function Kind(Base) {
    return class KindMixin extends Base {
        static get properties() {
            return {
                kind: {
                    type: DataTypes.String,
                    options: kinds,
                    inherit: true,
                    reflect: true,
                }
            };
        }
        static get styles() {
            return mergeStyles(super.styles, createKindStyles(this));
        }
    };
}

const sizes = ['large', 'medium', 'small'];
function createSizeStyles(ctor) {
    const styles = [];
    styles.push(css `
:host {
    min-height: var(${cssVariables.get("min-height")});
}`);
    if (![
        "CloseTool",
        "SorterTool",
        "ExpanderTool"
    ].includes(ctor.name)) {
        styles.push(css `
:host {
    margin: var(${cssVariables.get("margin")});
}`);
    }
    sizes.forEach(size => {
        switch (ctor.name) {
            case "TextField":
                {
                    styles.push(css `
:host([size='${size}']) input[type='text'] {
    font-size: var(${cssVariables.get("font-size")}${size});
}`);
                }
                break;
            case "Icon":
                {
                    styles.push(css `
:host([size='${size}']) {
    font-size: var(${cssVariables.get("icon-size")}${size});
}`);
                }
                break;
            default:
                {
                    styles.push(css `
:host([size='${size}']) {
    font-size: var(${cssVariables.get("font-size")}${size});
}`);
                }
                break;
        }
    });
    return css `${styles.join('\n')}`;
}

function Sizable(Base) {
    return class SizableMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, createSizeStyles(this));
        }
        static get properties() {
            return {
                size: {
                    type: DataTypes.String,
                    value: sizes[1],
                    reflect: true,
                    inherit: true,
                    options: sizes
                }
            };
        }
    };
}

function Variant(Base) {
    return class VariantMixin extends Base {
        static get properties() {
            return {
                variant: {
                    type: DataTypes.String,
                    value: variants[0],
                    reflect: true,
                    inherit: true,
                    options: variants
                }
            };
        }
    };
}

class Nuanced extends Sizable(Variant(Kind(CustomElement))) {
}

class Tool extends Clickable(Nuanced) {
    static get properties() {
        return {
            iconName: {
                type: [
                    DataTypes.String,
                    DataTypes.Function
                ],
                defer: true,
                required: true
            }
        };
    }
    render() {
        const { iconName, } = this;
        return html `<gcs-icon name=${typeof iconName === 'function' ? iconName() : iconName}></gcs-icon>`;
    }
}

const closingEvent = 'closingEvent';
class CloseTool extends Tool {
    constructor() {
        super();
        this.iconName = "x";
    }
    static get properties() {
        return {
            close: {
                type: DataTypes.Function,
                required: true,
                defer: true
            }
        };
    }
    handleClick() {
        this.close?.();
    }
}
defineCustomElement('gcs-close-tool', CloseTool);

class Dialog extends CustomElement {
    static get properties() {
        return {
            content: {
                type: DataTypes.Function,
                defer: true,
            }
        };
    }
    static get state() {
        return {
            showing: {
                value: false
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(closingEvent, this.handleClose);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(closingEvent, this.handleClose);
    }
    handleClose() {
        this.showing = false;
    }
    render() {
        const { showing, content } = this;
        if (showing !== true) {
            return null;
        }
        if (content) {
            return html `
<gcs-overlay>
    ${content()}
</gcs-overlay>`;
        }
        else {
            return html `
<gcs-overlay>
    <slot></slot>
</gcs-overlay>`;
        }
    }
}
defineCustomElement('gcs-dialog', Dialog);

const routersRegistry = new Map();
function addRouter(name, router) {
    routersRegistry.set(name, router);
    updateRoutes();
}
function removeRouter(name) {
    routersRegistry.delete(name);
    updateRoutes();
}
function updateRoutes() {
    setTimeout(() => routersRegistry.forEach(r => r.route()), 0);
}
function navigateToRoute(route, routerName = undefined) {
    const router = getRouter(routerName);
    router.rewriteHash(route);
}
function getRouter(routerName = undefined) {
    if (routerName === undefined) {
        switch (routersRegistry.size) {
            case 0: throw new Error('There are no routers registered in the registry');
            case 1:
                {
                    const iterator = routersRegistry.values();
                    return iterator.next().value;
                }
            default: throw new Error('There are more than one router registered in the registry. The name of the router is required');
        }
    }
    else {
        return routersRegistry.get(routerName);
    }
}

const errorEvent = "errorEvent";

class Observer {
    callbackName;
    _subscribers = [];
    constructor(callbackName = 'onNotify') {
        this.callbackName = callbackName;
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
    }
    unsubscribe(subscriber) {
        const index = this._subscribers.indexOf(subscriber);
        if (index > -1) {
            this._subscribers.splice(index, 1);
        }
    }
    notify(...args) {
        args.push(this);
        for (const subscriber of this._subscribers) {
            subscriber[this.callbackName]?.(...args);
        }
    }
}

class IntlProvider extends Observer {
    lang;
    data;
    constructor(lang, data) {
        super('handleLanguageChanged');
        this.lang = lang;
        this.data = data;
    }
    setLanguage(lang) {
        if (this.lang !== lang) {
            this.lang = lang;
            this.notify();
        }
    }
    getTranslation(lang, key) {
        const lng = lang || this.lang;
        const data = this.data[lng];
        if (data === undefined) {
            console.error(`There are no translations for language: [${lng}]. (key was [${key}]).`);
            return undefined;
        }
        const translation = data[key];
        if (translation === undefined) {
            console.error(`Missing translation for key: [${key}] in language: [${lng}].`);
            return undefined;
        }
        return translation;
    }
}

const AppInitializedEvent = "AppInitializedEvent";
class AppCtrl {
    application;
    errorHandler;
    user;
    intlProvider;
    iconsPath;
    dialog = new Dialog();
    apiUrl;
    themeNamesUrl;
    defaultTheme;
    routeParams;
    async init() {
        console.log('Initializing appCtrl...');
        this.handleError = this.handleError.bind(this);
        const appConfig = window.appConfig;
        if (appConfig !== undefined) {
            const { errorHandler, intl, iconsPath, apiUrl, themeNamesUrl, defaultTheme } = appConfig;
            if (intl !== undefined) {
                const lang = intl.lang || window.document.documentElement.getAttribute('lang') || window.navigator.language;
                this.intlProvider = new IntlProvider(lang, intl.data);
            }
            this.errorHandler = errorHandler;
            this.iconsPath = iconsPath;
            this.apiUrl = apiUrl;
            this.themeNamesUrl = themeNamesUrl;
            this.defaultTheme = defaultTheme;
            window.dispatchEvent(new CustomEvent(AppInitializedEvent, {
                bubbles: true,
                composed: true,
            }));
        }
        const themeName = window.localStorage.getItem('app-theme') || appCtrl.defaultTheme;
        this.setTheme(themeName);
        document.body.appendChild(this.dialog);
        document.addEventListener(errorEvent, this.handleError);
        window.addEventListener('hashchange', updateRoutes);
        updateRoutes();
    }
    setTheme(theme) {
        window.document.firstElementChild.setAttribute('theme', theme);
    }
    showDialog(content) {
        const { dialog } = this;
        dialog.content = content;
        dialog.showing = true;
    }
    handleError(evt) {
        const { errorHandler } = this;
        if (errorHandler !== undefined) {
            errorHandler.handleError(evt);
        }
        else {
            const { error, } = evt.detail;
            const content = () => html `<gcs-alert kind="danger" close>${error.message || error.statusText}</gcs-alert>`;
            this.showDialog(content);
        }
    }
}
const appCtrl = new AppCtrl();
await appCtrl.init();
window.addEventListener('languagechange', () => {
    console.log("languagechange event detected!");
});

class Theme {
    name;
}

const iconStyles = css `
:host svg {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
}`;

const iconsCache = new Map();
class Icon extends Sizable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, iconStyles);
    }
    static get properties() {
        return {
            name: {
                type: DataTypes.String,
                required: true
            }
        };
    }
    async render() {
        const { name } = this;
        if (name === undefined) {
            return null;
        }
        const { iconsPath } = appCtrl;
        if (iconsPath === undefined) {
            throw new Error('Path to the icons has not been configured');
        }
        const iconPath = `${iconsPath}${typeof name === 'function' ? name() : name}.svg`;
        let svg = undefined;
        if (iconsCache.has(iconPath)) {
            svg = iconsCache.get(iconPath);
        }
        else {
            const response = await fetch(iconPath);
            svg = await response.text();
            if (svg.match(/script/i) ||
                svg.match(/onerror/i)) {
                throw new Error(`Potencial XSS threat in file: ${iconPath}`);
            }
            iconsCache.set(iconPath, svg);
        }
        return html([svg]);
    }
}
defineCustomElement('gcs-icon', Icon);

function getContentTextNode(element) {
    const textNodes = Array.from(element.childNodes)
        .filter(n => n.nodeType == element.TEXT_NODE);
    if (!textNodes) {
        return null;
    }
    return textNodes[0];
}

const localizedTextStyles = css `
:host {
    overflow-wrap: break-word;
}`;

class LocalizedText extends Sizable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, localizedTextStyles);
    }
    _key = '';
    static get properties() {
        return {
            lang: {
                type: DataTypes.String,
                reflect: true
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        const { intlProvider } = appCtrl;
        if (!intlProvider) {
            console.log('intlProvider is null');
        }
        else {
            const pageLang = document.documentElement.lang || navigator.language;
            console.log(`Page language: ${pageLang}`);
            const lang = this.lang || intlProvider?.lang;
            if (pageLang !== lang) {
                intlProvider?.subscribe(this);
                const textNode = getContentTextNode(this);
                if (textNode === null) {
                    throw new Error('Localized text must have content');
                }
                const content = textNode?.textContent || '';
                this._key = content;
                textNode.textContent = intlProvider?.getTranslation(lang, this._key) || content;
            }
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        if (this._key) {
            appCtrl.intlProvider?.unsubscribe(this);
        }
    }
    render() {
        return html `<slot></slot>`;
    }
    handleLanguageChanged(provider) {
        const { _key, lang } = this;
        const textNode = getContentTextNode(this);
        if (textNode === null) {
            throw new Error('Localized text must have content');
        }
        textNode.textContent = provider?.getTranslation(lang, _key) || textNode.textContent;
    }
}
defineCustomElement('gcs-localized-text', LocalizedText);

const alertStyles = css `
:host {
    display: flex;
    max-width: 80%;
    max-height: 80%;
    align-items: center;  
    justify-content: space-between;
    border-style: solid;
    border-width: var(--gcs-border-width);
    column-gap: 1rem;
    border-radius: var(--gcs-border-radius);
    z-index: 10000;
}`;

class Alert extends Nuanced {
    static get styles() {
        return mergeStyles(super.styles, alertStyles);
    }
    static get properties() {
        return {
            showIcon: {
                type: DataTypes.Boolean,
                value: true
            },
            close: {
                type: [
                    DataTypes.Function,
                    DataTypes.Boolean
                ],
                defer: true
            }
        };
    }
    render() {
        return html `
${this._renderIcon()}
<div style="word-wrap: break-word; max-height: 80vh; overflow: auto;">
    <slot></slot>
</div>
${this._renderCloseTool()}`;
    }
    _renderIcon() {
        const { showIcon, } = this;
        if (showIcon !== true) {
            return html `<span></span>`;
        }
        return html `<gcs-icon name=${this._getIconName()}></gcs-icon>`;
    }
    _getIconName() {
        switch (this.kind) {
            case "success": return "check-circle-fill";
            case "warning": return "exclamation-circle-fill";
            case "error": return "exclamation-circle-fill";
            default: return "info-circle-fill";
        }
    }
    _renderCloseTool() {
        const { close } = this;
        if (close === undefined) {
            return html `<span></span>`;
        }
        const handleClose = close === true ?
            evt => this.dispatchCustomEvent(closingEvent, {
                originalEvent: evt
            }) :
            evt => this.close(evt);
        return html `<gcs-close-tool close=${handleClose}></gcs-close-tool>`;
    }
}
defineCustomElement('gcs-alert', Alert);

const accordionStyles = css `
:host {   
    display: block;
    width: 100%;
}

#content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
}`;

class Accordion extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, accordionStyles);
    }
    static get properties() {
        return {
            collapsed: {
                type: DataTypes.Boolean,
                value: false,
                reflect: true,
                afterUpdate: function () {
                    const content = this.document.getElementById('content');
                    if (this.collapsed === true) {
                        content.style.maxHeight = '0';
                    }
                    else {
                        content.style.maxHeight = `${content.scrollHeight}px`;
                    }
                }
            }
        };
    }
    constructor() {
        super();
        this.toggleContentVisibility = this.toggleContentVisibility.bind(this);
    }
    render() {
        return html `
<gcs-button id="header" click=${this.toggleContentVisibility}>
    <slot name="label"></slot>
    ${this.renderExpanderIcon()}
</gcs-button>
<div id="content">
    <slot name="content"></slot>
</div>`;
    }
    toggleContentVisibility() {
        this.collapsed = !this.collapsed;
    }
    renderExpanderIcon() {
        return this.collapsed === true ?
            html `<gcs-icon name="chevron-down"></gcs-icon>` :
            html `<gcs-icon name="chevron-up"></gcs-icon>`;
    }
}
defineCustomElement('gcs-accordion', Accordion);

const pillStyles = css `
:host {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-radius: 1em;
    width: fit-content;
    padding: 0 .5em;
}`;

class Pill extends Nuanced {
    static get styles() {
        return mergeStyles(super.styles, pillStyles);
    }
    render() {
        return html `<slot></slot>`;
    }
}
defineCustomElement('gcs-pill', Pill);

const buttonStyles = css `
button {
    display: inline-flex;
    align-items: center;
    justify-content: start;
    user-select: none;
    cursor: pointer;
    border-width: var(--gcs-border-width);
    border-radius: var(--gcs-border-radius);
    
    /* outline: 0;
      margin-right: 8px;
      margin-bottom: 12px;
      line-height: 1.5715;
      position: relative;
    
      font-weight: 400;
      white-space: nowrap;
      text-align: center;
      background-image: none;
      border: 1px solid transparent;
      -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, .015);
      box-shadow: 0 2px 0 rgba(0, 0, 0, .015);
      -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
       */
}

:host([variant='outlined']) button {
    border-style: solid;
}

:host([variant='text']) button {
    border-style: none;
}`;

function Hideable(Base) {
    return class HideableMixin extends Base {
        static get properties() {
            return {
                hidden: {
                    type: DataTypes.Boolean,
                    value: false,
                    reflect: true
                }
            };
        }
        render() {
            if (this.hidden === true) {
                return null;
            }
            return super.render();
        }
    };
}

class Button extends Hideable(Disableable(Nuanced)) {
    static get styles() {
        return mergeStyles(super.styles, buttonStyles);
    }
    static get properties() {
        return {
            click: {
                type: DataTypes.Function,
                defer: true
            }
        };
    }
    render() {
        const { disabled, click } = this;
        return html `<button disabled=${disabled} onClick=${click}>
            <slot></slot>
        </button>`;
    }
}
defineCustomElement('gcs-button', Button);

function applyClasses(element, props) {
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            if (props[key] === true) {
                element.classList.add(key);
            }
            else {
                element.classList.remove(key);
            }
        }
    }
}

const toolTipStyles = css `
.container {
    position: relative;
    display: inline-block;
}
  
.container #content {
    visibility: hidden;
    background-color: #555;
    color: #fff;
    padding: 5px 0;
    border-radius: 6px;
  
    /* position the content */
    position: absolute;
    z-index: 1;  
  
    /* fade in container */
    opacity: 0;
    transition: opacity 0.3s;
}

/* position */
.container #content.top {
    bottom: 100%;
    left: 50%;
    margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
}

.container #content.bottom {
    top: 100%;
    left: 50%;
    margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
}

.container #content.left {
    top: -5px;
    right: 105%;
}

.container #content.right {
    top: -5px;
    left: 105%;
}

/* arrow */
.container #content::after {
    content: "";
    position: absolute;
    border-width: 5px;
    border-style: solid;
}

.container #content.top::after {
    top: 100%; /* At the bottom of the tooltip */  
    left: 50%;
    margin-left: -5px;
    border-color: black transparent transparent transparent;
}

.container #content.bottom::after {
    bottom: 100%;  /* At the top of the tooltip */
    left: 50%;
    margin-left: -5px; 
    border-color: transparent transparent black transparent;
}

.container #content.left::after {
    top: 50%;
    left: 100%; /* To the right of the tooltip */
    margin-top: -5px;
    border-color: transparent transparent transparent black;
}

.container #content.right::after {
    top: 50%;
    right: 100%; /* To the left of the tooltip */   
    margin-top: -5px;
    border-color: transparent black transparent transparent;
}
  
/* Show the container text when you mouse over the container container */
.container:hover #content {
    visibility: visible;
    opacity: 1;
}`;

class ToolTip extends CustomElement {
    static get styles() {
        return toolTipStyles;
    }
    static get properties() {
        return {
            position: {
                type: DataTypes.String,
                value: 'bottom',
                options: ['top', 'bottom', 'left', 'right']
            }
        };
    }
    render() {
        return html `<div class="container">
            <span id="trigger">
                <slot name="trigger"></slot>
            </span>       
            <span id="content">
                <slot name="content"></slot>
            </span>
        </div>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        window.addEventListener('resize', () => this.handleResize());
    }
    didMountCallback() {
        this._positionContent();
    }
    didUpdateCallback() {
        this._positionContent();
    }
    handleResize() {
        this._positionContent();
    }
    _positionContent() {
        const trigger = this.document.getElementById("trigger");
        const content = this.document.getElementById("content");
        const p = this.getFittingPosition(trigger, content, this.position);
        applyClasses(content, {
            'top': p === 'top',
            'bottom': p === 'bottom',
            'left': p === 'left',
            'right': p === 'right',
        });
    }
    getFittingPosition(trigger, content, pos) {
        const { clientWidth, clientHeight } = document.documentElement;
        const { x: triggerX, y: triggerY, height: triggerHeight, width: triggerWidth } = trigger.getBoundingClientRect();
        const { height: contentHeight, width: contentWidth } = content.getBoundingClientRect();
        switch (pos) {
            case 'top':
                {
                    pos = triggerY < triggerHeight ? 'bottom' : 'top';
                }
                break;
            case 'bottom':
                {
                    pos = triggerY + triggerHeight + contentHeight > clientHeight ? 'top' : 'bottom';
                }
                break;
            case 'left':
                {
                    pos = triggerX < triggerWidth ? 'right' : 'left';
                }
                break;
            case 'right':
                {
                    pos = triggerX + triggerWidth + contentWidth > clientWidth ? 'left' : 'right';
                }
                break;
        }
        return pos;
    }
}
defineCustomElement('gcs-tool-tip', ToolTip);

class DataTemplate extends CustomElement {
    static get properties() {
        return {
            data: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ],
                value: undefined
            },
            template: {
                type: DataTypes.Function,
                required: true,
                defer: true
            }
        };
    }
    render() {
        const { data, template } = this;
        return data === undefined ?
            null :
            template(data);
    }
}
defineCustomElement('gcs-data-template', DataTemplate);

const selectableStyles = css `
:host([selected]) {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
	transition: all 0.3s ease;
}

:host([selected]:hover) {
    background-color: var(--active-hover-bg-color);
    color: var(--active-hover-text-color);
    transition: all 0.3s ease;
}`;

const selectionChangedEvent = 'selectionChanged';
function Selectable(Base) {
    return class SelectableMixin extends Clickable(Base) {
        static get styles() {
            return mergeStyles(super.styles, selectableStyles);
        }
        static get properties() {
            return {
                selectable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true,
                    inherit: true
                },
                selected: {
                    type: DataTypes.Boolean,
                    reflect: true,
                    canChange: function () {
                        return this.selectable === true;
                    }
                },
                selectValue: {
                    attribute: 'select-value',
                    type: [
                        DataTypes.String,
                        DataTypes.Object
                    ]
                }
            };
        }
        handleClick() {
            this.setSelected(!this.selected);
        }
        setSelected(selected) {
            if (this.selectable === true) {
                this.selected = selected;
                this.dispatchCustomEvent(selectionChangedEvent, {
                    element: this,
                    selected,
                    value: this.selectValue
                });
            }
        }
    };
}

class Selector extends Selectable(CustomElement) {
}
defineCustomElement('gcs-selector', Selector);

function getChildren(node) {
    const children = [];
    if (node instanceof HTMLSlotElement) {
        const childNodes = node.assignedNodes({ flatten: true });
        children.push(...childNodes);
    }
    else if (node instanceof HTMLElement) {
        const slots = node.querySelectorAll('slot');
        slots.forEach((slot) => {
            const childNodes = slot.assignedNodes({ flatten: true });
            children.push(...childNodes);
        });
        let childNodes = Array.from(node.childNodes);
        children.push(...childNodes);
        if (node.shadowRoot === null) {
            return children;
        }
        node = node.shadowRoot;
        childNodes = Array.from(node.childNodes);
        children.push(...childNodes);
    }
    return children;
}
function getAllChildren(node) {
    const children = [node];
    getChildren(node).forEach((child) => {
        children.push(...getAllChildren(child));
    });
    return children;
}

const _shownElements = [];
let _justShown;
const popupManager = {
    setShown(element) {
        let count = _shownElements.length;
        while (count > 0) {
            const shownElement = _shownElements[count - 1];
            if (shownElement !== element &&
                !getAllChildren(shownElement).includes(element)) {
                shownElement.hideContent();
            }
            --count;
        }
        _shownElements.push(element);
        _justShown = element;
    },
    setHidden(element) {
        while (_shownElements.length > 0) {
            const shownElement = _shownElements[_shownElements.length - 1];
            if (shownElement !== element) {
                shownElement.hideContent();
                _shownElements.pop();
            }
            else {
                _shownElements.pop();
                break;
            }
        }
    },
    handleGlobal(target) {
        if (_justShown !== undefined) {
            _justShown = undefined;
            return;
        }
        let count = _shownElements.length;
        while (count > 0) {
            const shownElement = _shownElements[count - 1];
            if (!shownElement.contains(target)
                && target.dropdown !== shownElement) {
                shownElement.hideContent();
            }
            else {
                break;
            }
            --count;
        }
    }
};
window.onclick = function (event) {
    popupManager.handleGlobal(event.target);
};

function getClasses(props) {
    const classes = [];
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            if (props[key] === true) {
                classes.push(key);
            }
        }
    }
    return classes.join(' ');
}

const expanderChanged = 'expanderChanged';
class ExpanderTool extends Tool {
    constructor() {
        super();
        this.updateShowing = this.updateShowing.bind(this);
    }
    static get state() {
        return {
            showing: {
                value: false
            }
        };
    }
    iconName = () => {
        const { showing } = this;
        if (showing === undefined) {
            return 'chevron-down';
        }
        return showing === true ?
            'chevron-up' :
            'chevron-down';
    };
    hideContent() {
        this.updateShowing(false);
    }
    updateShowing(showing) {
        this.showing = showing;
        this.dispatchCustomEvent(expanderChanged, {
            showing,
            element: this
        });
    }
    handleClick() {
        let { showing } = this;
        showing = !showing;
        this.updateShowing(showing);
    }
}
defineCustomElement('gcs-expander-tool', ExpanderTool);

const dropDownStyles = css `
:host {
  position: relative;
  border-width: var(--gcs-border-width);
  padding: 0 0 0 1rem;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.show {
    display:block;
}`;

class DropDown extends CustomElement {
    static get styles() {
        return dropDownStyles;
    }
    static get state() {
        return {
            showing: {
                value: false
            }
        };
    }
    constructor() {
        super();
        this.handleDropChanged = this.handleDropChanged.bind(this);
    }
    render() {
        const { showing } = this;
        const contentClasses = getClasses({
            'dropdown-content': true,
            'show': showing
        });
        return html `<slot id="header" name="header"></slot>
            <gcs-expander-tool id="expander-tool"></gcs-expander-tool>
            <slot id="content" class=${contentClasses} name="content"></slot>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(expanderChanged, this.handleDropChanged);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(expanderChanged, this.handleDropChanged);
    }
    handleDropChanged(evt) {
        evt.stopPropagation();
        const { showing } = evt.detail;
        if (showing === true) {
            popupManager.setShown(this);
        }
        this.showing = showing;
    }
    hideContent() {
        const expanderTool = this.document.getElementById('expander-tool');
        expanderTool.hideContent();
        popupManager.setHidden(this);
    }
}
defineCustomElement('gcs-drop-down', DropDown);

class WizardStep extends CustomElement {
}
defineCustomElement('gcs-wizard-step', WizardStep);

function template(text, data) {
    const result = {
        keysNotInData: []
    };
    if (!data) {
        result.text = text;
        return result;
    }
    result.keysNotInData = Object.keys(data);
    function processMatch(match) {
        const key = match
            .replace('{{', '')
            .replace('}}', '')
            .trim();
        if (data?.hasOwnProperty(key)) {
            const index = result.keysNotInData.indexOf(key);
            if (index > -1) {
                result.keysNotInData.splice(index, 1);
            }
            return data[key].toString();
        }
        else {
            return match;
        }
    }
    result.text = text.replace(/\{{\S+?\}}/g, processMatch);
    return result;
}

class Validator {
    message;
    constructor(defaultMessage, options) {
        this.message = options?.message || defaultMessage;
        const intlProvider = appCtrl.intlProvider;
        if (intlProvider !== undefined) {
            this.message = intlProvider.getTranslation(intlProvider.lang, this.message) || this.message;
        }
    }
    emitErrors(context, data) {
        const result = template(this.message, data);
        context.errors.push(result.text);
    }
    emitWarnings(context, data) {
        const result = template(this.message, data);
        context.warnings.push(result.text);
    }
}

class SingleValueFieldValidator extends Validator {
}

class RequiredValidator extends SingleValueFieldValidator {
    allowEmpty;
    constructor(options = {}) {
        super('{{label}} is required', options);
        this.allowEmpty = options.allowEmpty || false;
    }
    validate(context) {
        const { label, value } = context;
        let valid;
        valid = !(value === undefined || value === null);
        if (valid === true && this.allowEmpty === false) {
            valid = value !== '';
        }
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}

class MaxLengthValidator extends SingleValueFieldValidator {
    maxLength;
    constructor(options) {
        super(`{{label}} is cannot have more than ${options.maxLength} characters`, options);
        this.maxLength = options.maxLength;
    }
    validate(context) {
        const { label, value } = context;
        const { maxLength } = this;
        const valid = isUndefinedOrNull(value) ||
            value.length <= maxLength;
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}

class RegexValidator extends SingleValueFieldValidator {
    _regex;
    constructor(message, options) {
        super(message, options);
        this._regex = options.regex;
    }
    validate(context) {
        const { label, value } = context;
        if (value === undefined) {
            return true;
        }
        const valid = this._regex.test(value);
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
}

class EmailValidator extends RegexValidator {
    constructor(options = {
        regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    }) {
        super('{{label}} is not a valid email', options);
    }
}

class RecordValidator extends Validator {
    getData(context) {
        return context.dataProvider.getData();
    }
}

class CompareValidator extends RecordValidator {
    _propertyToCompare;
    _operator;
    constructor(options) {
        super("{{label}} must match", options);
        this._propertyToCompare = options.propertyToCompare;
        this._operator = options.operator || 1;
    }
    validate(context) {
        const { _propertyToCompare, _operator } = this;
        const data = this.getData(context);
        const { value } = context;
        const valueToCompare = data[_propertyToCompare];
        const valid = this._compare(value, valueToCompare, _operator);
        if (!valid) {
            this.emitErrors(context, {
                value,
                propertyToCompare: _propertyToCompare,
                valueToCompare,
                operator: _operator
            });
        }
        return valid;
    }
    _compare(valueToValidate, valueToCompare, operator) {
        switch (operator) {
            case 1: return valueToValidate === valueToCompare;
            case 2: return valueToValidate !== valueToCompare;
            case 3: return valueToValidate > valueToCompare;
            case 4: return valueToValidate >= valueToCompare;
            case 5: return valueToValidate < valueToCompare;
            case 6: return valueToValidate <= valueToCompare;
            default: throw new Error(`Invalid comparison operator: ${operator}`);
        }
    }
}

function notifyError(element, error) {
    element.dispatchCustomEvent(errorEvent, {
        error: {
            ...error,
            message: getErrorMessage(error)
        }
    });
}
function getErrorMessage(error) {
    if (typeof error === 'string') {
        return error;
    }
    if (error instanceof Error) {
        return error.message || error.statusText;
    }
    else {
        if (error.payload) {
            if (typeof error.payload === 'string') {
                return error.payload;
            }
            else if (Array.isArray(error.payload)) {
                return error.payload.join('\n');
            }
            else {
                const payload = JSON.parse(error.payload);
                if (payload.errors !== undefined) {
                    return Object.values(payload.errors).join('\n');
                }
                else if (payload.title !== undefined) {
                    return payload.title;
                }
            }
        }
        else if (error.statusText) {
            return error.statusText;
        }
        else {
            switch (error.status) {
                case 404: return 'Resource not found';
                default: throw new Error(`Not implemented for error status: ${error.status}`);
            }
        }
    }
    throw new Error(`getErrorMessage - Unhandled error: ${error}`);
}

function deserializeXmlDocument(document) {
    const o = {};
    const childNodes = document.documentElement.childNodes;
    const length = childNodes.length;
    for (let i = 0; i < length; ++i) {
        const childNode = childNodes[i];
        if (childNode.nodeType === Node.ELEMENT_NODE) {
            o[childNode.nodeName] = childNode.childNodes[0].nodeValue;
        }
    }
    return o;
}

const ContentType = 'Content-Type';
const ContentTypeApplicationJson = 'application/json';
const ContentTypeTextPlain = 'text/plain';
class Fetcher {
    onResponse;
    onError;
    onData;
    contentType;
    constructor(callbacks) {
        const { onResponse, onError, onData } = callbacks;
        if (onResponse !== undefined) {
            this.onResponse = onResponse.bind(this);
        }
        if (onError !== undefined) {
            this.onError = onError.bind(this);
        }
        if (onData !== undefined) {
            this.onData = onData.bind(this);
        }
    }
    async fetch(request) {
        const { method = 'GET', cors, authProvider } = request;
        const url = this.buildUrl(request);
        try {
            const response = await fetch(url, {
                method,
                headers: await this.buildHeaders(request),
                body: this.buildBody(request),
                mode: cors === false ? 'same-origin' : 'cors',
                credentials: authProvider !== undefined ? 'include' : undefined
            });
            if (response.status != 204) {
                return await this.processResponse(response);
            }
        }
        catch (error) {
            this.handleError(error);
        }
        return null;
    }
    buildUrl(request) {
        const { url, params } = request;
        const { text, keysNotInData } = template(url, params);
        if (params !== undefined) {
            const queryParams = keysNotInData
                .map(key => `${key}=${params[key]}`)
                .join('&');
            return text.indexOf('?') > -1 ? `${text}&${queryParams}` : `${text}?${queryParams}`;
        }
        return text;
    }
    async buildHeaders(request) {
        const requestHeaders = request.headers || {};
        this.contentType = this.contentType || ContentTypeApplicationJson;
        if (requestHeaders[ContentType] === undefined) {
            requestHeaders[ContentType] = this.contentType;
        }
        const headers = new Headers();
        for (const key in requestHeaders) {
            if (requestHeaders.hasOwnProperty(key)) {
                headers.append(key, requestHeaders[key]);
            }
        }
        if (request.authProvider !== undefined) {
            const authHeader = await request.authProvider.authorize();
            if (authHeader != undefined) {
                for (const key in authHeader) {
                    if (authHeader.hasOwnProperty(key)) {
                        headers.append(key, authHeader[key]);
                    }
                }
            }
        }
        return headers;
    }
    buildBody(request) {
        const { data } = request;
        if (data === undefined) {
            return undefined;
        }
        if (typeof data === 'string') {
            return data;
        }
        if (this.contentType?.startsWith(ContentTypeApplicationJson)) {
            return JSON.stringify(data);
        }
        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                if (typeof value === 'object') {
                    if (value.hasOwnProperty('name')) {
                        const { name, type, content, } = value;
                        const file = new File([...content], name, {
                            type
                        });
                        formData.append(key, file);
                    }
                    else {
                        throw new Error(`Invalid form value: ${JSON.stringify(value)}`);
                    }
                }
                else {
                    formData.append(key, value);
                }
            }
        }
        return formData;
    }
    async processResponse(response) {
        if (this.onResponse) {
            this.onResponse(response);
        }
        if (response.status > 299) {
            const error = {
                status: response.status,
                statusText: response.statusText,
                payload: await this.parseContent(response)
            };
            this.handleError(error);
            return;
        }
        const data = {
            headers: response.headers,
            payload: await this.parseContent(response)
        };
        if (this.onData !== undefined) {
            this.onData(data);
        }
        return data;
    }
    async parseContent(response) {
        let contentType = response.headers.get('content-type');
        const content = await response.text();
        if (contentType !== null) {
            contentType = contentType.split(';')[0].trim();
            switch (contentType) {
                case 'application/json': return JSON.parse(content);
                case 'application/xml': {
                    const document = (new window.DOMParser()).parseFromString(content, "text/xml");
                    return deserializeXmlDocument(document);
                }
                default: return content;
            }
        }
        else {
            return content;
        }
    }
    handleError(error) {
        if (this.onError !== undefined) {
            this.onError(error);
        }
        else {
            throw error;
        }
    }
}

class ServerFieldValidator extends SingleValueFieldValidator {
    url;
    constructor(options = {}) {
        super('{{label}} is invalid', options);
        const { url } = options;
        if (url === undefined) {
            throw new Error('url is required');
        }
        this.url = url;
    }
    async validate(context) {
        const { field, label, value } = context;
        const { form } = field;
        form.loading = true;
        const fetcher = new Fetcher({
            onData: data => this.handleValidationData(context, data),
            onError: error => this.handleError(field, error)
        });
        fetcher.contentType = ContentTypeTextPlain;
        await fetcher.fetch({
            url: this.url,
            method: 'POST',
            data: value
        });
        const valid = context.errors.length === 0;
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
    handleValidationData(context, data) {
        context.field.form.loading = false;
        context.field.parentElement.errors = (data.payload || data);
    }
    handleError(field, error) {
        field.form.loading = false;
        notifyError(field, error);
    }
}

function createValidator(cfg) {
    const { type, options } = cfg;
    switch (type) {
        case 'required': return new RequiredValidator(options);
        case 'max-length': return new MaxLengthValidator(options);
        case 'email': return new EmailValidator(options);
        case 'compare': return new CompareValidator(options);
        case 'server': return new ServerFieldValidator(options);
        default: throw new Error(`createValidator is not implemented for validator of type: '${type}'`);
    }
}

const validationEvent = 'validationEvent';
function Validatable(Base) {
    return class ValidatableMixin extends Base {
        static get properties() {
            return {
                validators: {
                    type: [
                        DataTypes.Function,
                        DataTypes.Array
                    ],
                    value: [],
                    beforeSet: function (value) {
                        return this.initializeValidators(value);
                    }
                }
            };
        }
        validate() {
            if (this.validators.length === 0) {
                return true;
            }
            const context = this.createValidationContext();
            this.validators.forEach((validator) => validator.validate(context));
            const { warnings, errors } = context;
            this.dispatchCustomEvent(validationEvent, {
                warnings,
                errors
            });
            return errors.length === 0;
        }
        initializeValidators(validators) {
            for (let i = 0; i < validators.length; ++i) {
                const validator = validators[i];
                if (validator.validate === undefined) {
                    validators[i] = createValidator(validator);
                }
            }
            return validators;
        }
    };
}

const changeEvent = "changeEvent";
const fieldAddedEvent = "fieldAddedEvent";
function getNewValue(input) {
    switch (input.type) {
        case 'checkbox': return input.checked;
        case 'date': return new Date(input.value);
        case 'file':
            {
                const { files } = input;
                if (files === null ||
                    files.length === 0) {
                    return null;
                }
                if (input.multiple === true) {
                    return Array.from(files).map(f => {
                        return {
                            name: f.name,
                            type: f.type,
                            size: f.size,
                            content: URL.createObjectURL(f)
                        };
                    });
                }
                else {
                    const f = files[0];
                    return {
                        name: f.name,
                        type: f.type,
                        size: f.size,
                        content: URL.createObjectURL(f)
                    };
                }
            }
        default: return input.value;
    }
}
class Field extends Validatable(CustomElement) {
    static dataFieldType = DataTypes.String;
    _tempValue;
    isField = true;
    static get properties() {
        return {
            name: {
                type: DataTypes.String,
                required: true
            },
            value: {
                type: [
                    DataTypes.String,
                    DataTypes.Object
                ],
                beforeSet: function (value) {
                    if (this.beforeValueSet !== undefined) {
                        return this.beforeValueSet(value);
                    }
                    return value;
                },
                afterChange: function (value, oldValue) {
                    this.onValueChanged?.(value, oldValue);
                },
                reflect: true
            },
            required: {
                type: DataTypes.Boolean,
                inherit: true,
                reflect: true
            }
        };
    }
    attributeChangedCallback(attributeName, oldValue, newValue) {
        super.attributeChangedCallback?.(attributeName, oldValue, newValue);
        if (attributeName === 'required') {
            if (newValue !== "false") {
                if (!this.hasRequiredValidator()) {
                    const { validators = [] } = this;
                    this.validators = [...validators, new RequiredValidator()];
                }
            }
            else {
                if (this.hasRequiredValidator()) {
                    const { validators } = this;
                    const requiredValidator = validators.filter((v) => v instanceof RequiredValidator)[0];
                    if (requiredValidator !== undefined) {
                        const index = validators.indexOf(requiredValidator);
                        validators.splice(index, 1);
                        this.validators = validators;
                    }
                }
            }
        }
        super.attributeChangedCallback(attributeName, oldValue, newValue);
    }
    hasRequiredValidator() {
        return this.validators.filter((v) => v instanceof RequiredValidator).length > 0;
    }
    didAdoptChildCallback(parent, child) {
        super.didAdoptChildCallback?.(parent, child);
        if (child !== this) {
            return;
        }
        this.dispatchCustomEvent(fieldAddedEvent, {
            field: child
        });
    }
    handleBlur() {
    }
    handleInput(event) {
        let v = getNewValue(event.target);
        if (this.beforeValueSet !== undefined) {
            v = this.beforeValueSet(v);
        }
        this._tempValue = v;
        this.validate();
    }
    createValidationContext() {
        const label = this.getLabel();
        const value = this._tempValue ?? this.value;
        return {
            field: this,
            dataProvider: this.form,
            label,
            value,
            warnings: [],
            errors: []
        };
    }
    _label;
    getLabel() {
        if (this._label === undefined) {
            const { adoptingParent } = this;
            const lt = Array.from(adoptingParent.children)
                .filter(c => c.getAttribute('slot') === 'label');
            switch (lt.length) {
                case 0:
                    break;
                case 1:
                    {
                        this._label = lt[0];
                    }
                    break;
                default: throw new Error('Only one element can have the attribute of slot=label in the Field');
            }
        }
        const cachedLabel = this._label;
        if (cachedLabel === undefined) {
            return "This field";
        }
        return cachedLabel.innerHTML;
    }
    handleChange() {
        const oldValue = this.value;
        this.value = this._tempValue;
        this._tempValue;
        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue,
            newValue: this.value
        });
    }
    acceptChanges() {
        this._initialValue = this.value;
    }
}

function Submittable(Base) {
    return class SubmittableMixin extends Base {
        static get properties() {
            return {
                submitUrl: {
                    attribute: 'submit-url',
                    type: DataTypes.String,
                    required: true
                },
                method: {
                    type: [
                        DataTypes.String,
                        DataTypes.Function
                    ],
                    options: ['post', 'put']
                }
            };
        }
        static get state() {
            return {
                submitting: {
                    value: false
                }
            };
        }
        renderSubmitting() {
            const { submitting } = this;
            if (submitting === false) {
                return null;
            }
            return html `<gcs-overlay>
                <gcs-alert kind="info" >...Submitting</gcs-alert>
            </gcs-overlay>`;
        }
        connectedCallback() {
            super.connectedCallback?.();
            this._submitFetcher = new Fetcher({
                onData: data => this.handleSubmitData(data),
                onError: error => this.handleSubmitError(error)
            });
        }
        submit() {
            this.error = undefined;
            this.submitting = true;
            const data = this.getSubmitData();
            this._submitFetcher.fetch({
                url: this.submitUrl,
                method: this.getMethod(data),
                contentType: this.getContentType(),
                data
            });
        }
        getContentType() {
            return ContentTypeApplicationJson;
        }
        getMethod(data) {
            const { method } = this;
            if (method !== undefined) {
                return typeof method === 'function' ?
                    method() :
                    method;
            }
            return data.id !== undefined ? 'PUT' : 'POST';
        }
        async handleSubmitData(data) {
            await this.updateComplete;
            this.submitting = false;
            this.handleSubmitResponse(data);
        }
        async handleSubmitError(error) {
            await this.updateComplete;
            this.submitting = false;
            this.error = error;
            this.renderError();
        }
    };
}

function LoadableHolder(Base) {
    return class LoadableHolderMixin extends Base {
        static get properties() {
            return {
                loadUrl: {
                    attribute: 'load-url',
                    type: DataTypes.String,
                },
                autoLoad: {
                    attribute: 'auto-load',
                    type: DataTypes.Boolean,
                    value: true
                },
                metadataKey: {
                    attribute: 'metadata-key',
                    type: DataTypes.String
                }
            };
        }
        static get state() {
            return {
                loading: {
                    value: false
                },
                metadata: {}
            };
        }
        renderLoading() {
            if (this.loading === false) {
                return null;
            }
            return html `<gcs-overlay>
                <gcs-alert kind="info" >...Loading</gcs-alert>
            </gcs-overlay>`;
        }
        connectedCallback() {
            super.connectedCallback?.();
            if (this.loadUrl === undefined) {
                return;
            }
            this._loadFetcher = new Fetcher({
                onData: data => this.handleLoadData(data),
                onError: error => this.handleLoadError(error)
            });
            if (this.autoLoad === true) {
                setTimeout(() => this.load(), 0);
            }
        }
        load() {
            this.error = undefined;
            this.loading = true;
            this._loadFetcher.fetch({
                url: this.loadUrl
            });
        }
        async handleLoadData(data) {
            await this.updateComplete;
            this.loading = false;
            if (this.metadataKey !== undefined) {
                const header = data.headers.get(this.metadataKey);
                this.metadata = JSON.parse(header);
            }
            this.handleLoadedData(data);
        }
        async handleLoadError(error) {
            await this.updateComplete;
            this.loading = false;
            this.error = error;
            this.renderError();
        }
    };
}

function Errorable(Base) {
    return class ErrorableMixin extends Base {
        static get state() {
            return {
                error: {
                    value: undefined
                }
            };
        }
        renderError() {
            const { error } = this;
            if (error !== undefined) {
                notifyError(this, error);
                this.error = undefined;
            }
        }
    };
}

const formStyles = css `
:host {
    display: block;    
}

form {
    box-sizing: border-box;
    position: relative;
    width: 100%;
}`;

const labelWidth = {
    attribute: 'label-width',
    type: DataTypes.String,
    value: '50%',
    reflect: true,
    inherit: true
};

const labelAlign = {
    attribute: 'label-align',
    type: DataTypes.String,
    value: 'left',
    options: ['left', 'right', 'center', 'justify'],
    reflect: true,
    inherit: true
};

const formConnectedEvent = "formConnectedEvent";
const formDisconnectedEvent = "formDisconnectedEvent";
class Form extends Sizable(Submittable(Validatable(LoadableHolder(Errorable(CustomElement))))) {
    _fields = new Map();
    modifiedFields = new Set();
    constructor() {
        super();
        this.handleFieldAdded = this.handleFieldAdded.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }
    static get styles() {
        return formStyles;
    }
    static get properties() {
        return {
            labelWidth,
            labelAlign,
            hideSubmitButton: {
                attribute: 'hide-submit-button',
                type: DataTypes.Boolean,
                value: false
            }
        };
    }
    render() {
        const { labelWidth, labelAlign } = this;
        return html `<form>
            ${this.renderLoading()}
            ${this.renderSubmitting()}
            ${this.renderError()}
            <slot label-width=${labelWidth} label-align=${labelAlign} key="form-fields"></slot>
            ${this._renderButton()}
        </form>`;
    }
    _renderButton() {
        if (this.hideSubmitButton) {
            return null;
        }
        return html `<gcs-button key="submit-button" kind="primary" variant="contained" click=${() => this.submit()}>
           <gcs-localized-text>Submit</gcs-localized-text>
           <gcs-icon name="box-arrow-right"></gcs-icon>
        </gcs-button>`;
    }
    getSubmitData() {
        return this.getData();
    }
    submit() {
        if (this.modifiedFields.size === 0) {
            this.error = 'This form has not been modified';
            return;
        }
        if (this.validate()) {
            super.submit();
        }
    }
    createValidationContext() {
        return {
            dataProvider: this,
            warnings: [],
            errors: []
        };
    }
    handleLoadedData(data) {
        this.setData((data.payload ?? data), true);
    }
    handleSubmitResponse(data) {
        console.log(JSON.stringify(data));
        const d = data.payload ?? data;
        this.setData(d, true);
    }
    setData(data, acceptChanges = false) {
        console.log(JSON.stringify(data));
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const field = this._fields.get(key);
                if (field !== undefined) {
                    const value = data[key];
                    field.value = value;
                    if (acceptChanges === true) {
                        field.acceptChanges();
                    }
                }
                else {
                    console.warn(`Field of name: '${key}' was not found for data member with same name`);
                }
            }
        }
    }
    getData() {
        const data = {};
        for (const [key, field] of this._fields) {
            const value = field.serializeValue !== undefined ?
                field.serializeValue() :
                field.value;
            if (!isUndefinedOrNull(value)) {
                data[key] = value;
            }
        }
        return data;
    }
    validate() {
        let valid = super.validate();
        this._fields.forEach(field => {
            const v = field.validate();
            if (valid === true) {
                valid = v;
            }
        });
        return valid;
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(fieldAddedEvent, this.handleFieldAdded);
        this.addEventListener(changeEvent, this.handleChange);
        this.dispatchCustomEvent(formConnectedEvent, {
            form: this
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded);
        this.removeEventListener(changeEvent, this.handleChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        this.dispatchCustomEvent(formDisconnectedEvent, {
            form: this
        });
    }
    handleBeforeUnload(evt) {
        evt.preventDefault();
        evt.returnValue = '';
    }
    handleFieldAdded(event) {
        event.stopPropagation();
        const { field } = event.detail;
        field.form = this;
        this._fields.set(field.name, field);
    }
    handleChange(event) {
        event.stopPropagation();
        const { name, newValue } = event.detail;
        console.log('valueChanged: ' + JSON.stringify(event.detail));
        this.setData({
            [name]: newValue
        });
        setTimeout(() => {
            if (this.modifiedFields.size > 0) {
                window.addEventListener('beforeunload', this.handleBeforeUnload);
            }
            else {
                window.removeEventListener('beforeunload', this.handleBeforeUnload);
            }
        });
    }
}
defineCustomElement('gcs-form', Form);

class Wizard extends Errorable(Submittable(CustomElement)) {
    sharedData = {};
    _forms = new Map();
    static get properties() {
        return {
            steps: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
            },
            start: {
                type: DataTypes.Function,
                defer: true
            },
            back: {
                type: DataTypes.Function,
                defer: true
            },
            next: {
                type: DataTypes.Function,
                defer: true
            },
            finish: {
                type: DataTypes.Function,
                defer: true
            },
            done: {
                type: DataTypes.Function,
                defer: true
            }
        };
    }
    static get state() {
        return {
            selectedStep: {
                value: 0
            }
        };
    }
    constructor() {
        super();
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
    }
    render() {
        return html `
${this.renderStep()}
${this.renderButtons()}
`;
    }
    renderStep() {
        let step = this.steps[this.selectedStep];
        if (isClass(step)) {
            step = new step;
        }
        if (step.render !== undefined) {
            return step.render();
        }
        else if (typeof step === 'function') {
            return step();
        }
        else {
            throw new Error('Unexpected step type');
        }
    }
    renderButtons() {
        return html `
<div>
    <gcs-button 
        id="button-back"
        kind="primary" 
        onClick=${this.handleBack}
    >
        <gcs-icon name="arrow-left-square"></gcs-icon>
        <gcs-localized-text>Back</gcs-localized-text>   
    </gcs-button>

    <gcs-button 
        id="button-next"
        kind="primary"
        onClick=${this.handleNext}
    >
        <gcs-localized-text>Next</gcs-localized-text>   
        <gcs-icon name="arrow-right-square"></gcs-icon>
    </gcs-button>

    <gcs-button 
        id="button-finish"
        kind="primary"
        onClick=${this.handleFinish}
    >
        <gcs-localized-text>Finish</gcs-localized-text>   
        <gcs-icon name="box-arrow-right"></gcs-icon>
    </gcs-button>

</div>`;
    }
    handleBack() {
        --this.selectedStep;
        this._hideBackButtonIfNecessary();
        this._hideNextButtonIfNecessary();
        this._hideFinishButtonIfNecessary();
        setTimeout(() => {
            if (this.back === undefined) {
                this._populateFormsFromSharedData();
            }
            else {
                const forms = Array.from(this._forms.values());
                this.back(forms);
            }
        });
    }
    handleNext() {
        if (this.next === undefined) {
            if (this._populateSharedDataFromForms() === false) {
                return;
            }
        }
        else {
            const forms = Array.from(this._forms.values());
            if (this.next(forms) === false) {
                return;
            }
        }
        ++this.selectedStep;
        this._hideBackButtonIfNecessary();
        this._hideNextButtonIfNecessary();
        this._hideFinishButtonIfNecessary();
    }
    handleFinish() {
        if (this.finish === undefined) {
            if (this._populateSharedDataFromForms() === false) {
                return;
            }
            this.submit();
        }
        else {
            const forms = Array.from(this._forms.values());
            this.finish(forms);
        }
    }
    handleSubmitResponse(data) {
        this.done?.(data);
    }
    getSubmitData() {
        return this.sharedData;
    }
    didMountCallback() {
        this._hideBackButtonIfNecessary();
        this._hideNextButtonIfNecessary();
        this._hideFinishButtonIfNecessary();
        this.start?.();
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(formConnectedEvent, this.handleFormConnected);
        this.addEventListener(formDisconnectedEvent, this.handleFormDisconnected);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(formConnectedEvent, this.handleFormConnected);
        this.removeEventListener(formDisconnectedEvent, this.handleFormDisconnected);
    }
    handleFormConnected(event) {
        const { form } = event.detail;
        form.hideSubmitButton = true;
        this._forms.set(form.name, form);
    }
    handleFormDisconnected(event) {
        const { form } = event.detail;
        form.hideSubmitButton = false;
        this._forms.delete(form.name);
    }
    _hideBackButtonIfNecessary() {
        const backButton = this.document.getElementById('button-back');
        backButton.hidden = this.selectedStep <= 0;
    }
    _hideNextButtonIfNecessary() {
        const nextButton = this.document.getElementById('button-next');
        nextButton.hidden = this.selectedStep >= this.steps.length - 1;
    }
    _hideFinishButtonIfNecessary() {
        const finishButton = this.document.getElementById('button-finish');
        finishButton.hidden = this.selectedStep != this.steps.length - 1;
    }
    _populateFormsFromSharedData() {
        this._forms.forEach(f => {
            f.setData(this.sharedData);
        });
    }
    _populateSharedDataFromForms() {
        const forms = Array.from(this._forms.values());
        const results = forms.map(f => {
            if (!f.validate()) {
                return false;
            }
            this.sharedData = { ...this.sharedData, ...f.getData() };
            return true;
        });
        return !results.includes(false);
    }
}
defineCustomElement('gcs-wizard', Wizard);

const navigationLinkStyles = css `
:host {
    display: flex;
    flex-wrap: nowrap;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: all 0.3s ease;
}

:host([active]) {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
	transition: all 0.3s ease;
}

:host([active]:hover) {
    background-color: var(--active-hover-bg-color);
    color: var(--active-hover-text-color);
    transition: all 0.3s ease;
}`;

const linkClickedEvent = 'linkClickedEvent';
class NavigationLink extends Clickable(Nuanced) {
    static get styles() {
        return mergeStyles(super.styles, navigationLinkStyles);
    }
    static get properties() {
        return {
            to: {
                type: DataTypes.String,
                required: true
            },
            active: {
                type: DataTypes.Boolean,
                reflect: true
            }
        };
    }
    handleClick() {
        this.active = true;
        this.dispatchCustomEvent(linkClickedEvent, {
            link: this
        });
    }
}
defineCustomElement('gcs-nav-link', NavigationLink);

const navigationBarStyles = css `
:host {  
    background-color: var(--alt-bg-color);
    display: flex;
    height: 100%;
}

.horizontal {
    display: flex;
    justify-content: space-evenly;   
}

.vertical {    
    flex-basis: 250px;
    flex-shrink: 0;
}`;

const navigationContainerRegistry = {
    _navigationContainers: new Map(),
    add(navigationContainer) {
        const { routerName } = navigationContainer;
        const containers = this._navigationContainers.get(routerName) || new Set();
        containers.add(navigationContainer);
        this._navigationContainers.set(routerName, containers);
    },
    delete(navigationContainer) {
        const { routerName } = navigationContainer;
        const containers = this._navigationContainers.get(routerName) || new Set();
        containers.delete(navigationContainer);
        this._navigationContainers.set(routerName, containers);
    },
    get(routerName) {
        return this._navigationContainers.get(routerName);
    }
};

function NavigationContainer(Base) {
    return class NavigationContainerMixin extends Base {
        static get properties() {
            return {
                routerName: {
                    attribute: 'router-name',
                    type: DataTypes.String,
                    required: true
                },
                links: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Function
                    ]
                }
            };
        }
        static get state() {
            return {
                activeLink: {}
            };
        }
        constructor(...args) {
            super(args);
            this.updateActiveLink = this.updateActiveLink.bind(this);
        }
        connectedCallback() {
            super.connectedCallback?.();
            navigationContainerRegistry.add(this);
            this.addEventListener(linkClickedEvent, this.handleLinkClicked);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            navigationContainerRegistry.delete(this);
            this.removeEventListener(linkClickedEvent, this.handleLinkClicked);
        }
        handleLinkClicked(event) {
            event.stopPropagation();
            const { link, } = event.detail;
            this.updateActiveLink(link);
            const { routerName } = this;
            navigateToRoute(link.to, routerName);
        }
        updateActiveLink(link) {
            if (link !== this.activeLink) {
                if (this.activeLink !== undefined) {
                    this.activeLink.active = false;
                }
                this.activeLink = link;
            }
        }
        setActiveLink(path) {
            if (this.activeLink?.to === path) {
                return;
            }
            if (this.activeLink !== undefined) {
                this.activeLink.active = false;
            }
            this._setActiveLinkRecursively(this.adoptedChildren, path);
        }
        _setActiveLinkRecursively(children, path) {
            children?.forEach(ch => {
                if (ch.to === path) {
                    ch.active = true;
                    this.updateActiveLink(ch);
                }
                else {
                    this._setActiveLinkRecursively(ch.adoptedChildren, path);
                }
            });
        }
    };
}

class NavigationBar extends NavigationContainer(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, navigationBarStyles);
    }
    static get properties() {
        return {
            orientation: {
                type: DataTypes.String,
                options: [
                    'horizontal',
                    'vertical'
                ],
                value: 'horizontal'
            }
        };
    }
    render() {
        const { links } = this;
        if (links !== undefined) {
            return html `
<nav slot="start" class=${this.orientation}>
    ${this.renderLinks()}
</nav>`;
        }
        else {
            return html `<slot></slot>`;
        }
    }
    renderLinks() {
        const { links } = this;
        const linksArray = [];
        for (const [key, route] of Object.entries(links)) {
            linksArray.push({
                ...route,
                path: key
            });
        }
        const processedGroups = new Set();
        const lnks = [];
        const length = linksArray.length;
        for (let i = 0; i < length; ++i) {
            const link = linksArray[i];
            const { group } = link;
            if (group !== undefined) {
                if (processedGroups.has(group)) {
                    continue;
                }
                processedGroups.add(group);
                const groupedLinks = linksArray.filter(r => r.group === group);
                lnks.push(html `
<gcs-panel>
    <gcs-localized-text slot="header">${group.text}</gcs-localized-text>
    ${this.renderGroupedLinks(groupedLinks)}
</gcs-panel>`);
            }
            else {
                lnks.push(this.renderLink(link));
            }
        }
        return lnks;
    }
    renderGroupedLinks(groupedRoutes) {
        return groupedRoutes.map(r => this.renderLink(r, 'body'));
    }
    renderLink(route, slot = null) {
        const { path, text } = route;
        return html `
<gcs-nav-link to=${path} key=${path} slot=${slot}>
    <gcs-localized-text>${text}</gcs-localized-text>
</gcs-nav-link>`;
    }
}
defineCustomElement('gcs-nav-bar', NavigationBar);

const cache = {};
const resourceLoader = {
    async get(path) {
        let content = cache[path];
        if (content !== undefined) {
            return content;
        }
        const response = await fetch(path);
        content = await response.text();
        cache[path] = content;
        return content;
    }
};

function createScriptNode(oldScript, newValue) {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.setAttribute('data-view', newValue);
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    return newScript;
}
class ContentView extends CustomElement {
    static get component() {
        return {
            shadow: false
        };
    }
    static get properties() {
        return {
            source: {
                type: [
                    DataTypes.String,
                    DataTypes.Function
                ],
                defer: true,
                canChange: function () {
                    return true;
                },
                afterChange: async function (value) {
                    const { document: d } = this;
                    while (d.firstChild) {
                        d.firstChild.remove();
                    }
                    if (typeof value !== 'string') {
                        const newPatchingData = value.render !== undefined ?
                            await value.render() :
                            value;
                        this.mountDom(d, newPatchingData);
                        return;
                    }
                    const content = await resourceLoader.get(value);
                    const parser = new DOMParser();
                    const { head, body } = parser.parseFromString(content, "text/html");
                    document.head.querySelectorAll('[data-view]').forEach(script => script.remove());
                    document.body.querySelectorAll('[data-view]').forEach(script => script.remove());
                    Array.from(head.children).forEach(child => {
                        if (child.tagName === 'SCRIPT') {
                            const newScript = createScriptNode(child, value);
                            document.head.appendChild(newScript);
                        }
                    });
                    Array.from(body.childNodes).forEach(node => {
                        if (node.tagName === 'SCRIPT') {
                            const newScript = createScriptNode(node, value);
                            document.body.appendChild(newScript);
                        }
                        else {
                            d.appendChild(node);
                        }
                    });
                }
            }
        };
    }
}
defineCustomElement('gcs-content-view', ContentView);

function renderTip(kind, trigger, text = '') {
    return html `<gcs-tool-tip>
        <gcs-pill kind=${kind} slot="trigger">${trigger}</gcs-pill>
        <gcs-localized-text slot="content">${text}</gcs-localized-text>
    </gcs-tool-tip>`;
}

class HelpTip extends Sizable(CustomElement) {
    render() {
        const textNode = getContentTextNode(this);
        const content = textNode?.textContent || 'Help content not set';
        return renderTip('secondary', '?', content);
    }
}
defineCustomElement('gcs-help-tip', HelpTip);

class ModifiedTip extends Sizable(CustomElement) {
    render() {
        const textNode = getContentTextNode(this);
        const content = textNode?.textContent || 'This field has been modified';
        return renderTip('primary', 'M', content);
    }
}
defineCustomElement('gcs-modified-tip', ModifiedTip);

class RequiredTip extends Sizable(CustomElement) {
    render() {
        const textNode = getContentTextNode(this);
        const content = textNode?.textContent || 'This field is required';
        return renderTip('danger', '*', content);
    }
}
defineCustomElement('gcs-required-tip', RequiredTip);

const centerStyles = css `
:host {
  display: grid;
  place-items: center;
  height: 100%;
}`;

class Center extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, centerStyles);
    }
}
defineCustomElement('gcs-center', Center);

const overlayStyles = css `
:host {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: var(--gcs-overlay-background-color);
    transition: 0.3s;
    /* center */
    display: flex;
    align-items: center;
    justify-content: center;
}`;

class Overlay extends CustomElement {
    static get styles() {
        return overlayStyles;
    }
}
defineCustomElement('gcs-overlay', Overlay);

const panelStyles = css `
:host {
    display: grid;
    grid-template-rows: auto 1fr auto;
}

#header,
#footer {
    background-color: var(--header-bg-color);
    color: var(--header-text-color);
}`;

class Panel extends Sizable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, panelStyles);
    }
    render() {
        return html `
            <div id=header>
                <slot name="header"></slot>
            </div>
            <div id=body>
                <slot name="body"></slot>
            </div>
            <div id=footer>
                <slot name="footer"></slot>
            </div>
        `;
    }
}
defineCustomElement('gcs-panel', Panel);

class Loader extends LoadableHolder(Errorable(CustomElement)) {
    static get properties() {
        return {
            dataField: {
                attribute: 'data-field',
                type: DataTypes.String,
                value: 'data'
            }
        };
    }
    render() {
        return html `
<div style="position: relative;">
    ${this.renderLoading()}
    <slot id="data-holder"></slot>
</div>`;
    }
    didMountCallback() {
        this.dataHolder = this.document.getElementById('data-holder')
            .assignedElements({ flatten: false })[0];
        this.dataHolder.loader = this;
        super.didMountCallback?.();
    }
    handleLoadedData(data) {
        this.dataHolder[this.dataField] = data.payload || data;
    }
}
defineCustomElement('gcs-loader', Loader);

const sorterChanged = 'sorterChanged';
class SorterTool extends Tool {
    static get properties() {
        return {
            column: {
                type: DataTypes.String,
                required: true
            }
        };
    }
    static get state() {
        return {
            ascending: {
                value: undefined
            }
        };
    }
    iconName = () => {
        const { ascending } = this;
        if (ascending === undefined) {
            return 'arrow-down-up';
        }
        return ascending === true ?
            'arrow-up' :
            'arrow-down';
    };
    handleClick() {
        this.ascending = !this.ascending;
        this.dispatchCustomEvent(sorterChanged, {
            column: this.column,
            ascending: this.ascending,
            element: this
        });
    }
}
defineCustomElement('gcs-sorter-tool', SorterTool);

const displayableFieldStyles = css `

input, 
select,
textarea {
    flex: 1 0 0px;
    outline: none;
    border-style: solid;
    border-color: #d0d0d0;
}

textarea,
select {
    min-width: 200px;
    font-family: inherit;
}

input[type='date'] {
    font-family: inherit;
}

input:focus,
textarea:focus,
select:focus {
    border-style: solid;
    border-color: var(--header-bg-color)
}`;

const inputEvent = "inputEvent";
class DisplayableField extends Disableable(Sizable(Field)) {
    _initialValue = null;
    static get styles() {
        return mergeStyles(super.styles, displayableFieldStyles);
    }
    static get properties() {
        return {
            inputStyle: {
                attribute: 'input-style',
                type: DataTypes.String
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        this._initialValue = this.value;
    }
    handleInput(event) {
        if (event !== undefined) {
            super.handleInput(event);
        }
        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: !areEquivalent(this._initialValue, this._tempValue)
        });
    }
}

function SelectionContainer(Base) {
    return class SelectionContainerMixin extends Base {
        isSelectionContainer = true;
        static get properties() {
            return {
                selectable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true,
                },
                multiple: {
                    type: DataTypes.Boolean,
                    reflect: true,
                    value: false
                },
                idField: {
                    attribute: 'id-field',
                    type: DataTypes.String,
                    value: 'id'
                },
                selection: {
                    type: DataTypes.Array,
                    value: [],
                    reflect: true
                },
                selectionChanged: {
                    attribute: 'selection-changed',
                    type: DataTypes.Function,
                    defer: true
                }
            };
        }
        static get state() {
            return {
                selectedChildren: {
                    value: []
                }
            };
        }
        constructor(...args) {
            super(args);
            this.updateSelection = this.updateSelection.bind(this);
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.addEventListener(selectionChangedEvent, this.updateSelection);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.removeEventListener(selectionChangedEvent, this.updateSelection);
        }
        updateSelection(event) {
            event.stopPropagation();
            const { selectable, multiple, selection, selectionChanged, idField } = this;
            if (selectable !== true) {
                return;
            }
            const { element, selected, value } = event.detail;
            if (multiple === true) {
                if (selected === true) {
                    this.selection = [...selection, value];
                    this.selectedChildren.push(element);
                }
                else {
                    if (idField !== undefined) {
                        this.selection = selection.filter((record) => record[idField] !== value[idField]);
                    }
                    else {
                        this.selection = selection.filter((record) => record !== value);
                    }
                    this.selectedChildren = this.selectedChildren.filter((el) => el !== element);
                }
            }
            else {
                const selectedChild = this.selectedChildren[0];
                if (selectedChild !== undefined) {
                    selectedChild.selected = false;
                }
                if (selected === true) {
                    this.selection = [value];
                    this.selectedChildren = [element];
                }
                else {
                    this.selectedChildren = [];
                }
            }
            if (selectionChanged !== undefined) {
                selectionChanged(this.selection, this.selectedChildren);
            }
        }
        deselectById(id) {
            const { selectedChildren, idField } = this;
            const selectedChild = selectedChildren.filter((el) => el.selectValue[idField] === id)[0];
            selectedChild.setSelected(false);
        }
        selectByValue(value) {
            const selectors = (this?.shadowRoot).querySelectorAll('gcs-selector');
            const selector = Array.from(selectors).filter(c => c.selectValue[this.idField] === value)[0];
            selector.setSelected(true);
        }
    };
}

function compareValues(v1, v2) {
    if (v1 instanceof Date && v2 instanceof Date) {
        return v1.getTime() - v2.getTime();
    }
    if (!isPrimitive(v1) || !isPrimitive(v2)) {
        throw new Error('compareValues - Both values being compared must be either Date or primitives');
    }
    const v1Type = typeof v1;
    const v2Type = typeof v2;
    if (v1Type !== v2Type) {
        throw new Error('compareValues - Both values must be of the same type');
    }
    if (v1Type === 'boolean') {
        return (v1 ? 1 : 0) - (v2 ? 1 : 0);
    }
    if (v1Type === 'number' ||
        v1Type === 'bigint') {
        return v1 - v2;
    }
    return v1.localeCompare(v2);
}

function DataCollectionHolder(Base) {
    return class DataCollectionHolderMixin extends Base {
        _lastSorter;
        static get properties() {
            return {
                data: {
                    type: [
                        DataTypes.Array,
                        DataTypes.Function
                    ],
                    value: [],
                }
            };
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.addEventListener(sorterChanged, this.sort);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.removeEventListener(sorterChanged, this.sort);
        }
        sort(event) {
            const { field, ascending, element } = event.detail;
            if (this._lastSorter !== element) {
                if (this._lastSorter !== undefined) {
                    this._lastSorter.ascending = undefined;
                }
                this._lastSorter = element;
            }
            if (this.loader !== undefined) {
                throw new Error('Not implemented');
            }
            else {
                const comparer = (r1, r2) => {
                    if (ascending === true) {
                        return compareValues(r1[field], r2[field]);
                    }
                    else {
                        return compareValues(r2[field], r1[field]);
                    }
                };
                this.data = [...this.data].sort(comparer);
            }
        }
    };
}

class ComboBox extends SelectionContainer(DataCollectionHolder(DisplayableField)) {
    static get properties() {
        return {
            displayField: {
                attribute: 'display-field',
                type: DataTypes.String,
                value: 'text'
            },
            itemTemplate: {
                attribute: 'item-template',
                type: DataTypes.Function,
                defer: true
            },
            headerTemplate: {
                attribute: 'header-template',
                type: DataTypes.Function,
                defer: true
            },
            selectTemplate: {
                attribute: 'select-template',
                type: DataTypes.Function,
                defer: true
            },
            singleSelectionTemplate: {
                attribute: 'single-selection-template',
                type: DataTypes.Function,
                defer: true
            },
            multipleSelectionTemplate: {
                attribute: 'multiple-selection-template',
                type: DataTypes.Function,
                defer: true
            }
        };
    }
    constructor() {
        super();
        this.renderItem = this.renderItem.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }
    render() {
        return html `<gcs-drop-down>
            ${this.renderHeader()}
            ${this.renderContent()}
        </gcs-drop-down>`;
    }
    renderHeader() {
        const { selection, multiple } = this;
        if (selection.length === 0) {
            return this.renderSelectTemplate();
        }
        else {
            if (multiple === true) {
                return this.renderMultipleSelectionTemplate(selection);
            }
            else {
                return this.renderSingleSelectionTemplate(selection[0]);
            }
        }
    }
    renderItem(record) {
        const { itemTemplate, displayField } = this;
        const display = itemTemplate !== undefined ?
            itemTemplate(record) :
            record[displayField];
        return html `<gcs-selector select-value=${record}>${display}</gcs-selector>`;
    }
    onSelectionChanged(selection, selectedChildren) {
        this.oldSelection = this.selection;
        this.selection = selection;
        this._tempValue = this.unwrapValue(selection);
        this.handleInput();
        this.handleChange();
        this.selectedChildren = selectedChildren;
        this.selectionChanged?.(selection, selectedChildren);
    }
    handleChange() {
        this.value = this._tempValue;
        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue: this.oldSelection,
            newValue: this.selection
        });
    }
    renderContent() {
        const { data, renderItem, multiple, idField, onSelectionChanged } = this;
        if (data?.length > 0) {
            return html `
<gcs-data-list 
    slot="content" 
    data=${data} 
    item-template=${renderItem} 
    initialized=${dataList => this.content = dataList}
    multiple=${multiple}
    id-field=${idField} 
    selection-changed=${onSelectionChanged}>
</gcs-data-list>`;
        }
        else {
            this.content = null;
            return html `
<gcs-alert 
    slot="content"
    kind="warning">
    <gcs-localized-text>No Data Available</gcs-localized-text>
</gcs-alert>`;
        }
    }
    renderSelectTemplate() {
        const { selectTemplate } = this;
        if (selectTemplate !== undefined) {
            return selectTemplate();
        }
        else {
            return html `<gcs-localized-text slot="header">Please select</gcs-localized-text>`;
        }
    }
    renderSingleSelectionTemplate(selection) {
        const { singleSelectionTemplate, displayField } = this;
        if (singleSelectionTemplate !== undefined) {
            return singleSelectionTemplate(selection);
        }
        else {
            const value = isPrimitive(selection) ?
                selection :
                selection[displayField];
            return html `<span slot="header">${value}</span>`;
        }
    }
    renderMultipleSelectionTemplate(selection) {
        const { multipleSelectionTemplate, idField, displayField } = this;
        if (multipleSelectionTemplate !== undefined) {
            return multipleSelectionTemplate(selection, this.deselectById);
        }
        else {
            const data = selection.map((item) => {
                return {
                    [idField]: item[idField],
                    [displayField]: item[displayField]
                };
            });
            const itemTemplate = (record) => html `
<gcs-pill kind="primary" variant="contained">
    ${record[displayField]}
    <gcs-close-tool close=${() => this.deselectById(record[idField])}></gcs-close-tool>
</gcs-pill>`;
            return html `
<gcs-data-list
    slot="header" 
    style="display: flex; flex-wrap: wrap; max-width: 500px; border: solid 1px black;" 
    data=${data} 
    item-template=${itemTemplate}>
</gcs-data-list>`;
        }
    }
    beforeValueSet(value) {
        return this.unwrapValue(value);
    }
    onValueChanged(value, oldValue) {
        super.onValueChanged?.(value, oldValue);
        value = this.unwrapValue(value);
        this.content.selectByValue(value);
    }
    unwrapValue(value) {
        if (Array.isArray(value)) {
            if (this.multiple === true) {
                return value.map(v => this.unwrapSingleValue(v));
            }
            else {
                value = value[0];
                return this.unwrapSingleValue(value);
            }
        }
        else {
            return this.unwrapSingleValue(value);
        }
    }
    unwrapSingleValue(value) {
        if (typeof value === 'object') {
            value = value[this.idField];
        }
        return value;
    }
}
defineCustomElement('gcs-combo-box', ComboBox);

function formatDate(value) {
    return value.toLocaleDateString();
}
class DateField extends DisplayableField {
    static getFieldType() {
        return DataTypes.Date;
    }
    render() {
        const { name, value, disabled } = this;
        return html `<input
            type="text"
            name=${name}
            value=${value !== undefined ? formatDate(value) : undefined}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
    beforeValueSet(value) {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        return date;
    }
    serializeValue() {
        const { value } = this;
        if (isUndefinedOrNull(value)) {
            return null;
        }
        return value.toISOString();
    }
}
defineCustomElement('gcs-date-field', DateField);

function formatSize(fileSize) {
    if (fileSize < 1024) {
        return fileSize + 'bytes';
    }
    else if (fileSize >= 1024 && fileSize < 1048576) {
        return (fileSize / 1024).toFixed(1) + 'KB';
    }
    else if (fileSize >= 1048576) {
        return (fileSize / 1048576).toFixed(1) + 'MB';
    }
    throw new Error(`Not implemented for file size: ${fileSize}`);
}
class FileField extends DisplayableField {
    static get properties() {
        return {
            accept: {
                type: DataTypes.String
            },
            capture: {
                type: DataTypes.Boolean,
                value: true
            },
            multiple: {
                type: DataTypes.Boolean
            },
            preview: {
                type: DataTypes.Boolean
            }
        };
    }
    render() {
        const { name, accept, capture, multiple, disabled, } = this;
        return html `
<input
    style="opacity: 0; position: absolute;"
    type="file"
    name=${name}
    id=${name}
    accept=${accept}
    capture=${capture}
    multiple=${multiple}
    disabled=${disabled}
    onInput=${event => this.handleInput(event)}
    onChange=${event => this.handleChange(event)}
    onBlur=${() => this.handleBlur()}
/>

${this.renderFileList()}

<gcs-button kind="secondary" variant="contained" click=${() => this.openFileDialog()}>
    <gcs-icon name="upload"></gcs-icon>
    <gcs-localized-text>Click here to upload files</gcs-localized-text>
</gcs-button>`;
    }
    openFileDialog() {
        const { name } = this;
        this.document.getElementById(name)?.click();
    }
    renderFileList() {
        const { preview, value, } = this;
        if (preview === false) {
            return null;
        }
        if (value === undefined) {
            return null;
        }
        const data = Array.isArray(value) ? value : [value];
        return data.map(record => {
            const { name, content, size } = record;
            const src = content.indexOf('blob:') === -1 ?
                `data:image/jpeg;base64,${content}` :
                content;
            return html `
<img slot="start" style="width: 48px; height: 48px;" src=${src} />
<span slot="middle">${name}</span>
<span slot="end">${formatSize(size)}</span>`;
        });
    }
}
defineCustomElement('gcs-file-field', FileField);

class HiddenField extends Field {
    render() {
        const { name, value, } = this;
        return html `<input
            type="hidden"
            name=${name}
            value=${value}
        />`;
    }
}
defineCustomElement('gcs-hidden-field', HiddenField);

class TextField extends DisplayableField {
    render() {
        const { name, value, inputStyle, disabled } = this;
        return html `<input
            type="text"
            name=${name}
            value=${value}
            style=${inputStyle}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
}
defineCustomElement('gcs-text-field', TextField);

class TextArea extends DisplayableField {
    render() {
        const { name, inputStyle, disabled } = this;
        return html `<textarea
            name=${name}
            style=${inputStyle}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        ></textarea>`;
    }
}
defineCustomElement('gcs-text-area', TextArea);

class NumberField extends DisplayableField {
    render() {
        const { name, value, inputStyle, disabled } = this;
        return html `<input
            type="number"
            name=${name}
            value=${value}
            style=${inputStyle}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
}
defineCustomElement('gcs-number-field', NumberField);

class CheckBox extends DisplayableField {
    value = false;
    static getFieldType() {
        return DataTypes.Boolean;
    }
    render() {
        const { name, value, disabled } = this;
        return html `<input
            type="checkbox"
            name=${name}
            value=${value}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
}
defineCustomElement('gcs-check-box', CheckBox);

const sliderStyles = css `

gcs-slider {
    display: inline-block;
    position: relative;
    border-radius: 3px;
    height: 50px;
    width: 500px;
    background-image: linear-gradient(45deg, #ccc 25%,
        transparent 25%),linear-gradient(-45deg, #ccc 25%,
        transparent 25%),linear-gradient(45deg, transparent 75%,
        #ccc 75%),linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}

.bg-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 3px;
    background: linear-gradient(to right, #ff0000 0%, #ff000000 100%);
}

.thumb {
    margin-top: -1px;
    left: 5px;
    width: 5px;
    height: calc(100% - 5px);
    position: absolute;
    border-style: solid;
    border-width: 3px;
    border-color: white;
    border-radius: 3px;
    pointer-events: none;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                0 6px 20px 0 rgba(0, 0, 0, 0.19);

}`;

class Slider extends DisplayableField {
    static get styles() {
        return sliderStyles;
    }
    static get properties() {
        return {
            value: {
                type: DataTypes.Number,
                value: 0,
                reflect: true,
                afterUpdate: function () {
                    this.refreshSlider(this.value);
                }
            }
        };
    }
    render() {
        return html `
            <div class="bg-overlay"></div>
            <div class="thumb"></div>
        `;
    }
    refreshSlider(value) {
        const thumb = this.querySelector('.thumb');
        if (thumb !== null) {
            thumb.style.left = (value / 100 * this.offsetWidth - thumb.offsetWidth / 2) + 'px';
        }
    }
    connectedCallback() {
        super.connectedCallback?.();
        document.addEventListener('mousemove', e => this.eventHandler(e));
        document.addEventListener('mouseup', e => this.eventHandler(e));
        this.addEventListener('mousedown', e => this.eventHandler(e));
    }
    updateX(x) {
        let hPos = x - this.querySelector('.thumb')?.offsetWidth / 2;
        if (hPos > this.offsetWidth) {
            hPos = this.offsetWidth;
        }
        if (hPos < 0) {
            hPos = 0;
        }
        this.value = (hPos / this.offsetWidth) * 100;
    }
    eventHandler(e) {
        const bounds = this.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        switch (e.type) {
            case 'mousedown':
                {
                    this.isDragging = true;
                    this.updateX(x);
                    this.refreshSlider(this.value);
                }
                break;
            case 'mouseup':
                {
                    this.isDragging = false;
                }
                break;
            case 'mousemove':
                {
                    if (this.isDragging) {
                        this.updateX(x);
                        this.refreshSlider(this.value);
                    }
                }
                break;
        }
    }
}
defineCustomElement('gcs-slider', Slider);

const getStarStyle = (selected) => selected == true ?
    'color: yellow;' :
    'color: lightgray;';
class StarRating extends SelectionContainer(DisplayableField) {
    static get properties() {
        return {
            max: {
                type: DataTypes.Number,
                value: 5,
                reflect: true
            }
        };
    }
    render() {
        const { max, value } = this;
        const stars = [];
        for (let i = 0; i < max; ++i) {
            const selected = i < value;
            stars.push(html `
<gcs-selector key=${i} select-value=${i + 1} selected=${selected}>
    <gcs-icon name="star-fill" style=${getStarStyle(selected)}></gcs-icon>
</gcs-selector>`);
        }
        return stars;
    }
    selectionChanged = (selection) => {
        this.value = selection[0];
    };
}
defineCustomElement('gcs-star-rating', StarRating);

class PasswordField extends DisplayableField {
    render() {
        const { name, value, inputStyle, disabled } = this;
        return html `<input
            type="password"
            name=${name}
            value=${value}
            style=${inputStyle}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
}
defineCustomElement('gcs-password-field', PasswordField);

const formFieldStyles = css `
:host {
    display: block;
}

#labeled-field {
    display: flex;
    flex-wrap: wrap;
}

#label-container {
    display: grid;
    grid-template-columns: 1fr auto;   
    /* flex-grow: 1; We want to keep the labels with fixed width. not to expand them */
    background-color: var(--alt-bg-color);
    border-radius: var(--gcs-border-radius);
    
}

#label {
    display: flex;
    align-items: center;
    /* background-color: yellow; */
}

/* #tools {
    background-color: lightsalmon;
} */

#field {
    display: flex;
    align-items: center;
    flex-grow: 1;
    /* background-color: lightseagreen; */ 
}`;

class FormField extends Sizable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, formFieldStyles);
    }
    static get properties() {
        return {
            labelAlign,
            labelWidth,
            required: {
                type: DataTypes.Boolean,
                reflect: true,
                value: false
            }
        };
    }
    static get state() {
        return {
            modified: {
                value: false
            },
            warnings: {
                value: []
            },
            errors: {
                value: []
            }
        };
    }
    render() {
        const { labelAlign, labelWidth, required, modified, warnings, errors } = this;
        const labelContainerStyle = css `min-width: 25ch; width: ${labelWidth};`;
        const labelStyle = css `justify-content: ${labelAlign};`;
        return html `
<div id="labeled-field">
    <span id="label-container" style=${labelContainerStyle}>
        <span id="label" style=${labelStyle}>
            <slot name="label"></slot>
        </span> 
        <span id="tools">
            <slot name="tools" id="tools-slot"></slot>
            <slot name="help"></slot>
            ${modified === true ?
            html `<gcs-modified-tip></gcs-modified-tip>`
            : null}
            ${required === true ?
            html `<gcs-required-tip></gcs-required-tip>`
            : null}
        </span>
    </span>
    <span id="field">
        <slot name="field"></slot>         
    </span>
</div>      
<gcs-validation-summary
    warnings=${warnings} 
    errors=${errors}>
</gcs-validation-summary>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(inputEvent, this.handleInput);
        this.addEventListener(validationEvent, this.handleValidation);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(inputEvent, this.handleInput);
        this.removeEventListener(validationEvent, this.handleValidation);
    }
    async handleInput(event) {
        event.stopPropagation();
        await this.updateComplete;
        const { field, modified } = event.detail;
        this.modified = modified;
        const form = this.adoptingParent;
        if (modified === true) {
            form.modifiedFields.add(field);
        }
        else {
            form.modifiedFields.delete(field);
        }
    }
    async handleValidation(event) {
        event.stopPropagation();
        await this.updateComplete;
        const { warnings, errors } = event.detail;
        this.warnings = warnings;
        this.errors = errors;
    }
}
defineCustomElement('gcs-form-field', FormField);

class ValidationSummary extends CustomElement {
    static get properties() {
        return {
            warnings: {
                type: DataTypes.Array,
                value: []
            },
            errors: {
                type: DataTypes.Array,
                value: []
            }
        };
    }
    render() {
        return html `${this.renderWarnings()}
            ${this.renderErrors()}`;
    }
    renderWarnings() {
        const { warnings } = this;
        if (warnings === undefined) {
            return null;
        }
        return warnings.map((warning) => html `<gcs-alert kind="warning">${warning}</gcs-alert>`);
    }
    renderErrors() {
        const { errors } = this;
        if (errors === undefined) {
            return null;
        }
        return errors.map((error) => html `<gcs-alert kind="danger">${error}</gcs-alert>`);
    }
}
defineCustomElement('gcs-validation-summary', ValidationSummary);

const dataListStyles = css `
:host {
    display: grid;
}`;

class DataList extends SelectionContainer(DataCollectionHolder(CustomElement)) {
    static get styles() {
        return mergeStyles(super.styles, dataListStyles);
    }
    static get properties() {
        return {
            itemTemplate: {
                attribute: 'item-template',
                type: DataTypes.Function,
                required: true,
                defer: true
            }
        };
    }
    render() {
        const { idField } = this;
        return this.data.map((record) => {
            return this.itemTemplate(record, record[idField]);
        });
    }
}
defineCustomElement('gcs-data-list', DataList);

const dataCellStyles = css `
:host {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0.5em;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0px;
    white-space: nowrap;
}`;

class DataCell extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataCellStyles);
    }
    static get properties() {
        return {
            column: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function,
                    DataTypes.String
                ],
                required: true
            },
            record: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ],
                required: true
            }
        };
    }
    render() {
        const { column, record } = this;
        const name = typeof column === 'string' ?
            column :
            column.name;
        const value = record[name];
        if (column.render !== undefined) {
            return column.render(value, record, column);
        }
        else {
            return html `${value}`;
        }
    }
}
defineCustomElement('gcs-data-cell', DataCell);

const dataRowStyles = css `
:host {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    line-height: 1.5;
}

:host(:nth-of-type(even)) {
    background-color: var(--alt-bg-color);
}

:host(:nth-of-type(odd)) {
    background-color: var(--bg-color);
}`;

class DataRow extends Selectable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, dataRowStyles);
    }
    static get properties() {
        return {
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            },
            record: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ],
                required: true
            }
        };
    }
    render() {
        const { record, columns } = this;
        return columns.map((column) => html `
    <gcs-data-cell 
        column=${column} 
        record=${record} 
        key=${column.name || column}>
    </gcs-data-cell>`);
    }
}
defineCustomElement('gcs-data-row', DataRow);

function getStyle(props) {
    return Object.keys(props).reduce((acc, key) => (acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + props[key] + ';'), '');
}

const dataHeaderCellStyles = css `
:host {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0.5em;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0px;
    white-space: nowrap;

    white-space: normal;
    justify-content: start;
    font-weight: 700;
}`;

class DataHeaderCell extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataHeaderCellStyles);
    }
    static get properties() {
        return {
            column: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function,
                    DataTypes.String
                ],
                required: true
            }
        };
    }
    render() {
        const { column, } = this;
        if (typeof column === 'string') {
            return html `${column}`;
        }
        else {
            const { name, display } = column;
            if (display !== undefined) {
                if (typeof display === 'function') {
                    return this.renderCellContainer(column, display());
                }
                else {
                    return this.renderCellContainer(column, html `<span>${display}</span>`);
                }
            }
            else {
                return this.renderCellContainer(column, html `<span>${name}</span>`);
            }
        }
    }
    renderCellContainer(column, display) {
        const { headerStyle } = column;
        if (headerStyle !== undefined) {
            const style = typeof headerStyle === 'string' ?
                headerStyle :
                getStyle(headerStyle);
            return html `<span style=${style}>${display}${this.renderSorter()}</span>`;
        }
        else {
            return html `<span>${display}${this.renderSorter()}</span>`;
        }
    }
    renderSorter() {
        const { column } = this;
        if (column.sortable !== true) {
            return null;
        }
        return html `<gcs-sorter-tool column=${column.name}></gcs-sorter-tool>`;
    }
}
defineCustomElement('gcs-data-header-cell', DataHeaderCell);

const dataHeaderStyles = css `
:host {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    line-height: 1.5;
    background-color: var(--header-bg-color);
    color: var(--header-text-color)
}`;

class DataHeader extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataHeaderStyles);
    }
    static get properties() {
        return {
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            }
        };
    }
    render() {
        return this.columns.map((column) => {
            return html `<gcs-data-header-cell column=${column} key=${column.name || column}></gcs-data-header-cell>`;
        });
    }
}
defineCustomElement('gcs-data-header', DataHeader);

const dataGridStyles = css `
:host {
    display: flex;
    flex-flow: column nowrap;
    flex: 1 1 auto;
}`;

class DataGrid extends DataCollectionHolder(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, dataGridStyles);
    }
    static get properties() {
        return {
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            }
        };
    }
    render() {
        return html `
<gcs-panel>
    ${this.renderHeader()}
    ${this.renderBody()}      
</gcs-panel>`;
    }
    renderHeader() {
        return html `
<gcs-data-header
    slot="header"
    columns=${this.columns}>
</gcs-data-header>`;
    }
    renderBody() {
        const { columns, data, idField } = this;
        return data.map((record) => html `
<gcs-data-row 
    slot="body"
    columns=${columns}
    record=${record} 
    key=${record[idField]}>
</gcs-data-row>`);
    }
}
defineCustomElement('gcs-data-grid', DataGrid);

class CollectionPanel extends CustomElement {
    static get properties() {
        return {
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            },
            data: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            },
            idField: {
                attribute: 'id-field',
                type: DataTypes.String,
                value: 'id'
            },
        };
    }
    render() {
        return html `
<gcs-center>
    <gcs-panel>
        ${this.renderToolbar()}
        ${this.renderDataGrid()}  
        ${this.renderInsertDialog()} 
        ${this.renderUpdateDialog()}  
        ${this.renderDeleteDialog()}  
    </gcs-panel>
</gcs-center>
`;
    }
    renderToolbar() {
        return html `
<div slot="header">
    <gcs-button 
        click=${this.showAddForm}
        kind="primary">
        <gcs-icon name="person-add"></gcs-icon>
        <gcs-localized-text>Add</gcs-localized-text>
    </gcs-button>
</div>`;
    }
    renderDataGrid() {
        const me = this;
        let { columns } = this;
        columns = [
            ...columns,
            {
                render: function () {
                    return html `
                <gcs-button 
                    kind="warning" 
                    size="large" 
                    click=${me.showEditForm}
                >
                    Edit
                </gcs-button>`;
                }
            },
            {
                render: function () {
                    return html `
                <gcs-button 
                    kind="danger" 
                    size="large"
                    click=${me.showConfirmDelete}
                >
                    Delete
                </gcs-button>`;
                }
            }
        ];
        return html `
<gcs-data-grid 
    slot="body" 
    id-field=${this.idField}
    columns=${columns} 
    data=${this.data}
>
</gcs-data-grid>`;
    }
    renderInsertDialog() {
        return html `
<gcs-dialog 
    id="add-dialog" 
    slot="body"
>
    Add record
</gcs-dialog>`;
    }
    renderDeleteDialog() {
        return html `
<gcs-dialog 
    id="delete-dialog" 
    slot="body"
>
    Are you sure you want to delete the record?
</gcs-dialog>`;
    }
    renderUpdateDialog() {
        return html `
<gcs-dialog 
    id="update-dialog" 
    slot="body"
>
    Generate a dynamic form or use an existing one
</gcs-dialog>`;
    }
    showAddForm() {
        const element = Array.from(this.adoptingParent.adoptedChildren)[2];
        element.showing = true;
    }
    showEditForm() {
        const element = Array.from(this.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptedChildren)[3];
        element.showing = true;
    }
    showConfirmDelete() {
        const element = Array.from(this.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptingParent.adoptedChildren)[4];
        element.showing = true;
    }
}
defineCustomElement('gcs-collection-panel', CollectionPanel);

function getNotFoundView() {
    return class {
        render() {
            return html `
<h1>404 - Not found</h1>
<p>Sorry :-(</p>`;
        }
    };
}

function getHash(hash, name) {
    const marker = `#${name}`;
    const start = hash.indexOf(marker);
    if (start === -1) {
        return '/';
    }
    hash = hash.substring(start);
    const nextHash = hash.indexOf('#', 1);
    return nextHash == -1 ?
        hash :
        hash.substring(0, nextHash);
}

function getRewrittenHash(originalHash, name, path) {
    const newHash = `#${name}${path}`;
    const hash = getHash(originalHash, name);
    if (hash === '/') {
        return originalHash + newHash;
    }
    else {
        return originalHash.replace(hash, newHash);
    }
}

function getParams(path, hash) {
    const [p, queryParams] = hash.split('?');
    const pathParts = path.split('/');
    const hashParts = p.split('/');
    const params = {};
    const length = pathParts.length;
    for (let i = 0; i < length; ++i) {
        const pathPart = pathParts[i];
        const hashPart = hashParts[i];
        if (pathPart === hashPart) {
            continue;
        }
        params[pathPart.substring(1)] = hashPart;
    }
    if (queryParams) {
        queryParams.split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = value;
        });
    }
    return params;
}
class HashRouter extends CustomElement {
    _lastHash;
    static get properties() {
        return {
            name: {
                type: DataTypes.String,
                required: true
            },
            contentViewId: {
                attribute: 'content-view-id',
                type: DataTypes.String,
                required: true
            },
            routes: {
                type: [
                    DataTypes.Function,
                    DataTypes.Object
                ],
                value: {}
            },
            notFoundView: {
                attribute: 'not-found-view',
                type: [
                    DataTypes.Function,
                    DataTypes.String
                ],
                defer: true,
                value: getNotFoundView
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        addRouter(this.name, this);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        removeRouter(this.name);
    }
    route() {
        this._contentView = this._contentView || componentsRegistry.get(this.contentViewId);
        if (this._contentView === null) {
            throw new Error(`Cannot find content view with id: ${this.contentViewId}`);
        }
        let hash = getHash(window.location.hash, this.name);
        if (hash === this._lastHash) {
            return;
        }
        this._lastHash = hash;
        const marker = `#${this.name}`;
        hash = hash.indexOf(marker) > -1 ?
            hash.substring(marker.length) :
            hash;
        if (hash.length > 1 &&
            hash.endsWith('/')) {
            hash = hash.slice(0, -1);
        }
        if (hash === '') {
            hash = '/';
        }
        const currentRoute = hash.split('?')[0];
        const path = Object.keys(this.routes)
            .find(r => this._routeMatches(currentRoute, r));
        if (path === undefined) {
            this._contentView.source = this._getSource(this.notFoundView, hash, hash);
            return;
        }
        const route = this.routes[path];
        if (route !== undefined) {
            setTimeout(() => {
                this._contentView.source = this._getSource(route.view, path, hash);
            }, 0);
        }
        else {
            this._contentView.source = this._getSource(this.notFoundView, path, hash);
        }
        const navContainers = navigationContainerRegistry.get(this.name);
        navContainers?.forEach(c => c.setActiveLink(path));
    }
    _routeMatches(hash, route) {
        return route === hash;
    }
    _getSource(view, path, hash) {
        const params = getParams(path, hash);
        appCtrl.routeParams = params;
        if (typeof view === 'string') {
            const v = viewsRegistry.get(view);
            if (v === undefined) {
                return view;
            }
            else {
                view = v;
            }
        }
        if (isClass(view)) {
            return new view(params);
        }
        else {
            const v = view(params);
            if (isClass(v)) {
                return new v(params);
            }
            else {
                return v;
            }
        }
    }
    rewriteHash(path) {
        window.location.hash = getRewrittenHash(window.location.hash, this.name, path);
    }
}
defineCustomElement('gcs-hash-router', HashRouter);

const applicationHeaderStyles = css `
:host {
  	display: flex;
}`;

class ApplicationHeader extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, applicationHeaderStyles);
    }
    static get properties() {
        return {
            application: {
                type: DataTypes.Object
            }
        };
    }
    render() {
        const { application } = this;
        if (application === undefined) {
            return html `<slot></slot>`;
        }
        const { type, useThemeSelector } = application;
        return html `
<gcs-nav-bar 
    router-name="app"
>
    <gcs-nav-link to="/" key="/" style="flex-wrap: nowrap;">
        ${this.renderLogo(type.logo)}
        ${this.renderTitle(type.title)}
    </gcs-nav-link>
</gcs-nav-bar>
${this.renderThemeSelector(useThemeSelector)}`;
    }
    renderLogo(logo) {
        return (logo === undefined) ?
            null :
            html `<img src=${logo} style="width: 50px;" />`;
    }
    renderTitle(title) {
        return (title === undefined) ?
            null :
            html `<h1>${title}</h1>`;
    }
    renderThemeSelector(useThemeSelector) {
        return (useThemeSelector !== true) ?
            null :
            html `<gcs-theme-selector></gcs-theme-selector>`;
    }
}
defineCustomElement('gcs-app-header', ApplicationHeader);

const scriptsRegistry = {
    link(script) {
        const newScript = document.createElement("script");
        newScript.setAttribute('app-script', '');
        if (script.type !== null) {
            newScript.setAttribute('type', script.type);
        }
        newScript.setAttribute('src', script.source);
        const promise = new Promise((resolve, reject) => {
            newScript.onload = () => {
                console.log(`Script: ${script.source} has been loaded`);
                resolve(undefined);
            };
            newScript.onerror = () => {
                reject(`Error loading script at ${script.source}`);
            };
        });
        document.head.appendChild(newScript);
        return promise;
    },
    clear() {
        document.head.querySelectorAll('[app-script]').forEach(script => script.remove());
    }
};

const applicationViewStyles = css `
:host {
  	/* Ensure it covers the entire viewport */
  	position: fixed;
  	top: 0;
  	bottom: 0;
  	width: 100%;
  	overflow: hidden;
  	//pointer-events: none; /* The user can click through it */
  	z-index: 1000; /* Above all other elements */
  	transition: background-color 300ms ease-in; /* Background color animation used for the backdrop */
  	/* Holy grail layout */
  	display: grid;
  	grid-template: auto auto 1fr auto / auto 1fr auto;
}

#header,
#subheader,
#footer {
  	grid-column: 1 / 4;
}

#header,
#footer {
  	grid-column: 1 / 4;
	background-color: var(--header-bg-color);
	color: var(--header-text-color);
}

#subheader { 
	background-color: var(--alt-bg-color);
	color: var(--text-color);
}

#left {
	grid-column: 1 / 2;
}

#center {
	grid-column: 2 / 3;
}

#right {
	grid-column: 3 / 4;
}

#left,
#center,
#right {
  	height: 100%; 
  	overflow-y: scroll;
}`;

class ApplicationView extends LoadableHolder(Errorable(CustomElement)) {
    static get styles() {
        return mergeStyles(super.styles, applicationViewStyles);
    }
    static get state() {
        return {
            application: {
                value: null
            }
        };
    }
    render() {
        const application = this.application;
        if (application === null) {
            return html `
<div id="header">
    <slot name="header"></slot>
</div>
<div id="subheader">
    <slot name="subheader"></slot>
</div>
<div id="left">
    <slot name="left"></slot>
</div>
<div id="center" >
    <slot name="center"></slot>
</div>
<div id="right">
    <slot name="right"></slot>
</div>
<div id="footer"> 
    <slot name="footer"></slot>
</div>`;
        }
        const routes = this.getRoutes(application);
        const moduleLinks = this.getModuleLinks(application);
        return html `
<div id="header">
    <gcs-app-header 
        application=${application}>
    </gcs-app-header>
</div>
<div id="subheader">
    Application links go here
</div>
<div id="left">
    <gcs-nav-bar 
        router-name="app"
        orientation="vertical"
        links=${moduleLinks}>
    </gcs-nav-bar>
</div>
<div id="center">
    <gcs-hash-router 
        name="app"
        content-view-id="app-content-view" 
        routes=${routes}>
    </gcs-hash-router>
    <gcs-content-view 
        id="app-content-view" 
        style="height: 100%; overflow-y: scroll;">
    </gcs-content-view>
</div>
<div id="footer"> 
    Copyright GCS &copy;2022
</div>`;
    }
    getRoutes(application) {
        return application.type.routes.reduce((routes, route) => {
            routes[route.path] = {
                view: route.view
            };
            return routes;
        }, {});
    }
    getModuleLinks(application) {
        return application.type.modules.reduce((links, module) => {
            const { name } = module;
            const group = {
                text: name,
                intlKey: name
            };
            application.type.routes
                .filter(route => route.module === name)
                .forEach(route => {
                const { name, path } = route;
                links[path] = {
                    group,
                    text: name,
                    intlKey: name
                };
            });
            return links;
        }, {});
    }
    async handleLoadedData(data) {
        const application = (data.payload || data);
        viewsRegistry.clear();
        scriptsRegistry.clear();
        const promises = [];
        application.type.scripts?.forEach(s => {
            promises.push(scriptsRegistry.link(s));
        });
        application.type.modules?.forEach((m) => {
            m.scripts.forEach(s => {
                promises.push(scriptsRegistry.link(s));
            });
        });
        await Promise.all(promises);
        this.application = application;
    }
}
defineCustomElement('gcs-app-view', ApplicationView);

window.appCtrl = appCtrl;
window.html = html;
window.viewsRegistry = viewsRegistry;

export { Accordion, Alert, AppInitializedEvent, ApplicationHeader, ApplicationView, Button, Center, CheckBox, CloseTool, CollectionPanel, ComboBox, ContentView, CustomElement, DataCell, DataGrid, DataHeader, DataHeaderCell, DataList, DataRow, DataTemplate, DataTypes, DateField, Dialog, DisplayableField, DropDown, ExpanderTool, FileField, Form, FormField, HashRouter, HelpTip, HiddenField, Icon, Loader, LocalizedText, ModifiedTip, NavigationBar, NavigationLink, NumberField, Overlay, Panel, PasswordField, Pill, RequiredTip, Selector, Slider, SorterTool, StarRating, TextArea, TextField, Theme, Tool, ToolTip, ValidationSummary, Wizard, WizardStep, appCtrl, css, defineCustomElement, getNotFoundView, html, navigateToRoute, viewsRegistry };
