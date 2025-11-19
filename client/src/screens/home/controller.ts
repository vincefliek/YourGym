import { CompletedTraining, TimestampTZ } from '../../model/types';
import { AppContext } from '../../types';
import { HomeController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): HomeController => {
  const { authApi, trainingsApi } = serviceLocator.getAPIs();
  const store = serviceLocator.getStore();

  const getStoreData = () => store.getStoreData(controller.storeDataAccessors);
  const getById = (id: string): CompletedTraining | undefined =>
    getStoreData()
      .completedTrainings
      .find((it: CompletedTraining) => it.id === id);

  return {
    isAuthenticated: () => {
      return getStoreData().auth.isAuthenticated;
    },
    signin: (email: string, password: string) => {
      authApi.signin(email, password);
    },
    signup: (email: string, password: string) => {
      authApi.signup(email, password);
    },
    signout: () => {
      authApi.signout();
    },
    getCompletedTrainings: () => {
      return getStoreData().completedTrainings;
    },
    onDeleteCompletedTraining: (trainingId) => {
      const training = getById(trainingId);

      if (!training) {
        throw new Error(`Training with ID "${trainingId}" doesn't exist!`);
      }

      const result = window.confirm(
        `Do you really want to delete "${training.name}"?`,
      );

      if (result) {
        trainingsApi.delete.completedTraining(training.id);
      }
    },
    getDateAndTime: (timestamptz: TimestampTZ) => {
      return {
        date: trainingsApi.create.datePreview(timestamptz),
        time: trainingsApi.create.timePreview(timestamptz),
      };
    },
  };
};

controller.storeDataAccessors = ['auth', 'completedTrainings'] as string[];
