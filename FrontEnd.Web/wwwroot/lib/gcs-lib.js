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
            this.adoptingParent = await this._findAdoptingParent();
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
            const slots = this.document.querySelectorAll('slot');
            if (slots.length === 0) {
                const { adoptingParent } = this;
                if (!isUndefinedOrNull(adoptingParent)) {
                    adoptingParent.adoptedChildren.add(this);
                    this.didAdoptChildCallback?.(adoptingParent, this);
                }
                return;
            }
            slots.forEach(slot => {
                const children = slot.assignedNodes();
                if (children.length > 0) {
                    children.forEach((child) => {
                        this.adoptedChildren.add(child);
                        this.parentAdoptedChildCallback?.(child);
                    });
                }
                else {
                    slot.addEventListener('slotchange', this.handleSlotChange);
                }
            });
        }
        async _findAdoptingParent() {
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
        findAdoptingParent(predicate) {
            let parent = this.adoptingParent;
            while (!isUndefinedOrNull(parent)) {
                if (predicate(parent) === true) {
                    return parent;
                }
                parent = parent.adoptingParent;
            }
            return null;
        }
        findAdoptedChild(predicate) {
            const children = Array.from(this.adoptedChildren);
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                if (predicate(child) === true) {
                    return child;
                }
                const grandChild = child?.findAdoptedChild?.(predicate);
                if (grandChild) {
                    return grandChild;
                }
            }
            return null;
        }
        findAdoptedChildById(id) {
            return this.findAdoptedChild(n => n.id === id);
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
            const { options, afterChange } = stateMetadata;
            ensureValueIsInOptions(value, options);
            const oldValue = this._state[key];
            if (oldValue === value) {
                return false;
            }
            this._state[key] = value;
            afterChange?.call(this, value, oldValue);
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

class FunctionCall {
    _fcn;
    _parameters;
    constructor(fcn, parameters) {
        this._fcn = fcn;
        this._parameters = parameters;
    }
    execute() {
        return this._fcn(...this._parameters);
    }
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

function parseValue(value) {
    value = value.trim();
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
    }
    value = value.replace(/\\(.)/g, "$1");
    const numberRegex = /^[+-]?\d+(\.\d+)?$/;
    if (numberRegex.test(value)) {
        return parseFloat(value);
    }
    const lowerCaseValue = value.toLowerCase();
    if (lowerCaseValue === 'true' ||
        lowerCaseValue === 'false') {
        return lowerCaseValue === 'true';
    }
    if (lowerCaseValue === 'null' ||
        lowerCaseValue === 'undefined') {
        return null;
    }
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
        return dateValue;
    }
    try {
        return JSON.parse(value);
    }
    catch (error) {
        return value;
    }
}

function parseFunctionCall(callString) {
    const regex = /(\w+)\((.*)\)/;
    const match = callString.match(regex);
    if (match && match.length === 3) {
        const functionName = match[1];
        const parametersString = match[2].trim();
        const parameters = parametersString.length > 0 ? parametersString.split(',').map(param => parseValue(param.trim())) : [];
        return { functionName, parameters };
    }
    return null;
}

