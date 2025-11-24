import { AppContext } from '../../types';
import { Training } from '../../model/types';

export const controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const {
    navigationApi,
    trainingsApi,
  } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getById = (id: string) =>
    getData().trainings.find((it: Training) => it.id === id);

  return {
    getTrainings: () => {
      return getData().trainings;
    },
    onAddTraining: () => {
      trainingsApi.create.newTraining();
      navigationApi.toCreateTraining();
    },
    onDeleteTraining: (id: string) => {
      const training = getById(id);

      if (!training) {
        throw new Error(`Training with ID "${id}" doesn't exist!`);
      }

      const result = window.confirm(
        `Do you really want to delete "${training.name}"?`,
      );

      if (result) {
        trainingsApi.delete.training(id);
      }
    },
    onOpenTraining: (trainingId: string) => {
      navigationApi.toTraining(trainingId);
    },
  };
};

controller.storeDataAccessors = ['trainings'];
