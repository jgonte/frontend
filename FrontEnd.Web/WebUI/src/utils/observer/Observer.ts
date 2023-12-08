import Subscriber from './Subscriber'

export default class Observer {

  private _subscribers: Subscriber[] = [];

  constructor(

    /**
     * The name of the callback the subscriber is using when notified
     */
    public callbackName: string = 'onNotify'
  ) { }

  subscribe(subscriber: Subscriber) {

    this._subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber) {

    const index = this._subscribers.indexOf(subscriber);

    if (index > -1) {

      this._subscribers.splice(index, 1);
    }
  }

  notify(...args: unknown[]) {

    args.push(this); // Append the observer to the list of arguments to make it accessable to the subscriber

    for (const subscriber of this._subscribers) {

      ((subscriber as Subscriber)[this.callbackName] as (...args: unknown[]) => void)?.(...args);
    }
  }
}