const valueConverter = {
    toProperty: (value, type) => {
        if (isUndefinedOrNull(value)) {
            return null;
        }
        if (!Array.isArray(type)) {
            type = [type];
        }
        if (type.includes(DataTypes.Function)) {
            const functionCallInfo = parseFunctionCall(value);
            if (functionCallInfo !== null) {
                const fcn = getGlobalFunction(functionCallInfo.functionName);
                if (fcn !== undefined) {
                    if (functionCallInfo.parameters.length > 0) {
                        return new FunctionCall(fcn, functionCallInfo.parameters);
                    }
                    else {
                        return fcn;
                    }
                }
            }
        }
        if (type.includes(DataTypes.Number)) {
            const numberRegex = /^[+-]?\d+(\.\d+)?$/;
            if (numberRegex.test(value)) {
                return parseFloat(value);
            }
        }
        if (type.includes(DataTypes.Boolean)) {
            const lowerCaseValue = value.toLowerCase();
            if (lowerCaseValue === 'true' ||
                lowerCaseValue === 'false') {
                return lowerCaseValue === 'true';
            }
        }
        const dateValue = new Date(value);
        if (!isNaN(dateValue.getTime())) {
            return dateValue;
        }
        if (type.includes(DataTypes.Object) ||
            type.includes(DataTypes.Array)) {
            let o;
            try {
                o = JSON.parse(value);
            }
            catch (error) {
                o = window[value];
                if (!o &&
                    !type.includes(DataTypes.String)) {
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
        _setAttribute(attributeName, value) {
            const propertyMetadata = this._getPropertyMetadataByAttributeName(attributeName);
            const { name, type } = propertyMetadata;
            if (typeof value === 'string') {
                value = valueConverter.toProperty(value, type);
            }
            this.setProperty(name, value);
            return true;
        }
        _getPropertyMetadataByAttributeName(attributeName) {
            const propertyMetadata = this.constructor.metadata.propertiesByAttribute.get(attributeName);
            if (propertyMetadata === undefined) {
                throw new Error(`Attribute: '${attributeName}' is not configured for custom element: '${this.constructor.name}'`);
            }
            return propertyMetadata;
        }
        _setProperty(name, value) {
            const propertyMetadata = this.constructor.metadata?.properties?.get(name);
            if (propertyMetadata === undefined) {
                throw new Error(`Property: '${name}' is not configured for custom element: '${this.constructor.name}'`);
            }
            const { attribute, type, reflect, options, beforeSet, canChange, setValue, afterChange, defer } = propertyMetadata;
            if (setValue !== undefined) {
                setValue.call(this, value);
                return true;
            }
            ensureValueIsInOptions(value, options);
            if (value instanceof FunctionCall) {
                const functionCall = value;
                if (defer === true &&
                    !isClass(value)) {
                    value = (() => functionCall.execute()).bind(this);
                }
                else if (!isClass(value)) {
                    value = functionCall.execute();
                }
            }
            else if (typeof value === 'function') {
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
            this._changedProperties.forEach(p => p.afterUpdate?.call(this));
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

function mountNode(p, pd) {
    p.appendChild(createNodes(pd));
}
function mountNodeBefore(p, ch, pd) {
    p.insertBefore(createNodes(pd), ch);
}
function mountNodes(p, pd) {
    const df = document.createDocumentFragment();
    pd.forEach(v => mountNode(df, v));
    p.appendChild(df);
}
function mountNodesBefore(p, ch, pd) {
    const df = document.createDocumentFragment();
    pd.forEach(v => mountNode(df, v));
    p.insertBefore(df, ch);
}

const assert = {
    isTrue(condition, message) {
        if (condition !== true) {
            throw new Error(message);
        }
    },
    areEqual(v1, v2, message) {
        if (v1 !== v2) {
            throw new Error(message);
        }
    }
};

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
function transferPatchingData(oldPatchingData, newPatchingData) {
    if (Array.isArray(newPatchingData)) {
        for (let i = 0; i < newPatchingData.length; ++i) {
            transferData(oldPatchingData[i], newPatchingData[i]);
        }
    }
    else if (isNodePatchingData(newPatchingData)) {
        transferData(oldPatchingData, newPatchingData);
    }
}

addPatcherComparer();
function updateNode(p, oldPd, newPd) {
    if (areEquivalent(oldPd, newPd)) {
        transferPatchingData(oldPd, newPd);
        return;
    }
    const node = oldPd.node;
    assert.isTrue(!isUndefinedOrNull(node), 'There must be an existing node');
    if (Array.isArray(newPd)) {
        node.remove();
        mountNodes(p, newPd);
    }
    else if (isUndefinedOrNull(newPd)) {
        node.remove();
    }
    else if (isPrimitive(newPd)) {
        node.textContent = newPd.toString();
    }
    else {
        const { patcher: oldPatcher, values: oldValues, rules } = oldPd;
        const { patcher, values } = newPd;
        if (oldPatcher === patcher) {
            newPd.rules = rules;
            newPd.node = node;
            if (areEquivalent(oldPd.values, newPd.values)) {
                transferPatchingData(oldPd.values, newPd.values);
                return;
            }
            oldPatcher.patchNode(rules || [], oldValues, values);
            node._$patchingData = newPd;
        }
        else {
            const newNode = createNodes(newPd);
            if (node.data === beginMarker) {
                node.nextSibling.remove();
            }
            p.replaceChild(newNode, node);
        }
    }
}
function updateNodes(p, oldPd, newPd) {
    if (areEquivalent(oldPd, newPd)) {
        transferPatchingData(oldPd, newPd);
        return;
    }
    if (Array.isArray(newPd)) {
        updateArrayNodes(p, oldPd, newPd);
    }
    else if (isPrimitive(newPd)) {
        p.childNodes[p.childNodes.length - 1].textContent = newPd.toString();
    }
    else if (isUndefinedOrNull(newPd)) {
        removeAllNodes(p);
    }
    else {
        removeAllNodes(p);
        mountNode(p, newPd);
    }
}
function updateArrayNodes(p, oldPd, newPd) {
    let { length: oldCount } = oldPd;
    const keyedNodes = new Map();
    for (let i = 0; i < oldCount; ++i) {
        const oldChild = oldPd[i].node;
        const key = oldChild.getAttribute?.('key') || null;
        if (key !== null) {
            keyedNodes.set(key, oldChild);
        }
    }
    const { length: newCount } = newPd;
    for (let i = 0; i < newCount; ++i) {
        const oldChild = i < oldPd.length ?
            oldPd[i].node :
            undefined;
        if (oldChild === undefined) {
            mountNode(p, newPd[i]);
        }
        else {
            const newChildPd = newPd[i];
            const { patcher, values } = newChildPd;
            const { keyIndex } = patcher;
            const valueKey = keyIndex !== undefined ?
                values[keyIndex]?.toString() :
                null;
            const oldChildKey = oldChild.getAttribute?.('key') || null;
            if (oldChildKey === valueKey) {
                updateNode(oldChild, oldPd[i], newChildPd);
                if (i >= p.childNodes.length) {
                    p.appendChild(oldChild);
                }
            }
            else {
                if (keyedNodes.has(valueKey)) {
                    const keyedNode = keyedNodes.get(valueKey);
                    if (areEquivalent(newChildPd.values, keyedNode._$patchingData.values)) {
                        if (i >= p.childNodes.length) {
                            p.appendChild(keyedNode);
                        }
                        else {
                            p.childNodes[i].replaceWith(keyedNode);
                            --oldCount;
                        }
                        newChildPd.node = keyedNode;
                        const { rules, values } = keyedNode._$patchingData;
                        newChildPd.rules = rules;
                        newChildPd.values = values;
                    }
                }
                else {
                    updateNode(oldChild, oldPd[i], newChildPd);
                }
            }
        }
    }
    for (let i = oldCount - 1; i >= newCount; --i) {
        oldPd[i].node.remove();
    }
}
function removeAllNodes(p) {
    while (p.firstChild) {
        p.removeChild(p.firstChild);
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
                let newPd = await this.render();
                if (newPd !== null) {
                    newPd = this.beforeRender(newPd);
                }
                const { document, _oldPatchingData: oldPd } = this;
                if (oldPd === null) {
                    if (newPd !== null) {
                        await this.mountDom(document, newPd);
                    }
                }
                else {
                    if (newPd !== null) {
                        this.willUpdateCallback?.();
                        if (Array.isArray(oldPd)) {
                            updateNodes(document, oldPd, newPd);
                        }
                        else {
                            updateNode(document, oldPd, newPd);
                        }
                        await this._waitForChildrenToUpdate();
                        this.callAfterUpdate();
                    }
                    else {
                        this.willUnmountCallback?.();
                        this.document.replaceChildren();
                        this.stylesAdded = false;
                    }
                }
                this._oldPatchingData = newPd;
            }
            catch (error) {
                console.error(error);
            }
        }
        async mountDom(document, newPatchingData) {
            if (Array.isArray(newPatchingData)) {
                mountNodes(document, newPatchingData);
            }
            else {
                mountNode(document, newPatchingData);
            }
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
                    const { defer, getValue, beforeGet } = propertyMetadata;
                    if (getValue !== undefined) {
                        return getValue.call(this);
                    }
                    const value = this._properties[name];
                    if (!Array.isArray(type)) {
                        type = [type];
                    }
                    if (type.includes(DataTypes.Function) &&
                        typeof value === 'function' &&
                        defer !== true) {
                        return value();
                    }
                    if (beforeGet) {
                        return beforeGet.call(this, value);
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
            const node = rule.node;
            const attributeNames = node.getAttributeNames !== undefined ?
                node.getAttributeNames() :
                undefined;
            const attributesNotSet = new Set(attributeNames);
            switch (rule.type) {
                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        const parentNode = node.parentNode;
                        if (Array.isArray(value)) {
                            mountNodesBefore(parentNode, node, value);
                        }
                        else if (!isUndefinedOrNull(value)) {
                            mountNodeBefore(parentNode, node, value);
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
                default: throw new Error(`firstPatch is not implemented for rule type: ${rule.type}`);
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
                            if (Array.isArray(oldValue)) {
                                patchChildren(node, oldValue, newValue);
                            }
                            else {
                                if (!isUndefinedOrNull(oldValue)) {
                                    removeLeftSibling(node);
                                }
                                mountNodesBefore(node.parentNode, node, newValue);
                            }
                        }
                        else {
                            if (!isUndefinedOrNull(newValue)) {
                                if (isUndefinedOrNull(oldValue)) {
                                    mountNodeBefore(node.parentNode, node, newValue);
                                }
                                else {
                                    if (isNodePatchingData(oldValue) &&
                                        oldValue.patcher === newValue.patcher) {
                                        updateNode(node, oldValue, newValue);
                                    }
                                    else {
                                        if (Array.isArray(oldValue)) {
                                            removeLeftSiblings(node);
                                            mountNodeBefore(node.parentNode, node, newValue);
                                        }
                                        else {
                                            replaceChild(node, newValue, oldValue);
                                        }
                                    }
                                }
                            }
                            else {
                                if (!isUndefinedOrNull(oldValue)) {
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
function patchChildren(markerNode, oldPatchingData = [], newPatchingData = []) {
    oldPatchingData = oldPatchingData || [];
    let { length: oldChildrenCount } = oldPatchingData;
    const keyedNodes = MapKeyedNodes(oldPatchingData);
    const { length: newChildrenCount } = newPatchingData;
    for (let i = 0; i < newChildrenCount; ++i) {
        const newChild = newPatchingData[i];
        const newChildKey = getKey(newChild);
        const oldChild = oldPatchingData[i];
        if (oldChild === undefined) {
            if (keyedNodes.has(newChildKey)) {
                const oldChild = keyedNodes.get(newChildKey);
                updateNode(oldChild?.node, oldChild, newChild);
            }
            else {
                mountNodeBefore(markerNode.parentNode, markerNode, newChild);
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
                    updateNode(oldChild?.node, oldChild, newChild);
                }
            }
            else {
                if (keyedNodes.has(newChildKey)) {
                    const oldKeyedChild = keyedNodes.get(newChildKey);
                    updateNode(oldKeyedChild.node, oldKeyedChild, newChild);
                    replaceChild(markerNode, oldKeyedChild, oldChild);
                }
                else {
                    const existingChild = markerNode.parentNode?.childNodes[i + 1];
                    mountNodeBefore(existingChild.parentNode, existingChild, newChild);
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

const patchersCache = new Map();
function html(strings, ...values) {
    const key = strings.toString();
    if (key.trim() == '') {
        throw new Error('Tempate string cannot be empty. Return null if you do not want to create HTML nodes');
    }
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
        console.log(`Event of type: '${type}' was dispatched by:`);
        console.dir(this);
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

const _zIndexInitial = 1000;
const _zIndexIncrement = 10;
const _elements = [];
const zIndexManager = {
    add(element) {
        const el = _elements[_elements.length - 1];
        if (el) {
            const zIndex = parseInt(el.style.zIndex) + _zIndexIncrement;
            element.style.zIndex = zIndex.toString();
        }
        else {
            element.style.zIndex = _zIndexInitial.toString();
        }
        _elements.push(element);
    },
    remove(element) {
        const el = _elements.pop();
        if (el &&
            el !== element) {
            console.error('Removed element must be the last one');
        }
    }
};

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
        case "Alert":
            {
                console.warn(`Setting default kind styles for element: '${ctor.name}'`);
                kinds.forEach(kind => styles.push(css `
:host([kind='${kind}']) { 
    color: var(${cssVariables.get("color")}${kind}); 
    background-color: var(${cssVariables.get("background-color")}${kind}); 
    border-color: var(${cssVariables.get("color")}${kind}); 
}`));
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

class Nuanced extends Variant(Kind(CustomElement)) {
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
    handleClick(evt) {
        evt.stopPropagation();
        this.close?.();
    }
}
defineCustomElement('gcs-close-tool', CloseTool);

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
                value: false,
                afterChange: function (value, oldValue) {
                    if (isUndefinedOrNull(oldValue)) {
                        return;
                    }
                    if (value === true) {
                        zIndexManager.add(this);
                    }
                    else {
                        zIndexManager.remove(this);
                    }
                }
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
            return html `${content()}`;
        }
        else {
            return html `<slot></slot>`;
        }
    }
}
defineCustomElement('gcs-overlay', Overlay);

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

const successEvent = "successEvent";
function notifySuccess(element, successMessage) {
    element.dispatchCustomEvent(successEvent, {
        successMessage
    });
}

const AppInitializedEvent = "AppInitializedEvent";
class AppCtrl {
    application;
    errorHandler;
    user;
    intlProvider;
    iconsPath;
    overlay = new Overlay();
    apiUrl;
    defaultTheme;
    routeParams;
    async init() {
        console.log('Initializing appCtrl...');
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        const appConfig = window.appConfig;
        if (appConfig !== undefined) {
            const { errorHandler, intl, iconsPath, apiUrl, defaultTheme } = appConfig;
            if (intl !== undefined) {
                const lang = intl.lang || window.document.documentElement.getAttribute('lang') || window.navigator.language;
                this.intlProvider = new IntlProvider(lang, intl.data);
            }
            this.errorHandler = errorHandler;
            this.iconsPath = iconsPath;
            this.apiUrl = apiUrl;
            this.defaultTheme = defaultTheme;
            window.dispatchEvent(new CustomEvent(AppInitializedEvent, {
                bubbles: true,
                composed: true,
            }));
        }
        const themeName = window.localStorage.getItem('app-theme') || appCtrl.defaultTheme;
        this.setTheme(themeName);
        document.body.appendChild(this.overlay);
        document.addEventListener(successEvent, this.handleSuccess);
        document.addEventListener(errorEvent, this.handleError);
        window.addEventListener('hashchange', updateRoutes);
        updateRoutes();
    }
    setTheme(theme) {
        window.document.firstElementChild.setAttribute('theme', theme);
    }
    showDialog(content) {
        const { overlay } = this;
        overlay.content = content;
        overlay.showing = true;
    }
    handleSuccess(evt) {
        const { successMessage, } = evt.detail;
        const content = () => html `<gcs-alert kind="success" close>${successMessage}</gcs-alert>`;
        this.showDialog(content);
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
class Icon extends CustomElement {
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

class LocalizedText extends CustomElement {
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

function Closable(Base) {
    return class ClosableMixin extends Base {
        static get properties() {
            return {
                close: {
                    type: [
                        DataTypes.Function,
                        DataTypes.String
                    ],
                    defer: true
                }
            };
        }
        handleClose() {
            if (typeof this.close === "function") {
                this.close();
            }
            else if (typeof this.close === "string") {
                this.dispatchCustomEvent(closingEvent, {
                    source: this.close
                });
            }
            else {
                throw new Error("Unknown close type in Closable::handleClose");
            }
        }
        renderCloseTool() {
            if (this.close === undefined) {
                return null;
            }
            return html `
<gcs-close-tool
    close=${() => this.handleClose()}
>
</gcs-close-tool>`;
        }
    };
}

const alertStyles = css `
:host {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: inherit;
    border: var(--gcs-border-width) solid;
    border-radius: var(--gcs-border-radius);
    max-width: 90vw;
}

.item {
    margin: var(--gcs-margin);
}

.middle {
    word-wrap: break-word; 
    max-height: 80vh; 
    overflow: auto;
}`;

class Alert extends Closable(Nuanced) {
    static get styles() {
        return mergeStyles(super.styles, alertStyles);
    }
    static get properties() {
        return {
            showIcon: {
                attribute: 'show-icon',
                type: DataTypes.Boolean,
                value: true
            }
        };
    }
    render() {
        return html `
<span class="item">
    ${this._renderIcon()}
</span>
<span class="item middle">
    <slot></slot>
</span>
<span class="item">
    ${this.renderCloseTool()}
</span>
`;
    }
    _renderIcon() {
        const { showIcon, } = this;
        if (showIcon !== true) {
            return html `<span></span>`;
        }
        return html `
<gcs-icon 
    name=${this._getIconName()}
>
</gcs-icon>`;
    }
    _getIconName() {
        switch (this.kind) {
            case "success": return "check-circle-fill";
            case "warning": return "exclamation-circle-fill";
            case "error": return "exclamation-circle-fill";
            default: return "info-circle-fill";
        }
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
    toggleContentVisibility(evt) {
        evt.stopPropagation();
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
    gap: var(--gcs-padding);
    user-select: none;
    cursor: pointer;
    font-size: inherit;
    border-width: var(--gcs-border-width);
    border-radius: var(--gcs-border-radius);
    margin: var(--gcs-margin);
    padding: var(--gcs-padding);
    
    
    /* outline: 0;
      margin-right: 8px;
      margin-bottom: 12px;
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
        return html `
<button disabled=${disabled} onClick=${click}>
    <span>
        <slot></slot>
    </span>  
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
:host {
    position: relative;
    display: inline-block;
}
  
#content {
    position: absolute; 
    visibility: hidden;
    background-color: var(--gcs-tooltip-background-color);
    color: var(--gcs-tooltip-color);
    padding: var(--gcs-padding);
    border-radius: var(--gcs-border-radius);
    opacity: 0;
    transition: opacity 0.3s;
}

/* position */
.top {
    left: 50%;
    bottom: 100%;
    transform: translateX(-50%);
}

.bottom {
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
}

.left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
}

.right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
}

/* arrow */
#content::after {
    content: "";
    position: absolute;
    border-width: 5px;
    border-style: solid;
}

#content.top::after {
    top: 100%; /* At the bottom of the tooltip */  
    left: 50%;
    margin-left: -5px;
    border-color: var(--gcs-tooltip-background-color) transparent transparent transparent;
}

#content.bottom::after {
    bottom: 100%;  /* At the top of the tooltip */
    left: 50%;
    margin-left: -5px; 
    border-color: transparent transparent var(--gcs-tooltip-background-color) transparent;
}

#content.left::after {
    top: 50%;
    left: 100%; /* To the right of the tooltip */
    margin-top: -5px;
    border-color: transparent transparent transparent var(--gcs-tooltip-background-color);
}

#content.right::after {
    top: 50%;
    right: 100%; /* To the left of the tooltip */   
    margin-top: -5px;
    border-color: transparent var(--gcs-tooltip-background-color) transparent transparent;
}
  
/* Show the container text when you mouse over the container container */
:host(:hover) #content {
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
        return html `
<span id="trigger">
    <slot name="trigger"></slot>
</span>       
<span id="content">
    <slot name="content"></slot>
</span>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener('mouseenter', this._positionContent);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener('mouseenter', this._positionContent);
    }
    _positionContent() {
        const { position } = this;
        const content = this.document.getElementById("content");
        let p = position;
        const contentView = this.findAdoptingParent((p) => p.nodeName === "GCS-CONTENT-VIEW");
        const parentViewRect = contentView !== null ?
            contentView.getBoundingClientRect() :
            {
                left: window.screenLeft,
                right: window.innerWidth,
                top: window.screenTop,
                bottom: window.innerHeight
            };
        const rect = content.getBoundingClientRect();
        switch (position) {
            case 'top':
                {
                    if (rect.top < parentViewRect.top) {
                        p = 'bottom';
                    }
                }
                break;
            case 'bottom':
                {
                    if (rect.bottom > parentViewRect.bottom) {
                        p = 'top';
                    }
                }
                break;
            case 'left':
                {
                    if (rect.left < parentViewRect.left) {
                        p = 'right';
                    }
                }
                break;
            case 'right':
                {
                    if (rect.right > parentViewRect.right) {
                        p = 'left';
                    }
                }
                break;
            default: throw new Error(`Unknown position: ${position}`);
        }
        applyClasses(content, {
            'top': p === 'top',
            'bottom': p === 'bottom',
            'left': p === 'left',
            'right': p === 'right',
        });
    }
}
defineCustomElement('gcs-tool-tip', ToolTip);

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

const ContentType = 'Content-Type';
const ContentTypeApplicationJson = 'application/json';
const ContentMultipartFormData = 'multipart/form-data';
const ContentTypeTextPlain = 'text/plain';
class Fetcher {
    onResponse;
    onSuccess;
    onError;
    onData;
    constructor(callbacks) {
        const { onResponse, onSuccess, onError, onData } = callbacks;
        if (onResponse !== undefined) {
            this.onResponse = onResponse.bind(this);
        }
        if (onSuccess !== undefined) {
            this.onSuccess = onSuccess.bind(this);
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
            await this.processResponse(response);
        }
        catch (error) {
            this.handleError(error);
        }
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
        const contentType = requestHeaders[ContentType] || ContentTypeApplicationJson;
        if (contentType === ContentMultipartFormData) {
            delete requestHeaders[ContentType];
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
        const { data, headers } = request;
        if (data === undefined) {
            return undefined;
        }
        if (typeof data === 'string') {
            return data;
        }
        const contentType = headers?.[ContentType];
        if (contentType?.startsWith(ContentTypeApplicationJson)) {
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
        if (response.status !== 204) {
            const data = {
                headers: response.headers,
                payload: await this.parseContent(response)
            };
            if (this.onData !== undefined) {
                this.onData(data);
            }
        }
        if (this.onSuccess !== undefined) {
            this.onSuccess();
        }
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
                case 404: return 'Not Found';
                case 405: return 'Method Not Allowed';
                default: throw new Error(`Not implemented for error status: ${error.status}`);
            }
        }
    }
    throw new Error(`getErrorMessage - Unhandled error: ${error}`);
}

function RemoteLoadableHolder(Base) {
    return class RemoteLoadableHolderMixin extends Base {
        _loadFetcher;
        dataField = 'data';
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
            return html `
<gcs-overlay>
    <gcs-alert kind="info" >
        <gcs-localized-text>...Loading</gcs-localized-text>
    </gcs-alert>
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
                setTimeout(() => this.loadRemote(undefined), 0);
            }
        }
        loadRemote(params) {
            this.loading = true;
            this._loadFetcher?.fetch({
                url: this.loadUrl,
                params
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
        handleLoadedData(data) {
            this[this.dataField] = data.payload || data;
        }
        async handleLoadError(error) {
            await this.updateComplete;
            this.loading = false;
            notifyError(this, error);
        }
    };
}

class DataTemplate extends RemoteLoadableHolder(CustomElement) {
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

const selectionChangedEvent = 'selectionChangedEvent';
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
        handleClick(evt) {
            evt.stopPropagation();
            this.setSelected(!this.selected);
        }
        setSelected(selected) {
            if ((this.selected || false) === selected) {
                return;
            }
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

const _openPopups = [];
function closeOtherPopups(target) {
    let count = _openPopups.length;
    while (count > 0) {
        const popup = _openPopups[count - 1];
        if (popup === target) {
            break;
        }
        const targetChildren = target.adoptedChildren;
        const popupIsChildOfTarget = targetChildren &&
            Array.from(targetChildren)
                .includes(popup);
        if (popupIsChildOfTarget) {
            break;
        }
        popup.hideContent?.();
        --count;
    }
}
const popupManager = {
    add(element) {
        closeOtherPopups(element);
        _openPopups.push(element);
    },
    remove(element) {
        const index = _openPopups.indexOf(element);
        if (index !== -1) {
            _openPopups.splice(index, 1);
        }
    }
};
document.addEventListener('click', event => closeOtherPopups(event.target));

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

const expanderChangedEvent = 'expanderChangedEvent';
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
        this.dispatchCustomEvent(expanderChangedEvent, {
            showing,
            element: this
        });
    }
    handleClick(evt) {
        let { showing } = this;
        evt.stopPropagation();
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
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(expanderChangedEvent, this.handleExpanderChanged);
        this.addEventListener(selectionChangedEvent, this.handleSelectionChanged);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(expanderChangedEvent, this.handleExpanderChanged);
        this.removeEventListener(selectionChangedEvent, this.handleSelectionChanged);
    }
    render() {
        const { showing } = this;
        const contentClasses = getClasses({
            'dropdown-content': true,
            'show': showing
        });
        return html `
<slot id="header" name="header"></slot>
<gcs-expander-tool id="expander-tool"></gcs-expander-tool>
<slot id="content" class=${contentClasses} name="content"></slot>`;
    }
    handleExpanderChanged(evt) {
        evt.stopPropagation();
        const { showing } = evt.detail;
        if (showing === true) {
            popupManager.add(this);
        }
        this.showing = showing;
    }
    handleSelectionChanged(evt) {
        evt.stopPropagation();
        this.hideContent();
        this.showing = false;
    }
    hideContent() {
        const expanderTool = this.document.getElementById('expander-tool');
        expanderTool.hideContent();
        popupManager.remove(this);
    }
}
defineCustomElement('gcs-drop-down', DropDown);

class WizardStep extends CustomElement {
}
defineCustomElement('gcs-wizard-step', WizardStep);

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
                    options: ['POST', 'PUT']
                },
                idField: {
                    attribute: 'id-field',
                    type: DataTypes.String,
                    value: 'id'
                },
                submitSuccess: {
                    attribute: 'submit-success',
                    type: DataTypes.Function,
                    defer: true
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
            return html `
<gcs-overlay>
    <gcs-alert kind="info" >...Submitting</gcs-alert>
</gcs-overlay>`;
        }
        connectedCallback() {
            super.connectedCallback?.();
            this._submitFetcher = new Fetcher({
                onData: data => this.handleSubmitData(data),
                onSuccess: () => this.handleSubmitSuccess('Record was successfully submitted.'),
                onError: error => this.handleSubmitError(error)
            });
        }
        submit() {
            this.submitting = true;
            const data = this.getSubmitData();
            const method = this.getMethod(data);
            let params = undefined;
            if (method.toUpperCase() === 'PUT') {
                const id = data[this.idField];
                params = {
                    [this.idField]: id
                };
            }
            this._submitFetcher.fetch({
                url: this.submitUrl,
                method,
                contentType: this.getContentType(),
                params,
                data
            });
        }
        getContentType() {
            const fileField = this.findAdoptedChild((c) => c.nodeName === "GCS-FILE-FIELD");
            if (fileField) {
                return ContentMultipartFormData;
            }
            return ContentTypeApplicationJson;
        }
        getMethod(data) {
            const { method } = this;
            if (method !== undefined) {
                return typeof method === 'function' ?
                    method() :
                    method;
            }
            return data[this.idField] !== undefined ? 'PUT' : 'POST';
        }
        handleSubmitData(data) {
            this.submitting = false;
            this.handleSubmitResponse(data);
        }
        handleSubmitSuccess(successMessage) {
            this.submitting = false;
            this.submitSuccess?.();
            notifySuccess(this, successMessage);
        }
        handleSubmitError(error) {
            this.submitting = false;
            notifyError(this, error);
        }
    };
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
        await fetcher.fetch({
            url: this.url,
            method: 'POST',
            headers: {
                'Content-Type': ContentTypeTextPlain
            },
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
                beforeGet: function (value) {
                    if (this.beforeValueGet !== undefined) {
                        return this.beforeValueGet(value);
                    }
                    return value;
                },
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
        if (!isUndefinedOrNull(event)) {
            let v = getNewValue(event.target);
            if (this.beforeValueSet !== undefined) {
                v = this.beforeValueSet(v);
            }
            this._tempValue = v;
        }
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
        this._tempValue = undefined;
        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue,
            newValue: this.value
        });
    }
}

const formStyles = css `
:host {
    display: block;   
    margin: var(--gcs-margin); 
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
class Form extends Submittable(Validatable(RemoteLoadableHolder(CustomElement))) {
    _fields = new Map();
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
            },
            updateDataFromResponse: {
                attribute: 'update-data-from-response',
                type: DataTypes.Boolean,
                value: true
            }
        };
    }
    render() {
        const { labelWidth, labelAlign } = this;
        return html `
<form>
    ${this.renderLoading()}
    ${this.renderSubmitting()}
    <slot 
        label-width=${labelWidth} 
        label-align=${labelAlign} 
        key="form-fields"
    >
    </slot>
    ${this._renderButton()}
</form>`;
    }
    _renderButton() {
        if (this.hideSubmitButton) {
            return null;
        }
        return html `
<gcs-button key="submit-button" kind="primary" variant="contained" click=${() => this.submit()}>
    <gcs-localized-text>Submit</gcs-localized-text>
    <gcs-icon name="box-arrow-right"></gcs-icon>
</gcs-button>`;
    }
    getSubmitData() {
        return this.getData();
    }
    submit() {
        if (this.modifiedFields.length === 0) {
            notifyError(this, 'This form has not been modified');
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
        if (!this.updateDataFromResponse) {
            return;
        }
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
                        field.acceptChanges?.();
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
        const { field } = event.detail;
        field.form = this;
        this._fields.set(field.name, field);
    }
    handleChange(event) {
        const { name, newValue } = event.detail;
        this.setData({
            [name]: newValue
        });
        setTimeout(() => {
            if (this.modifiedFields.length > 0) {
                window.addEventListener('beforeunload', this.handleBeforeUnload);
            }
            else {
                window.removeEventListener('beforeunload', this.handleBeforeUnload);
            }
        });
    }
    get modifiedFields() {
        return Array.from(this._fields.values())
            .filter(f => f.isModified);
    }
    reset() {
        Array.from(this.modifiedFields)
            .forEach(f => f.reset());
        Array.from(this._fields.values())
            .forEach(f => f.clearValidation?.());
        this.warnings = [];
        this.errors = [];
    }
}
defineCustomElement('gcs-form', Form);

class Wizard extends Submittable(CustomElement) {
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
    margin: var(--gcs-margin);
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
    return class NavigationContainerMixin extends RemoteLoadableHolder(Base) {
        dataField = 'links';
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

function copyNode(source, dataView) {
    const newNode = document.createElement(source.nodeName);
    Array.from(source.attributes).forEach(attr => newNode.setAttribute(attr.name, attr.value));
    newNode.setAttribute('data-view', dataView);
    newNode.appendChild(document.createTextNode(source.textContent || ''));
    return newNode;
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
                    document.head.querySelectorAll('[data-view]').forEach(s => s.remove());
                    document.body.querySelectorAll('[data-view]').forEach(s => s.remove());
                    Array.from(head.children).forEach(child => {
                        if (child.tagName === 'SCRIPT' ||
                            child.tagName === 'STYLE') {
                            const newScript = copyNode(child, value);
                            document.head.appendChild(newScript);
                        }
                    });
                    Array.from(body.children).forEach(child => {
                        if (child.tagName === 'SCRIPT' ||
                            child.tagName === 'STYLE') {
                            const newScript = copyNode(child, value);
                            document.body.appendChild(newScript);
                        }
                        else {
                            d.appendChild(child);
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

class HelpTip extends CustomElement {
    render() {
        const textNode = getContentTextNode(this);
        const content = textNode?.textContent || 'Help content not set';
        return renderTip('secondary', '?', content);
    }
}
defineCustomElement('gcs-help-tip', HelpTip);

class ModifiedTip extends CustomElement {
    render() {
        const textNode = getContentTextNode(this);
        const content = textNode?.textContent || 'This field has been modified';
        return renderTip('primary', 'M', content);
    }
}
defineCustomElement('gcs-modified-tip', ModifiedTip);

class RequiredTip extends CustomElement {
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

const panelHeaderStyles = css `
:host {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: solid transparent;
    border-radius: var(--gcs-border-radius);
}

.item {
    margin: var(--gcs-margin);
}`;

class PanelHeader extends Closable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, panelHeaderStyles);
    }
    static get properties() {
        return {
            iconName: {
                attribute: 'icon-name',
                type: [
                    DataTypes.String
                ]
            }
        };
    }
    render() {
        return html `
<span class="item">
    ${this.renderIcon()}
</span> 
<span class="item">
    <slot name="title"></slot>
</span>
<span class="item">
    <slot name="tools"></slot>
    ${this.renderCloseTool()}
</span>`;
    }
    renderIcon() {
        const { iconName } = this;
        if (iconName) {
            return html `
<gcs-icon 
    slot="start" 
    name=${this.iconName}
>
</gcs-icon>`;
        }
        else {
            return null;
        }
    }
}
defineCustomElement('gcs-panel-header', PanelHeader);

const panelStyles = css `
:host {
    display: grid;
    grid-template-rows: auto 1fr auto;
    background-color: var(--bg-color);
    border-radius: var(--gcs-border-radius)
}

#header,
#footer {
    background-color: var(--gcs-header-bg-color);
    color: var(--gcs-header-text-color);
}`;

class Panel extends CustomElement {
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
    handleClick(evt) {
        evt.stopPropagation();
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
    border-radius: var(--gcs-border-radius);
    font-size: inherit;
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
    border: solid var(--gcs-header-bg-color);
}`;

const inputEvent = "inputEvent";
class DisplayableField extends Disableable(Field) {
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
        super.handleInput?.(event);
        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: !areEquivalent(this._initialValue, this._tempValue)
        });
    }
    get isModified() {
        return this.value !== this._initialValue;
    }
    acceptChanges() {
        this._initialValue = this.value;
        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: false
        });
    }
    reset() {
        this.value = this._initialValue;
        this.dispatchCustomEvent(inputEvent, {
            field: this,
            modified: false
        });
    }
    clearValidation() {
        this.dispatchCustomEvent(validationEvent, {
            warnings: [],
            errors: []
        });
    }
}

function SelectionContainerPassthrough(Base) {
    return class SelectionContainerPassthroughMixin extends Base {
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
                selectionChanged: {
                    attribute: 'selection-changed',
                    type: DataTypes.Function,
                    defer: true
                },
                selection: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Array
                    ],
                    setValue(selection) {
                        const { selectionContainer } = this;
                        if (selectionContainer) {
                            selectionContainer.selection = selection;
                        }
                    },
                    getValue() {
                        const { selectionContainer } = this;
                        if (!selectionContainer) {
                            return [];
                        }
                        return selectionContainer.selection;
                    }
                }
            };
        }
    };
}

function RemoteLoadableHolderPassthrough(Base) {
    return class RemoteLoadableHolderPassthorughMixin extends Base {
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

function CollectionDataHolder(Base) {
    return class CollectionDataHolderMixin extends Base {
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
            const { column, ascending, element } = event.detail;
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
                        return compareValues(r1[column], r2[column]);
                    }
                    else {
                        return compareValues(r2[column], r1[column]);
                    }
                };
                this.data = [...this.data].sort(comparer);
            }
        }
    };
}

