import { Controller } from '../../types';
import { Training } from '../../model/types';
import { ControllerReturnType } from './types';

export const controller: Controller<ControllerReturnType> = (
  serviceLocator,
) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () =>
    navigationApi.getPathParams(navigationApi.routes.editTraining);
  const findTraining = (): Training | undefined => {
    const params = getParams();
    const trainings = getData().trainings;
    const training = trainings.find(
      (training: Training) => training.id === params.training,
    );

    return training;
  };

  return {
    getTraining: () => {
      return findTraining();
    },
    onSave: async () => {
      const training = findTraining();

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
      const training = findTraining();

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
    onReorderExercises: (trainingId, reorderedExercises) => {
      trainingsApi.update.exercisesOrder(trainingId, reorderedExercises);
    },
  };
};

controller.storeDataAccessors = ['trainings', 'newExercise'];
