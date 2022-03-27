class Store {
  constructor() {
    this.state = {};
    this.subscribers = [];
  }

  updateStoreData = (fn) => {
    const newData = fn(this.state);
    
    this.state = {
      ...this.state,
      ...newData,
    };

    this._notifyAll();
  };

  getStoreData = () => this.state;

  subscribe = (subscriber) => {
    if (typeof subscriber !== 'function') {
      throw new Error(`Subscriber can't be of type ${typeof subscriber}. Provide function.`)
    }
    this._subscribe(subscriber);
    return () => {
      this._delete(subscriber);
    }
  };

  _notifyAll = () => {
    this.subscribers.forEach(subscriber => {
      subscriber(this.state);
    });
  };

  _subscribe = (subscriber) => {
    this.subscribers.push(subscriber);
  };

  _delete = (subscriber) => {
    this.subscribers = this.subscribers.filter(s => s !== subscriber);
  };
}

export const store = new Store();