const focusableStyles = css `
:host(:focus),
:host(:focus-visible) {
    border: solid var(--gcs-header-bg-color);
}`;

function Focusable(Base) {
    return class FocusableMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, focusableStyles);
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.tabIndex = 0;
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.tabIndex = -1;
        }
    };
}

class ComboBox extends SelectionContainerPassthrough(RemoteLoadableHolderPassthrough(CollectionDataHolder(Focusable(DisplayableField)))) {
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
        return html `
<gcs-drop-down>
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
        return html `
<gcs-selector select-value=${record}>
    ${display}
</gcs-selector>`;
    }
    onSelectionChanged(selection, oldSelection, selectedChildren) {
        this._tempValue = this.unwrapValue(selection);
        this.handleInput();
        this.value = this._tempValue;
        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue: oldSelection,
            newValue: selection
        });
        this.selectionChanged?.(selection, oldSelection, selectedChildren);
    }
    renderContent() {
        return html `
<gcs-data-list 
    id="selection-container"
    slot="content" 
    data=${this.data}
    load-url=${this.loadUrl}
    item-template=${this.renderItem} 
    initialized=${dataList => this.selectionContainer = dataList}
    multiple=${this.multiple}
    id-field=${this.idField} 
    selection-changed=${this.onSelectionChanged}>
</gcs-data-list>`;
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
        const { deselectById } = this.selectionContainer;
        if (multipleSelectionTemplate !== undefined) {
            return multipleSelectionTemplate(selection, deselectById);
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
    <gcs-close-tool close=${() => deselectById(record[idField])}></gcs-close-tool>
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
        this.selectionContainer.selectByValue(value);
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
        if (isUndefinedOrNull(value)) {
            return undefined;
        }
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
        return html `
<input
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
    static getFieldType() {
        return DataTypes.Boolean;
    }
    render() {
        const { name, value, disabled } = this;
        return html `
<input
    type="checkbox"
    name=${name}
    checked=${value}
    onInput=${event => this.handleInput(event)}
    onChange=${event => this.handleChange(event)}
    onBlur=${() => this.handleBlur()}
    disabled=${disabled}
/>`;
    }
    beforeValueGet(value) {
        if (isUndefinedOrNull(value)) {
            return false;
        }
        else {
            return value;
        }
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
            super(...args);
            this.deselectById = this.deselectById.bind(this);
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
            const { element, selected, value } = event.detail;
            this._updateSelection(element, selected, value);
        }
        _updateSelection(element, selected, value) {
            if (this.selectable !== true) {
                return;
            }
            const { multiple, selection, selectionChanged, idField } = this;
            const oldSelection = this.selection;
            if (multiple === true) {
                if (selected === true) {
                    this.selection = [...selection, value];
                    this.selectedChildren.push(element);
                }
                else {
                    if (idField !== undefined) {
                        this.selection = selection
                            .filter((record) => record[idField] !== value[idField]);
                    }
                    else {
                        this.selection = selection.filter((record) => record !== value);
                    }
                    this.selectedChildren = this.selectedChildren
                        .filter((el) => el !== element);
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
                selectionChanged(this.selection, oldSelection, this.selectedChildren);
            }
        }
        deselectById(id) {
            const { selectedChildren, idField } = this;
            const selectedChild = selectedChildren
                .filter((el) => el.selectValue[idField] === id)[0];
            selectedChild.selected = false;
            this._updateSelection(selectedChild, false, selectedChild.selectValue);
        }
        selectByValue(value) {
            const selectors = Array.from(this.adoptedChildren);
            selectors.forEach(s => {
                const v = s.selectValue[this.idField];
                const select = Array.isArray(value) ?
                    value.includes(v) :
                    value === v;
                if ((s.selected || false) !== select) {
                    this._updateSelection(s, select, s.selectValue);
                }
            });
        }
    };
}

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

