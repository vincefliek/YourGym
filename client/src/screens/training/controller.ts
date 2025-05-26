import { AppContext } from '../../types';
import { Training, Exercise } from '../../model/types';
import { Controller } from '../../utils/HOCs/types';

export const controller: Controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.openTraining,
  );

  return {
    getTraining: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);

      if (training !== undefined) {
        training.exercises = training.exercises.map((exercise: Exercise) => ({
          ...exercise,
          setsPreview: trainingsApi.create.setsPreview(exercise.sets),
        }));
      }

      return training;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onStart: () => {
      window.alert('You will be able to preview very soon :)');
    },
    onBack: () => {
      navigationApi.toTrainings();
    },
    onEdit: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);

      if (training) {
        navigationApi.toEditExistingExercise(training.id, training.exercises[0].id);
      }
    },
    onOpenExercise: (training: Training, exercise: Exercise) => {
      navigationApi.toExercise(training.id, exercise.id);
    },
  };
};

controller.storeDataAccessors = ['trainings'];
