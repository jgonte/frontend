export default class Observer {
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
//# sourceMappingURL=Observer.js.map