class CollectionPanel extends CustomElement {
    _deleteFetcher;
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
            },
            idField: {
                attribute: 'id-field',
                type: DataTypes.String,
                value: 'id'
            },
            loadUrl: {
                attribute: 'load-url',
                type: DataTypes.String
            },
            createUrl: {
                attribute: 'create-url',
                type: DataTypes.String
            },
            loadRecordUrl: {
                attribute: 'load-record-url',
                type: DataTypes.String
            },
            updateUrl: {
                attribute: 'update-url',
                type: DataTypes.String
            },
            deleteUrl: {
                attribute: 'delete-url',
                type: DataTypes.String
            },
            createFormContent: {
                attribute: 'create-form-content',
                type: DataTypes.Function,
                defer: true
            },
            updateFormContent: {
                attribute: 'update-form-content',
                type: DataTypes.Function,
                defer: true
            },
        };
    }
    constructor() {
        super();
        this.showEditForm = this.showEditForm.bind(this);
        this.showConfirmDelete = this.showConfirmDelete.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }
    connectedCallback() {
        super.connectedCallback?.();
        if (this.deleteUrl !== undefined) {
            this._deleteFetcher = new Fetcher({
                onSuccess: () => this.handleSuccessfulDelete(),
                onError: error => notifyError(this, error)
            });
        }
        this.addEventListener(closingEvent, this.handleClose);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(closingEvent, this.handleClose);
    }
    handleClose(event) {
        const { source } = event.detail;
        switch (source) {
            case 'add-overlay':
                {
                    this.resetForm('create-form');
                }
                break;
        }
    }
    render() {
        return html `
<gcs-panel id="collection-panel">
    ${this.renderToolbar()}
    ${this.renderDataGrid()}  
    ${this.renderInsertDialog()} 
    ${this.renderUpdateDialog()}  
    ${this.renderDeleteDialog()}  
</gcs-panel>
`;
    }
    renderToolbar() {
        if (!this.createUrl) {
            return null;
        }
        return html `
<div slot="header">
    <gcs-button 
        click=${() => this.showOverlay('add-overlay', true)}
        kind="primary">
        <gcs-icon name="person-add"></gcs-icon>
        <gcs-localized-text>Add</gcs-localized-text>
    </gcs-button>
</div>`;
    }
    renderDataGrid() {
        const { updateUrl, showEditForm, deleteUrl, showConfirmDelete, loadUrl } = this;
        let { columns } = this;
        if (updateUrl) {
            columns = [
                ...columns,
                {
                    value: '_$action',
                    render: function (_value, record) {
                        return html `
<gcs-tool-tip>
    <gcs-button 
        slot="trigger"
        click=${() => showEditForm(record)}
        kind="warning">
        <gcs-icon name="pencil"></gcs-icon>
    </gcs-button>
    <gcs-localized-text slot="content">Edit</gcs-localized-text>
</gcs-tool-tip>`;
                    }
                }
            ];
        }
        if (deleteUrl) {
            columns = [
                ...columns,
                {
                    value: '_$action',
                    render: function (_value, record) {
                        return html `
<gcs-tool-tip>
    <gcs-button 
        slot="trigger"
        click=${() => showConfirmDelete(record)}
        kind="danger" 
    >
        <gcs-icon name="trash"></gcs-icon>
    </gcs-button>
    <gcs-localized-text slot="content">Delete</gcs-localized-text>
</gcs-tool-tip>`;
                    }
                }
            ];
        }
        return html `
<gcs-data-grid 
    id="data-grid"
    slot="body" 
    id-field=${this.idField}
    columns=${columns}
    load-url=${loadUrl}
    data=${this.data}
>
</gcs-data-grid>`;
    }
    renderInsertDialog() {
        if (!this.createUrl) {
            return null;
        }
        return html `
<gcs-overlay 
    id="add-overlay" 
    slot="body"
>
    <gcs-panel>

        <gcs-panel-header
            slot="header"
            icon-name="database-add"
            close="add-overlay"
        >
            <gcs-localized-text slot="title">Add Record</gcs-localized-text>
        </gcs-panel-header>
        
        <gcs-form 
            id="create-form"
            slot="body"
            submit-url=${this.createUrl}
            auto-load="false"
            update-data-from-response="false"
            submit-success=${() => {
            this.showOverlay('add-overlay', false);
            this.resetForm('create-form');
        }}
        >
        ${this.renderCreateFormBody()}
        </gcs-form>
        
    </gcs-panel>

</gcs-overlay>`;
    }
    showOverlay(id, show) {
        const overlay = this.findAdoptedChildById(id);
        overlay.showing = show;
    }
    resetForm(id) {
        const form = this.findAdoptedChildById(id);
        form.reset();
    }
    renderCreateFormBody() {
        const { createFormContent } = this;
        if (createFormContent) {
            return createFormContent();
        }
        else {
            return html `
<gcs-alert 
    kind="danger" 
>
    <gcs-localized-text>No content for the create form has been found.</gcs-localized-text>
</gcs-alert>`;
        }
    }
    renderUpdateFormBody() {
        const { updateFormContent } = this;
        if (updateFormContent) {
            return updateFormContent();
        }
        else {
            return html `
<gcs-alert 
    kind="danger" 
>
    <gcs-localized-text>No content for the update form has been found.</gcs-localized-text>
</gcs-alert>`;
        }
    }
    renderUpdateDialog() {
        if (!this.updateUrl) {
            return null;
        }
        return html `
<gcs-overlay 
    id="update-overlay" 
    slot="body"
>
    <gcs-panel>

        <gcs-panel-header
            slot="header"
            icon-name="database-check"
            close="update-overlay"
        >
            <localized-label slot="title">Update Record</localized-label>
        </gcs-panel-header>
        
        <gcs-form 
            id="update-form"
            slot="body"
            id-field=${this.idField}
            load-url=${this.loadRecordUrl}
            auto-load="false"
            submit-url=${this.updateUrl}
            submit-success=${() => {
            this.showOverlay('update-overlay', false);
        }}
        >
        ${this.renderUpdateFormBody()}
        </gcs-form>
        
    </gcs-panel>

</gcs-overlay>`;
    }
    renderDeleteDialog() {
        return html `
<gcs-overlay 
    id="delete-overlay" 
    slot="body"
>
</gcs-overlay>`;
    }
    showEditForm(record) {
        const form = this.findAdoptedChildById('update-form');
        const { idField, loadRecordUrl } = this;
        const params = {
            [idField]: record[idField]
        };
        if (loadRecordUrl === 'local') {
            form.setData(record, true);
        }
        else {
            form.loadRemote(params);
        }
        this.showOverlay('update-overlay', true);
    }
    showConfirmDelete(record) {
        const overlay = this.findAdoptedChildById('delete-overlay');
        const { deleteRecord } = this;
        overlay.content = () => html `
<gcs-alert
    kind="danger" 
    close="delete-overlay"
>
    <gcs-localized-text>Are you sure you want to delete the record?</gcs-localized-text>
    <div>
        <gcs-button
            click=${async () => await deleteRecord(record)} 
            kind="danger"
            variant="outlined"
        >
            <gcs-localized-text>Delete</gcs-localized-text>
            <gcs-icon name="trash"></gcs-icon>
        </gcs-button>
    </div>
</gcs-alert>`;
        overlay.showing = true;
    }
    async deleteRecord(record) {
        const { idField, deleteUrl } = this;
        const id = record[idField];
        await this._deleteFetcher?.fetch({
            url: deleteUrl,
            method: 'DELETE',
            params: {
                [idField]: id
            }
        });
    }
    handleSuccessfulDelete() {
        this.showOverlay('delete-overlay', false);
        const grid = this.findAdoptedChildById('data-grid');
        grid.load();
        notifySuccess(this, 'Record was successfully deleted.');
    }
}
defineCustomElement('gcs-collection-panel', CollectionPanel);

