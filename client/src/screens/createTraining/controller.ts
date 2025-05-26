import { AppContext } from '../../types';
import { Exercise, Training } from '../../model/types';

export const controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getData: () => {
      const newTraining = getData().newTraining;

      if (newTraining !== null) {
        return {
          ...newTraining,
          exercises: newTraining.exercises.map((exercise: Exercise) => ({
            ...exercise,
            setsPreview: trainingsApi.create.setsPreview(exercise.sets),
          })),
        };
      }
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (name: string) => {
      trainingsApi.update.newTraining({
        name,
      });
    },
    onAddExercise: () => {
      const trainingId = getData().newTraining?.id;
      if (trainingId) {
        trainingsApi.create.newExercise();
        navigationApi.toCreateExercise(trainingId);
      }
    },
    onDelete: async () => {
      await navigationApi.toTrainings();
      trainingsApi.delete.newTraining();
    },
    onSave: async () => {
      await navigationApi.toTrainings();
      trainingsApi.save.newTraining();
    },
    onDeleteExercise: (trainingId: string, exerciseId: string) => {
      trainingsApi.delete.exercise(trainingId, exerciseId);
    },
    onOpenExercise: (exerciseId: string) => {
      const trainingId = getData().newTraining?.id;
      if (trainingId) {
        navigationApi.toEditNewExercise(trainingId, exerciseId);
      }
    },
  };
};

controller.storeDataAccessors = ['newTraining'];
