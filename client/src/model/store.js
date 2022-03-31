export class Store {
  constructor() {
    this.state = {
      nav: {
        route: undefined,
      },
      trainings: [],
    };
    this.subscribers = [];
  }

  _updateStoreData = (fn) => {
    const newData = fn(this.state);
    
    this.state = {
      ...this.state,
      ...newData,
    };

    this._notifyAll();
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

  subscribe = (subscriber) => {
    if (typeof subscriber !== 'function') {
      throw new Error(
        `Subscriber can't be of type ${typeof subscriber}. Provide function.`,
      );
    }
    this._subscribe(subscriber);
    return () => {
      this._delete(subscriber);
    };
  };

  getStoreData = () => ({
    route: this.state.nav.route,
    trainings: this.state.trainings,
  });

  set route(data) {
    this._updateStoreData(state => ({
      nav: {
        ...state.nav,
        route: data,
      },
    }));
  }

  set trainings(data) {
    this._updateStoreData(() => ({
      trainings: data,
    }));
  }
}