class CollectionField extends CollectionPanel {
}
defineCustomElement('gcs-collection-field', CollectionField);

const formFieldStyles = css `
:host {
    display: block;
    margin: var(--gcs-margin);
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

class FormField extends CustomElement {
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
    handleInput(event) {
        event.stopPropagation();
        const { modified } = event.detail;
        this.modified = modified;
    }
    handleValidation(event) {
        event.stopPropagation();
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
        return html `
${this.renderWarnings()}
${this.renderErrors()}`;
    }
    renderWarnings() {
        const { warnings } = this;
        if (warnings === undefined) {
            return null;
        }
        return warnings.map((warning) => html `
<gcs-alert 
    kind="warning"
>
    <gcs-localized-text>${warning}</gcs-localized-text>   
</gcs-alert>`);
    }
    renderErrors() {
        const { errors } = this;
        if (errors === undefined) {
            return null;
        }
        return errors.map((error) => html `
<gcs-alert 
    kind="danger"
>
    <gcs-localized-text>${error}</gcs-localized-text>   
</gcs-alert>`);
    }
}
defineCustomElement('gcs-validation-summary', ValidationSummary);

const cellEditorStyles = css `
:host {
    position: relative;
}`;

class CellEditor extends CustomElement {
    _field;
    static get styles() {
        return cellEditorStyles;
    }
    static get properties() {
        return {
            name: {
                type: DataTypes.String,
                required: true
            },
            type: {
                type: DataTypes.String,
                required: true
            },
            value: {
                type: [
                    DataTypes.String,
                    DataTypes.Number,
                    DataTypes.Boolean,
                    DataTypes.BigInt,
                    DataTypes.Date,
                    DataTypes.Object,
                    DataTypes.Array,
                    DataTypes.Function
                ],
                defer: true,
            }
        };
    }
    static get state() {
        return {
            editing: {
                value: false
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener("keydown", this.handleKeyDown);
        this.addEventListener(fieldAddedEvent, this.handleFieldAdded);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener("keydown", this.handleKeyDown);
        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded);
    }
    acceptChanges() {
        if (this.editing === false) {
            return;
        }
        const { _field } = this;
        if (_field) {
            this.value = _field.value;
        }
        this.editing = false;
    }
    rejectChanges() {
        this.editing = false;
    }
    handleFieldAdded(event) {
        const { field } = event.detail;
        this._field = field;
    }
    render() {
        const { value, editing } = this;
        const v = typeof value === "function" ?
            value() :
            value;
        if (editing == false) {
            return html `${v}`;
        }
        else {
            return this.renderField(v);
        }
    }
    renderField(value) {
        switch (this.type) {
            case "string": return html `
