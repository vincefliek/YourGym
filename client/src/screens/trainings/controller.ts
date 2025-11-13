import { AppContext } from '../../types';
import { Training } from '../../model/types';

export const controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi, httpClientAPI } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getById = (id: string) => getData().trainings.find((it: Training) => it.id === id);

  return {
    getTrainings: () => {
      return getData().trainings;
    },
    getTemplateTrainings: async () => {
      // TODO it's a temp code, should be moved into `trainingsApi`
      try {
        const data = await httpClientAPI.get<any[]>('/api/template-workouts');
        console.log('>>> getTemplateTrainings', data);
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    createNewTemplateTraining: async () => {
      // TODO it's a temp code, should be moved into `trainingsApi`
      try {
        const data = await httpClientAPI.post<any>('/api/template-workouts', {
          name: `Unique - ${Date.now()}`,
        });
        console.log('>>> createNewTemplateTraining', data);
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
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
