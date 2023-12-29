import { GenericRecord } from "../../utils/types";
import ensureValueIsInOptions from "./helpers/ensureValueIsInOptions";
import CustomElementStateMetadata from "./metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";

/**
 * Sets up the state of the custom element
 * @param Base 
 * @returns 
 */
export default function StateHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class StateHolderMixin extends Base {

        /**
         * The state of the instance
         */
        private _state: GenericRecord = {};

        connectedCallback() {

            super.connectedCallback?.();

            this._initializeStateWithDefaultValues((this.constructor as CustomHTMLElementConstructor).metadata.state);
        }

        /**
         * Initializes the state that have a default value
         * @param stateMetadata 
         */
        private _initializeStateWithDefaultValues(stateMetadata: Map<string, CustomElementStateMetadata>) {

            for (const [name, state] of stateMetadata) {

                const {
                    value,
                    options
                } = state;

                ensureValueIsInOptions(value, options);

                if (this._state[name] === undefined &&
                    value !== undefined) {

                    this.setState(name, value);
                }
            }
        }

        /* protected */ _setState(key: string, value: unknown): boolean {

            const stateMetadata = (this.constructor as CustomHTMLElementConstructor).metadata.state.get(key);
            
            // Verify that the property of the state is one of the configured in the custom element
            if (stateMetadata === undefined) {

                throw new Error(`There is no configured property for state: '${key}' in type: '${this.constructor.name}'`)
            }

            const {
                options,
                afterChange
            } = stateMetadata;

            ensureValueIsInOptions(value, options);

            const oldValue = this._state[key];

            if (oldValue === value) {

                return false;
            }

            this._state[key] = value;

            // Call any afterChange value on the property
            afterChange?.call(this, value, oldValue);

            return true;
        }
    }
}