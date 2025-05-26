import { Validator } from 'jsonschema';

export interface Set {
  id: string;
  repetitions: number;
  weight: number;
  time?: string;
}

export interface SetsByDate {
  id: string;
  date: string;
  sets: Set[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  setsHistory: SetsByDate[];
  setsPreview?: string;
}

export interface Training {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Store {
  state: {
    nav: {
      route: string | undefined;
    };
    trainings: Training[];
    newTraining: Training | null;
    newExercise: Exercise | null;
  };
  subscribers: {
    route: Array<() => void>;
    trainings: Array<() => void>;
    newTraining: Array<() => void>;
    newExercise: Array<() => void>;
  };
  getStoreData: (publicDataAccessors: string[]) => { [key: string]: any };
  subscribe: (subscriber: () => void, publicDataAccessors: string[]) => () => void;
  get route(): string | undefined;
  set route(value: string | undefined);
  get trainings(): Training[];
  set trainings(value: Training[]);
  get newTraining(): Training | null;
  set newTraining(value: Training | null);
  get newExercise(): Exercise | null;
  set newExercise(value: Exercise | null);
  _updateStoreData: (fn: (state: Store['state']) => Partial<Store['state']>, dataAccessorsToNotify: string[]) => void;
  _notify: (dataAccessorsToNotify: string[]) => void;
  _subscribe: (subscriber: () => void, publicDataAccessors: string[]) => void;
  _delete: (subscriber: () => void) => void;
}

export interface ApiTools {
  store: Store;
  validator: Validator;
}