<gcs-text-field
    name=${this.name}
    value=${value}
>
</gcs-text-field>`;
            case "number": return html `
<gcs-number-field
    name=${this.name}
    value=${value}
>
</gcs-number-field>`;
            default: throw new Error(`Not implemented for type: ${this.type}`);
        }
    }
}
defineCustomElement('gcs-cell-editor', CellEditor);

const dataListStyles = css `
:host {
    display: grid;
}`;

function renderEmptyData(slot = null) {
    return html `
<gcs-alert 
    kind="warning"
    slot=${slot}
>
    <gcs-localized-text>No Records Found</gcs-localized-text>
</gcs-alert>`;
}

class DataList extends SelectionContainer(RemoteLoadableHolder(CollectionDataHolder(CustomElement))) {
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
        const { idField, data } = this;
        if (data.length === 0) {
            return renderEmptyData();
        }
        return data.map((record) => this.itemTemplate(record, record[idField]));
    }
}
defineCustomElement('gcs-data-list', DataList);

const dataGridBodyCellStyles = css `
:host {

    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0px;
    white-space: nowrap;
}`;

class DataGridBodyCell extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataGridBodyCellStyles);
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
        const value = record[name] || column.value;
        if (isUndefinedOrNull(value)) {
            throw new Error(`Undefined or null value in column: ${name}`);
        }
        applyClasses(this, {
            'data-cell': value !== '_$action'
        });
        if (column.render !== undefined) {
            return column.render(value, record, column);
        }
        else {
            return html `${value}`;
        }
    }
}
defineCustomElement('gcs-data-cell', DataGridBodyCell);

const dataGridBodyRowStyles = css `
:host {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

:host(:nth-of-type(even)) {
    background-color: var(--alt-bg-color);
}

:host(:nth-of-type(odd)) {
    background-color: var(--bg-color);
}

.data-cell {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
}`;

class DataGridBodyRow extends Selectable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, dataGridBodyRowStyles);
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
defineCustomElement('gcs-data-row', DataGridBodyRow);

function getStyle(props) {
    return Object.keys(props).reduce((acc, key) => (acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + props[key] + ';'), '');
}

const dataGridHeaderCellStyles = css `
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

class DataGridHeaderCell extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataGridHeaderCellStyles);
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
defineCustomElement('gcs-data-header-cell', DataGridHeaderCell);

