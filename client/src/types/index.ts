import { Store } from '../model/store';
import { Validator } from '../model/validation';
import { Exercise, Training, Set } from '../model/types';

export interface AppAPIs {
  navigationApi: {
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
    };
    resetRoute: () => void;
    toTrainings: () => void;
    toHome: () => void;
    toMenu: () => void;
    toCreateTraining: () => void;
    toCreateExercise: (trainingId: string) => Promise<unknown>;
    toEditNewExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
    toEditExistingExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
    toTraining: (trainingId: string) => Promise<unknown>;
    toExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
    isHomeUrl: () => boolean;
    isTrainingsUrl: () => boolean;
    isMenuUrl: () => boolean;
    getPathParams: (route: string) => { [key: string]: string };
  };
  trainingsApi: {
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
  };
}

export interface AppContext {
  serviceLocator: {
    getStore: () => {
      getStoreData: Store['getStoreData'];
      subscribe: Store['subscribe'];
    };
    getAPIs: () => AppAPIs;
  };
}

export interface AppState {}

export interface AppProps {}
