import { Store as StoreInterface, Training, Exercise } from '../types';

export class Store implements StoreInterface {
  state: StoreInterface['state'];
  subscribers: StoreInterface['subscribers'];

  constructor() {
    this.state = {
      nav: {
        route: undefined,
        backRouteWithHistoryReplace: undefined,
      },
      trainings: [],
      newTraining: null,
      newExercise: null,
    };
    this.subscribers = {
      route: [],
      backRouteWithHistoryReplace: [],
      trainings: [],
      newTraining: [],
      newExercise: [],
    };

    const publicDataAccessors = Object.keys(this.subscribers);
    validateDataAccessors(publicDataAccessors);
    validateAllDataAccessorsDeclared(publicDataAccessors);
  }

  _updateStoreData = (
    fn: (state: StoreInterface['state']) => Partial<StoreInterface['state']>,
    dataAccessorsToNotify: string[],
  ) => {
    validateDataAccessors(dataAccessorsToNotify);

    const newData = fn(this.state);

    this.state = {
      ...this.state,
      ...newData,
    };

    this._notify(dataAccessorsToNotify);
  };

  _notify = (dataAccessorsToNotify: string[]) => {
    validateDataAccessors(dataAccessorsToNotify);

    dataAccessorsToNotify.forEach((accessor) => {
      if (this.isValidAccessor(accessor)) {
        this.subscribers[accessor].forEach(subscriber => {
          subscriber();
        });
      }
    });
  };

  _subscribe = (subscriber: () => void, publicDataAccessors: string[]) => {
    publicDataAccessors.forEach((accessor) => {
      if (this.isValidAccessor(accessor)) {
        this.subscribers[accessor].push(subscriber);
      }
    });
  };

  _delete = (subscriber: () => void) => {
    Object.keys(this.subscribers).forEach((accessor) => {
      if (this.isValidAccessor(accessor)) {
        this.subscribers[accessor] =
          this.subscribers[accessor].filter(s => s !== subscriber);
      }
    });
  };

  private isValidAccessor(
    accessor: string,
  ): accessor is keyof StoreInterface['subscribers'] {
    return accessor in this.subscribers;
  };

  subscribe = (subscriber: () => void, publicDataAccessors: string[]) => {
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

  getStoreData = (publicDataAccessors: string[]): { [key: string]: any } => {
    validateDataAccessors(publicDataAccessors);

    const publicDataAccessorsToData = {
      route: this.state.nav.route,
      backRouteWithHistoryReplace: this.state.nav.backRouteWithHistoryReplace,
      trainings: this.state.trainings,
      newTraining: this.state.newTraining,
      newExercise: this.state.newExercise,
    } as const;

    type DataKey = keyof typeof publicDataAccessorsToData;

    const dataAccessors = Object.keys(publicDataAccessorsToData);
    validateDataAccessors(dataAccessors);
    validateAllDataAccessorsDeclared(dataAccessors);

    const data = publicDataAccessors.reduce<{ [key: string]: any }>(
      (acc, prop) => {
        acc[prop] = publicDataAccessorsToData[prop as DataKey];
        return acc;
      }, {});

    return data;
  };


  get route(): string | undefined {
    return this.state.nav.route;
  }

  get backRouteWithHistoryReplace(): string | undefined {
    return this.state.nav.backRouteWithHistoryReplace;
  }

  get trainings(): Training[] {
    return this.state.trainings;
  }

  get newTraining(): Training | null {
    return this.state.newTraining;
  }

  get newExercise(): Exercise | null {
    return this.state.newExercise;
  }

  set route(data: string | undefined) {
    const fn = (state: StoreInterface['state']) => ({
      nav: {
        ...state.nav,
        route: data,
      },
    });

    this._updateStoreData(fn, ['route']);
  }

  set backRouteWithHistoryReplace(data: string | undefined) {
    const fn = (state: StoreInterface['state']) => ({
      nav: {
        ...state.nav,
        backRouteWithHistoryReplace: data,
      },
    });

    this._updateStoreData(fn, ['backRouteWithHistoryReplace']);
  }

  set trainings(data: Training[]) {
    const fn = () => ({
      trainings: data,
    });

    this._updateStoreData(fn, ['trainings']);
  }

  set newTraining(data: Training | null) {
    const fn = () => ({
      newTraining: data,
    });

    this._updateStoreData(fn, ['newTraining']);
  }

  set newExercise(data: Exercise | null) {
    const fn = () => ({
      newExercise: data,
    });

    this._updateStoreData(fn, ['newExercise']);
  }
}

const allPublicDataAccessors = [
  'route',
  'backRouteWithHistoryReplace',
  'trainings',
  'newTraining',
  'newExercise',
];

function validateDataAccessors(publicDataAccessors: string[]): void {
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

function validateAllDataAccessorsDeclared(publicDataAccessors: string[]): void {
  if (!areAllDataAccessorsDeclared(publicDataAccessors)) {
    throw new Error(
      `Declare >>>ALL<<< Public Data Accessors!
      Seems some Data Accessor were missed.
      You added: ${publicDataAccessors.join(', ')}.
      Must be added: ${allPublicDataAccessors.join(', ')}.`,
    );
  }
}

function areAllDataAccessorsDeclared(publicDataAccessors: string[]): boolean {
  return allPublicDataAccessors.every(key => publicDataAccessors.includes(key));
}

function areValidDataAccessors(publicDataAccessors: string[]): boolean {
  return publicDataAccessors.every(key => allPublicDataAccessors.includes(key));
}

function doesDataAccessorsExist(publicDataAccessors: string[]): boolean {
  if (!Array.isArray(publicDataAccessors) || !publicDataAccessors.length) {
    return false;
  }
  return true;
}