const dataGridHeaderStyles = css `
:host {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    background-color: var(--gcs-header-bg-color);
    color: var(--gcs-header-text-color);
}`;

class DataGridHeader extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataGridHeaderStyles);
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
defineCustomElement('gcs-data-header', DataGridHeader);

const dataGridStyles = css `
:host {
    display: flex;
    flex-flow: column nowrap;
    flex: 1 1 auto;
}`;

class DataGrid extends RemoteLoadableHolder(CollectionDataHolder(CustomElement)) {
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
        if (data.length === 0) {
            return renderEmptyData('body');
        }
        return data.map((record) => html `
<gcs-data-row 
    slot="body"
    columns=${columns}
    record=${record} 
    key=${record[idField]}>
</gcs-data-row>`);
    }
    load() {
        if (this.loadUrl) {
            this.loadRemote('body');
        }
        else {
            throw new Error('load local is not implemented');
        }
    }
}
defineCustomElement('gcs-data-grid', DataGrid);

var KeyNames;
(function (KeyNames) {
    KeyNames["Enter"] = "Enter";
    KeyNames["ArrowLeft"] = "ArrowLeft";
    KeyNames["ArrowUp"] = "ArrowUp";
    KeyNames["ArrowRight"] = "ArrowRight";
    KeyNames["ArrowDown"] = "ArrowDown";
    KeyNames["Backspace"] = "Backspace";
    KeyNames["Tab"] = "Tab";
    KeyNames["Escape"] = "Escape";
    KeyNames["Space"] = " ";
})(KeyNames || (KeyNames = {}));

