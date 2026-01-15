import { AppContext } from '../../types';
import { Training } from '../../model/types';
import { Controller } from '../../utils/HOCs/types';

interface ControllerType {
  getTraining: () => Training;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onEditExercise: (exerciseId: string) => void;
}

export const controller: Controller<ControllerType> = (
  serviceLocator: AppContext['serviceLocator'],
) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () =>
    navigationApi.getPathParams(navigationApi.routes.editTraining);

  return {
    getTraining: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(
        (training: Training) => training.id === params.training,
      );
      return training;
    },
    onSave: async () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(
        (training: Training) => training.id === params.training,
      );

      if (training) {
        await navigationApi.toTraining(training.id);
      } else {
        await navigationApi.toTrainings();
      }
    },
    onNoData: () => {
      void navigationApi.toTrainings();
    },
    onChangeName: (name: string) => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(
        (training: Training) => training.id === params.training,
      );

      if (training) {
        trainingsApi.update.training(training.id, { name });
      }
    },
    onAddExercise: async () => {
      const params = getParams();
      trainingsApi.create.newExercise();

      const newExerciseId = getData().newExercise?.id;

      if (params.training && newExerciseId) {
        await navigationApi.toCreateExercise(params.training, newExerciseId, {
          goBackTo: navigationApi.routes.editTraining,
        });
      }
    },
    onDeleteExercise: (trainingId: string, exerciseId: string) => {
      trainingsApi.delete.exercise(trainingId, exerciseId);
    },
    onEditExercise: async (exerciseId: string) => {
      const params = getParams();

      if (params.training) {
        await navigationApi.toEditExistingExercise(params.training, exerciseId);
      }
    },
    onDelete: async () => {
      const params = getParams();
      await navigationApi.toTrainings();

      if (params.training) {
        trainingsApi.delete.training(params.training);
      }
    },
  };
};

controller.storeDataAccessors = ['trainings', 'newExercise'];
