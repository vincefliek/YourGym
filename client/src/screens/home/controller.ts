import {
  CompletedSet,
  CompletedTraining,
  TimestampTZ,
} from '../../model/types';
import { AppContext } from '../../types';
import { HomeController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): HomeController => {
  const { authApi, trainingsApi, notificationsApi } = serviceLocator.getAPIs();
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
    signin: async (email: string, password: string) => {
      try {
        await authApi.signin(email, password);
      } catch (e: any) {
        notificationsApi.addNotification({
          type: 'error',
          message: e.message || 'Sigin failed. Double check your credentials!',
        });
      }
    },
    signup: async (email: string, password: string) => {
      try {
        await authApi.signup(email, password);
      } catch (e: any) {
        notificationsApi.addNotification({
          type: 'error',
          message: e.message || 'Signup failed. Double check your credentials!',
        });
      }
    },
    getCompletedTrainings: () => {
      return getStoreData().completedTrainings.sort(
        (trA: CompletedTraining, trB: CompletedTraining) =>
          new Date(trB.timestamptz).getTime()
          - new Date(trA.timestamptz).getTime(),
      );
    },
    onDeleteCompletedTraining: async (trainingId) => {
      const training = getById(trainingId);

      if (!training) {
        throw new Error(`Training with ID "${trainingId}" doesn't exist!`);
      }

      const result = window.confirm(
        `Do you really want to delete "${training.name}"?`,
      );

      if (result) {
        await trainingsApi.delete.completedTraining(training.id);
      }
    },
    getDateAndTime: (timestamptz: TimestampTZ) => {
      return {
        date: trainingsApi.create.datePreview(timestamptz),
        time: trainingsApi.create.timePreview(timestamptz),
      };
    },
    createSetsPreview: (sets: CompletedSet[]) => {
      return trainingsApi.create.setsPreview(sets.map(set => ({
        ...set,
        done: true,
      })));
    },
  };
};

controller.storeDataAccessors = ['auth', 'completedTrainings'] as string[];