const propertyGridRowStyles = css `
:host {
    display: flex;   
    margin: var(--gcs-margin); 
    gap: var(--gcs-margin); 
}`;

class PropertyGridRow extends Clickable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, propertyGridRowStyles);
    }
    static get properties() {
        return {
            label: {
                type: DataTypes.String
            },
            name: {
                type: DataTypes.String,
                required: true
            },
            type: {
                type: DataTypes.String,
                required: true
            },
            value: {
                type: DataTypes.String
            },
            labelAlign,
            labelWidth,
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener("keydown", this.handleKeyDown);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener("keydown", this.handleKeyDown);
    }
    handleKeyDown(event) {
        switch (event.key) {
            case KeyNames.Enter:
            case KeyNames.Tab:
                {
                    const cellEditor = this.document.getElementById("cell-editor");
                    cellEditor.acceptChanges();
                }
                break;
            case KeyNames.Backspace:
                break;
            default:
                {
                    const printableRegex = /^[\x20-\x7E]$/;
                    if (!printableRegex.test(event.key)) {
                        const cellEditor = this.document.getElementById("cell-editor");
                        cellEditor.rejectChanges();
                    }
                }
                break;
        }
    }
    render() {
        const { label, name, type, value, labelAlign, labelWidth } = this;
        const labelContainerStyle = css `flex: 0 0 ${labelWidth};`;
        const labelStyle = css `justify-content: ${labelAlign};`;
        return html `
<span id="label-container" style=${labelContainerStyle}>
    <span id="label" style=${labelStyle}>
        <gcs-localized-text>${label}</gcs-localized-text>
    </span>
</span>
<span style="flex: auto; border: var(--gcs-border-width) solid lightgrey; border-radius: var(--gcs-border-radius);">
    <gcs-cell-editor 
        id="cell-editor"
        name=${name}
        type=${type}
        value=${value}>
    </gcs-cell-editor>
</span>`;
    }
    handleClick() {
        const cellEditor = this.document.getElementById("cell-editor");
        cellEditor.editing = true;
    }
}
defineCustomElement('gcs-property-grid-row', PropertyGridRow);

function Configurable(Base) {
    return class ConfigurableMixin extends Base {
        static get properties() {
            return {
                source: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Function
                    ],
                    defer: true,
                    canChange: function () {
                        return true;
                    },
                    afterChange: async function (value) {
                        await this.updateComplete;
                        const descriptor = (typeof value === "function" ?
                            value() :
                            value);
                        this.configure(descriptor);
                    }
                }
            };
        }
    };
}

const propertyGridStyles = css `
:host {
    display: inline-block;   
    margin: var(--gcs-margin); 
}`;

class PropertyGrid extends Configurable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, propertyGridStyles);
    }
    static get properties() {
        return {
            labelWidth,
            labelAlign,
            data: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ],
                defer: true
            }
        };
    }
    render() {
        return html `
<gcs-panel>
    ${this._renderLabel()}
    ${this._renderIcon()}
    ${this._renderBody()}
</gcs-panel>`;
    }
    configure(source) {
        this.source = source;
    }
    _renderLabel() {
        return html `
<gcs-localized-text 
    slot="header"
>
    ${this.source.label || "Properties Grid"}
</gcs-localized-text>`;
    }
    _renderIcon() {
        const { iconName, } = this.source;
        if (!iconName) {
            return null;
        }
        return html `
<gcs-icon 
    slot="header"
    name=${iconName}
>
</gcs-icon>`;
    }
    _renderBody() {
        const { source, data, labelWidth, labelAlign } = this;
        const d = typeof data === "function" ?
            data() :
            data;
        if (!d) {
            return renderEmptyData('body');
        }
        const children = typeof source.children === "function" ?
            source.children() :
            source.children;
        return children.map((c) => html `
<gcs-property-grid-row 
    slot="body"
    label-width=${labelWidth} 
    label-align=${labelAlign} 
    label=${c.label}
    name=${c.name}
    type=${c.type || "string"}
    value=${d[c.name]} 
    key=${c.name}>
</gcs-property-grid-row>`);
    }
}
defineCustomElement('gcs-property-grid', PropertyGrid);

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
	background-color: var(--gcs-header-bg-color);
	color: var(--gcs-header-text-color);
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
	display: block;
	position: relative;
  	overflow-y: scroll;
}`;

class ApplicationView extends RemoteLoadableHolder(CustomElement) {
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
        const { application } = this;
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

    <gcs-content-view id="app-content-view">
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
                text: name
            };
            application.type.routes
                .filter(route => route.module === name)
                .forEach(route => {
                const { name, path } = route;
                links[path] = {
                    group,
                    text: name
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

export { Accordion, Alert, AppInitializedEvent, ApplicationHeader, ApplicationView, Button, CellEditor, Center, CheckBox, CloseTool, CollectionField, CollectionPanel, ComboBox, ContentView, CustomElement, DataGridBodyCell as DataCell, DataGrid, DataGridHeader, DataGridHeaderCell as DataHeaderCell, DataList, DataGridBodyRow as DataRow, DataTemplate, DataTypes, DateField, DisplayableField, DropDown, ExpanderTool, FileField, Form, FormField, HashRouter, HelpTip, HiddenField, Icon, LocalizedText, ModifiedTip, NavigationBar, NavigationLink, NumberField, Overlay, Panel, PanelHeader, PasswordField, Pill, PropertyGrid, PropertyGridRow, RequiredTip, Selector, Slider, SorterTool, StarRating, TextArea, TextField, Theme, Tool, ToolTip, ValidationSummary, Wizard, WizardStep, appCtrl, css, defineCustomElement, getNotFoundView, html, navigateToRoute, viewsRegistry };
