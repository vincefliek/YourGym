import {
  Store as StoreInterface,
  AuthState,
  Training,
  Exercise,
  CompletedTraining,
  SyncWithServer,
  ActiveTraining,
  Notification,
} from '../types';

import { get as idbGet, set as idbSet } from 'idb-keyval';

interface State {
  nav: {
    route: string | undefined;
    backRouteWithHistoryReplace: string | undefined;
  };
  trainings: Training[];
  completedTrainings: CompletedTraining[];
  activeTraining: ActiveTraining | null;
  newTraining: Training | null;
  newExercise: Exercise | null;
  auth: AuthState;
  sync: SyncWithServer;
  notifications: Notification[];
  uiBlockingLayer: {
    isVisible: boolean;
    message?: string;
  };
}

interface Subscribers {
  route: Array<() => void>;
  backRouteWithHistoryReplace: Array<() => void>;
  trainings: Array<() => void>;
  newTraining: Array<() => void>;
  newExercise: Array<() => void>;
  auth: Array<() => void>;
  completedTrainings: Array<() => void>;
  activeTraining: Array<() => void>;
  sync: Array<() => void>;
  notifications: Array<() => void>;
  uiBlockingLayer: Array<() => void>;
}

export class Store implements StoreInterface {
  private state: State;
  private subscribers: Subscribers;

  // Persist options
  private readonly IDB_PREFIX = 'app-store';
  // temporary disabled during hydration
  private _persistenceEnabled = true;

  constructor() {
    this.state = {
      nav: {
        route: undefined,
        backRouteWithHistoryReplace: undefined,
      },
      trainings: [],
      completedTrainings: [],
      activeTraining: null,
      newTraining: null,
      newExercise: null,
      auth: {
        user: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null,
      },
      sync: {
        lastSyncAt: undefined,
        isLoading: false,
        serverHasChanges: false,
        error: undefined,
      },
      notifications: [],
      uiBlockingLayer: {
        isVisible: false,
        message: undefined,
      },
    };
    this.subscribers = {
      route: [],
      backRouteWithHistoryReplace: [],
      trainings: [],
      completedTrainings: [],
      activeTraining: [],
      newTraining: [],
      newExercise: [],
      auth: [],
      sync: [],
      notifications: [],
      uiBlockingLayer: [],
    };

    const publicDataAccessors = Object.keys(this.subscribers);
    validateDataAccessors(publicDataAccessors);
    validateAllDataAccessorsDeclared(publicDataAccessors);
  }

  async hasServerDataInIndexedDB(): Promise<boolean> {
    try {
      const checks = await Promise.all([
        this._readIDBAccessorValue('completedTrainings'),
      ]);

      return checks.every((v) => typeof v !== 'undefined');
    } catch (err) {
      // On error assume not empty to avoid accidental overwrites
      console.error('[Store] Failed to check IndexedDB emptiness:', err);
      return false;
    }
  }

  // ---------------------
  // IndexedDB helpers
  // ---------------------
  private _getIDBAccessorKey(accessor: string): string {
    return `${this.IDB_PREFIX}:${accessor}`;
  }

  private async _persistIDBAccessorValue(accessor: string): Promise<void> {
    if (!this._persistenceEnabled) return;

    try {
      const value = this._valueForIDBAccessor(accessor);
      // Fire & forget: don't await in callers, but handle errors here
      await idbSet(this._getIDBAccessorKey(accessor), value);
    } catch (err) {
      // swallow but surface developer-friendly error for debugging
      // (no throw so writes remain fire & forget)

      console.error(
        `[Store] Failed to persist "${accessor}" to IndexedDB:`,
        err,
      );
    }
  }

  private async _readIDBAccessorValue(accessor: string) {
    try {
      const v = await idbGet<State[keyof State]>(
        this._getIDBAccessorKey(accessor),
      );
      return v;
    } catch (err) {
      console.error(`[Store] Failed to read ${accessor} from IndexedDB:`, err);
      return undefined;
    }
  }

