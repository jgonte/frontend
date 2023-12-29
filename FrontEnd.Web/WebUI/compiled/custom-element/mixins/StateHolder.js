import ensureValueIsInOptions from "./helpers/ensureValueIsInOptions";
export default function StateHolder(Base) {
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
//# sourceMappingURL=StateHolder.js.map