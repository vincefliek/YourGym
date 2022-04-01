export class Store {
  constructor() {
    this.state = {
      nav: {
        route: undefined,
      },
      trainings: [],
    };
    this.subscribers = {
      route: [],
      trainings: [],
    };

    validateDataAccessors(Object.keys(this.subscribers));
  }

  _updateStoreData = (fn, dataAccessorsToNotify) => {
    validateDataAccessors(dataAccessorsToNotify);

    const newData = fn(this.state);

    this.state = {
      ...this.state,
      ...newData,
    };

    this._notify(dataAccessorsToNotify);
  };

  _notify = (dataAccessorsToNotify) => {
    validateDataAccessors(dataAccessorsToNotify);

    dataAccessorsToNotify.forEach(accessor => {
      this.subscribers[accessor].forEach(subscriber => {
        subscriber();
      });
    });
  };

  _subscribe = (subscriber, publicDataAccessors) => {
    publicDataAccessors.forEach(accessor => {
      this.subscribers[accessor].push(subscriber);
    });
  };

  _delete = (subscriber) => {
    Object.keys(this.subscribers).forEach(accessor => {
      this.subscribers[accessor] =
        this.subscribers[accessor].filter(s => s !== subscriber);
    });
  };

  subscribe = (subscriber, publicDataAccessors) => {
    if (typeof subscriber !== 'function') {
      throw new Error(
        `Subscriber can't be of type ${typeof subscriber}. Provide function.`,
      );
    }

    validateDataAccessors(publicDataAccessors);

    this._subscribe(subscriber, publicDataAccessors);
    return () => {
      this._delete(subscriber);
    };
  };

  getStoreData = (publicDataAccessors) => {
    validateDataAccessors(publicDataAccessors);

    const _publicDataAccessors = {
      route: this.state.nav.route,
      trainings: this.state.trainings,
    };

    validateDataAccessors(Object.keys(_publicDataAccessors));

    const data = publicDataAccessors.reduce((acc, prop) => ({
      ...acc,
      [prop]: _publicDataAccessors[prop],
    }), {});

    return data;
  };

  set route(data) {
    const fn = state => ({
      nav: {
        ...state.nav,
        route: data,
      },
    });

    this._updateStoreData(fn, ['route']);
  }

  set trainings(data) {
    const fn = () => ({
      trainings: data,
    });

    this._updateStoreData(fn, ['trainings']);
  }
}

function validateDataAccessors(publicDataAccessors) {
  if (!doesDataAccessorsExist(publicDataAccessors)) {
    throw new Error(
      'Public Data Accessors were not specified!',
    );
  }

  if (!areValidDataAccessors(publicDataAccessors)) {
    throw new Error(
      `Public Data Accessors are not valid!
      Provided accessors might not exist or there is a typo.`,
    );
  }
}

function areValidDataAccessors(publicDataAccessors) {
  const keys = ['route', 'trainings'];

  return publicDataAccessors.every(key => keys.includes(key));
}

function doesDataAccessorsExist(publicDataAccessors) {
  if (!Array.isArray(publicDataAccessors) || !publicDataAccessors.length) {
    return false;
  }
  return true;
}