  private _valueForIDBAccessor(accessor: string): any {
    switch (accessor) {
      case 'route':
        return this.state.nav.route;
      case 'backRouteWithHistoryReplace':
        return this.state.nav.backRouteWithHistoryReplace;
      case 'trainings':
        return this.state.trainings;
      case 'completedTrainings':
        return this.state.completedTrainings;
      case 'activeTraining':
        return this.state.activeTraining;
      case 'newTraining':
        return this.state.newTraining;
      case 'newExercise':
        return this.state.newExercise;
      case 'auth':
        return this.state.auth;
      case 'sync':
        return this.state.sync;
      case 'notifications':
        return this.state.notifications;
      case 'uiBlockingLayer':
        return this.state.uiBlockingLayer;
      default:
        return undefined;
    }
  }

  // Public: call to hydrate local store from indexedDB (e.g. on window.onload)
  async hydrateFromIndexedDB(): Promise<void> {
    // Temporarily disable persistence to avoid re-writing values we just read.
    this._persistenceEnabled = false;

    try {
      const promises = allPublicDataAccessors.map(async (accessor) => {
        const persisted = await this._readIDBAccessorValue(accessor);

        if (persisted === undefined) return;

        // Apply persisted value to store WITHOUT triggering
        // persistence (disabled above).
        // use setters to keep notification flow intact
        switch (accessor) {
          case 'route':
            this.route = persisted as unknown as string | undefined;
            break;
          case 'backRouteWithHistoryReplace':
            this.backRouteWithHistoryReplace = persisted as unknown as
              | string
              | undefined;
            break;
          case 'trainings':
            this.trainings = persisted as Training[];
            break;
          case 'completedTrainings':
            this.completedTrainings = persisted as CompletedTraining[];
            break;
          case 'activeTraining':
            this.activeTraining = persisted as ActiveTraining | null;
            break;
          case 'newTraining':
            this.newTraining = persisted as Training | null;
            break;
          case 'newExercise':
            this.newExercise = persisted as Exercise | null;
            break;
          case 'auth':
            this.auth = persisted as Partial<AuthState>;
            break;
          case 'sync':
            this.sync = persisted as Partial<SyncWithServer>;
            break;
          case 'notifications':
            this.notifications = persisted as Notification[];
            break;
          case 'uiBlockingLayer':
            this.state.uiBlockingLayer = persisted as State['uiBlockingLayer'];
            break;
          default:
            break;
        }
      });

      await Promise.all(promises);
    } finally {
      // Re-enable persistence afterwards
      this._persistenceEnabled = true;
    }
  }

  private _updateStoreData = (
    fn: (state: State) => Partial<State>,
    dataAccessorsToNotify: string[],
  ) => {
    validateDataAccessors(dataAccessorsToNotify);

    const newData = fn(this.state);

    this.state = {
      ...this.state,
      ...newData,
    };

    this._notify(dataAccessorsToNotify);

    // Persist each accessor (fire & forget).
    // Does not block original synchronous flow.
    dataAccessorsToNotify.forEach((accessor) => {
      // intentionally not awaited
      void this._persistIDBAccessorValue(accessor);
    });
  };

  private _notify = (dataAccessorsToNotify: string[]) => {
    validateDataAccessors(dataAccessorsToNotify);

    dataAccessorsToNotify.forEach((accessor) => {
      if (this.isValidAccessor(accessor)) {
        this.subscribers[accessor].forEach((subscriber) => {
          subscriber();
        });
      }
    });
  };

  private _subscribe = (
    subscriber: () => void,
    publicDataAccessors: string[],
  ) => {
    publicDataAccessors.forEach((accessor) => {
      if (this.isValidAccessor(accessor)) {
        this.subscribers[accessor].push(subscriber);
      }
    });
  };

  private _delete = (subscriber: () => void) => {
    Object.keys(this.subscribers).forEach((accessor) => {
      if (this.isValidAccessor(accessor)) {
        this.subscribers[accessor] = this.subscribers[accessor].filter(
          (s) => s !== subscriber,
        );
      }
    });
  };

  private isValidAccessor(accessor: string): accessor is keyof Subscribers {
    return accessor in this.subscribers;
  }

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

