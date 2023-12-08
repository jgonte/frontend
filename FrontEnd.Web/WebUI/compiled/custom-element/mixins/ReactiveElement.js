import StateHolder from "./StateHolder";
import PropertiesHolder from "./PropertiesHolder";
export default function ReactiveElement(Base) {
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
//# sourceMappingURL=ReactiveElement.js.map