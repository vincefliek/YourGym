export class Store {
  constructor() {
    this.state = {
      nav: {
        route: undefined,
      },
      trainings: [],
      newTraining: null,
      newExercise: null,
    };
    this.subscribers = {
      route: [],
      trainings: [],
      newTraining: [],
      newExercise: [],
    };

    const publicDataAccessors = Object.keys(this.subscribers);
    validateDataAccessors(publicDataAccessors);
    validateAllDataAccessorsDeclared(publicDataAccessors);
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

    const publicDataAccessorsToData = {
      route: this.state.nav.route,
      trainings: this.state.trainings,
      newTraining: this.state.newTraining,
      newExercise: this.state.newExercise,
    };

    const dataAccessors = Object.keys(publicDataAccessorsToData);
    validateDataAccessors(dataAccessors);
    validateAllDataAccessorsDeclared(dataAccessors);

    const data = publicDataAccessors.reduce((acc, prop) => ({
      ...acc,
      [prop]: publicDataAccessorsToData[prop],
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

  set newTraining(data) {
    const fn = () => ({
      newTraining: data,
    });

    this._updateStoreData(fn, ['newTraining']);
  }

  set newExercise(data) {
    const fn = () => ({
      newExercise: data,
    });

    this._updateStoreData(fn, ['newExercise']);
  }
}

const allPublicDataAccessors = [
  'route',
  'trainings',
  'newTraining',
  'newExercise',
];

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

function validateAllDataAccessorsDeclared(publicDataAccessors) {
  if (!areAllDataAccessorsDeclared(publicDataAccessors)) {
    throw new Error(
      `Declare >>>ALL<<< Public Data Accessors!
      Seems some Data Accessor were missed.
      You added: ${publicDataAccessors.join(', ')}.
      Must be added: ${allPublicDataAccessors.join(', ')}.`,
    );
  }
}

function areAllDataAccessorsDeclared(publicDataAccessors) {
  return allPublicDataAccessors.every(key => publicDataAccessors.includes(key));
}

function areValidDataAccessors(publicDataAccessors) {
  return publicDataAccessors.every(key => allPublicDataAccessors.includes(key));
}

function doesDataAccessorsExist(publicDataAccessors) {
  if (!Array.isArray(publicDataAccessors) || !publicDataAccessors.length) {
    return false;
  }
  return true;
}