  private getPublicDataAccessorsToDataMap = (state: State) =>
    ({
      route: state.nav.route,
      backRouteWithHistoryReplace: state.nav.backRouteWithHistoryReplace,
      trainings: state.trainings,
      completedTrainings: state.completedTrainings,
      activeTraining: state.activeTraining,
      newTraining: state.newTraining,
      newExercise: state.newExercise,
      auth: state.auth,
      sync: state.sync,
      notifications: state.notifications,
      uiBlockingLayer: state.uiBlockingLayer,
    }) as const;

  getStoreData = (publicDataAccessors: string[]): { [key: string]: any } => {
    validateDataAccessors(publicDataAccessors);

    const publicDataAccessorsToData = this.getPublicDataAccessorsToDataMap(
      this.state,
    );

    type DataKey = keyof typeof publicDataAccessorsToData;

    const dataAccessors = Object.keys(publicDataAccessorsToData);
    validateDataAccessors(dataAccessors);
    validateAllDataAccessorsDeclared(dataAccessors);

    const data = publicDataAccessors.reduce<{ [key: string]: any }>(
      (acc, prop) => {
        acc[prop] = publicDataAccessorsToData[prop as DataKey];
        return acc;
      },
      {},
    );

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

  get completedTrainings(): CompletedTraining[] {
    return this.state.completedTrainings;
  }

  get notifications(): Notification[] {
    return this.state.notifications;
  }

  get activeTraining(): ActiveTraining | null {
    return this.state.activeTraining;
  }

  get newTraining(): Training | null {
    return this.state.newTraining;
  }

  get newExercise(): Exercise | null {
    return this.state.newExercise;
  }

  get auth(): AuthState {
    return this.state.auth;
  }

  get sync(): SyncWithServer {
    return this.state.sync;
  }

  get uiBlockingLayer(): State['uiBlockingLayer'] {
    return this.state.uiBlockingLayer;
  }

  set auth(data: Partial<AuthState>) {
    const fn = (state: State): Partial<State> => ({
      auth: { ...state.auth, ...data } as AuthState,
    });
    this._updateStoreData(fn, ['auth']);
  }

  set sync(data: Partial<SyncWithServer>) {
    const fn = (state: State): Partial<State> => ({
      sync: { ...state.sync, ...data } as SyncWithServer,
    });
    this._updateStoreData(fn, ['sync']);
  }

  set route(data: string | undefined) {
    const fn = (state: State) => ({
      nav: {
        ...state.nav,
        route: data,
      },
    });

    this._updateStoreData(fn, ['route']);
  }

  set backRouteWithHistoryReplace(data: string | undefined) {
    const fn = (state: State) => ({
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

  set completedTrainings(data: CompletedTraining[]) {
    const fn = () => ({
      completedTrainings: data,
    });

    this._updateStoreData(fn, ['completedTrainings']);
  }

  set activeTraining(data) {
    const fn = () => ({
      activeTraining: data,
    });

    this._updateStoreData(fn, ['activeTraining']);
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

  set notifications(data: Notification[]) {
    const fn = () => ({ notifications: data });
    this._updateStoreData(fn, ['notifications']);
  }

  set uiBlockingLayer(data: State['uiBlockingLayer']) {
    const fn = (state: State) => ({
      uiBlockingLayer: {
        ...state.uiBlockingLayer,
        ...data,
      },
    });
    this._updateStoreData(fn, ['uiBlockingLayer']);
  }
}

const allPublicDataAccessors = [
  'route',
  'backRouteWithHistoryReplace',
  'trainings',
  'completedTrainings',
  'activeTraining',
  'newTraining',
  'newExercise',
  'auth',
  'sync',
  'notifications',
  'uiBlockingLayer',
];

function validateDataAccessors(publicDataAccessors: string[]): void {
  if (!doesDataAccessorsExist(publicDataAccessors)) {
    throw new Error('Public Data Accessors were not specified!');
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
  return allPublicDataAccessors.every((key) =>
    publicDataAccessors.includes(key),
  );
}

function areValidDataAccessors(publicDataAccessors: string[]): boolean {
  return publicDataAccessors.every((key) =>
    allPublicDataAccessors.includes(key),
  );
}

function doesDataAccessorsExist(publicDataAccessors: string[]): boolean {
  if (!Array.isArray(publicDataAccessors) || !publicDataAccessors.length) {
    return false;
  }
  return true;
}
