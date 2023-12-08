import Subscriber from './Subscriber';
export default class Observer {
    callbackName: string;
    private _subscribers;
    constructor(callbackName?: string);
    subscribe(subscriber: Subscriber): void;
    unsubscribe(subscriber: Subscriber): void;
    notify(...args: unknown[]): void;
}
