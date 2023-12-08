import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";
import StateHolder from "./StateHolder";
import PropertiesHolder from "./PropertiesHolder";

/**
 * Triggers updates to the UI of the element when the properties or the state of the element change
 * @param Base 
 * @returns 
 */
export default function ReactiveElement<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ReactiveElementMixin extends
        StateHolder(
            PropertiesHolder(Base)
        ) {

        /**
         * Flag that tests if there is an update in progress so no other updates are requested
         */
        private _hasPendingUpdate: boolean = false;

        /**
         * Promise to schedule the updates
         */
        private _updatePromise: Promise<void> = new Promise<void>((resolve, reject) => {

            try {

                resolve(); // Finished updating by default
            }
            catch (error) {

                reject(error);
            }
        });

        setProperty(name: string, value: unknown): void {

            if (this._setProperty(name, value) === true) {

                this.update();
            }
        }

        setState(key: string, value: unknown): void {

            if (this._setState(key, value) === true) {

                this.update();
            }
        }

        connectedCallback() {

            super.connectedCallback?.();

            this.update(); // First update
        }

        /**
         * Requests the custom element to be updated
         */
        protected update(): void {

            if (this._hasPendingUpdate) {

                return;
            }

            this._updatePromise = this._enqueueUpdate();
        }

        private async _enqueueUpdate(): Promise<void> {

            this._hasPendingUpdate = true;

            await this._updatePromise; // Wait for the previous update to finish

            return new Promise<void>(async (resolve, reject) => {

                try {

                    await this.updateDom();

                    resolve();
                }
                catch(error) {

                    console.error(error);

                    reject(error);
                }
                finally {

                    this._markUpdated();
                }     
            });
        }

        private _markUpdated() {

            this._hasPendingUpdate = false;

            this.clearChangedProperties();
        }

        get updateComplete(): Promise<void> {

            return this._updatePromise;
        }
    }
}