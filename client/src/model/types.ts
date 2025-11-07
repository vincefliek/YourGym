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
      backRouteWithHistoryReplace: string | undefined;
    };
    trainings: Training[];
    newTraining: Training | null;
    newExercise: Exercise | null;
  };
  subscribers: {
    route: Array<() => void>;
    backRouteWithHistoryReplace: Array<() => void>;
    trainings: Array<() => void>;
    newTraining: Array<() => void>;
    newExercise: Array<() => void>;
  };
  getStoreData: (publicDataAccessors: string[]) => { [key: string]: any };
  subscribe: (subscriber: () => void, publicDataAccessors: string[]) => () => void;
  get route(): string | undefined;
  set route(value: string | undefined);
  get backRouteWithHistoryReplace(): string | undefined;
  set backRouteWithHistoryReplace(value: string | undefined);
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

export interface NavigationApi {
  routes: {
    home: string;
    trainings: string;
    menu: string;
    createTraining: string;
    createExercise: string;
    editNewExercise: string;
    editExistingExercise: string;
    openTraining: string;
    openExercise: string;
    editTraining: string;
  };
  goBack: () => void;
  setBackRouteWithReplace: (
    route: string | undefined,
  ) => void;
  resetRoute: () => void;
  toTrainings: () => Promise<unknown>;
  toHome: () => Promise<unknown>;
  toMenu: () => Promise<unknown>;
  toCreateTraining: () => Promise<unknown>;
  toCreateExercise: (trainingId: string) => Promise<unknown>;
  toEditNewExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
  toEditExistingExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
  toTraining: (trainingId: string) => Promise<unknown>;
  toExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
  toEditTraining: (trainingId: string) => Promise<unknown>;
  isHomeUrl: () => boolean;
  isTrainingsUrl: () => boolean;
  isMenuUrl: () => boolean;
  getPathParams: (route: string) => { [key: string]: string | undefined };
}

export interface TrainingsApi {
  create: {
    newTraining: () => void;
    newExercise: () => void;
    set: (trainingId: string, exerciseId: string) => void;
    setsHistory: (trainingId: string, exerciseId: string, set: Set) => Promise<void>;
    setsPreview: (sets: Set[]) => string;
  };
  update: {
    newTraining: (input: Partial<Training>) => void;
    newExercise: (input: Partial<Exercise>) => void;
    training: (trainingId: string, input: Partial<Training>) => void;
    exercise: (trainingId: string, exerciseId: string, input: Partial<Exercise>) => void;
    allTrainings: (trainings: Training[]) => void;
  };
  delete: {
    newTraining: () => void;
    newExercise: () => void;
    training: (id: string) => void;
    exercise: (trainingId: string, exerciseId: string) => void;
    set: (trainingId: string, exerciseId: string, setId: string) => void;
  };
  save: {
    newTraining: () => void;
    newExercise: (trainingId: string) => void;
  };
}
