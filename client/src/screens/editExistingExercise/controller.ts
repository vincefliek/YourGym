import { AppContext } from '../../types';
import { Exercise, Training, Set } from '../../model/types';

export const controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.editExistingExercise,
  );
  const toNumber = (value: string) => Number.parseInt(value, 10);

  return {
    getExercise: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);
      const exercise = training?.exercises.find((exercise: Exercise) =>
        exercise.id === params.exercise);

      return exercise;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (exerciseId: string, name: string) => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);

      if (training) {
        const exercises = training.exercises.map((exercise: Exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              name,
            };
          }
          return exercise;
        });

        trainingsApi.update.training(training.id, { exercises });
      }
    },
    onChangeRepetitions: (exercise: Exercise, setId: string, value: string) => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);

      if (training) {
        const exercises = training.exercises.map((e: Exercise) => {
          if (e.id === exercise.id) {
            return {
              ...e,
              sets: e.sets.map((set: Set) => {
                if (set.id === setId) {
                  return {
                    ...set,
                    repetitions: toNumber(value),
                  };
                }
                return set;
              }),
            };
          }
          return e;
        });

        trainingsApi.update.training(training.id, { exercises });
      }
    },
    onChangeWeight: (exercise: Exercise, setId: string, value: string) => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);

      if (training) {
        const exercises = training.exercises.map((e: Exercise) => {
          if (e.id === exercise.id) {
            return {
              ...e,
              sets: e.sets.map((set: Set) => {
                if (set.id === setId) {
                  return {
                    ...set,
                    weight: toNumber(value),
                  };
                }
                return set;
              }),
            };
          }
          return e;
        });

        trainingsApi.update.training(training.id, { exercises });
      }
    },
    onAddSet: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);
      const exercise = training?.exercises.find((exercise: Exercise) =>
        exercise.id === params.exercise);

      if (training && exercise) {
        trainingsApi.create.set(training.id, exercise.id);
      }
    },
    onDeleteSet: (exerciseId: string, setId: string) => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);

      if (training) {
        trainingsApi.delete.set(training.id, exerciseId, setId);
      }
    },
    onDelete: async () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find((training: Training) =>
        training.id === params.training);
      const exercise = training?.exercises.find((exercise: Exercise) =>
        exercise.id === params.exercise);

      await navigationApi.goBack();

      if (training && exercise) {
        trainingsApi.delete.exercise(training.id, exercise.id);
      }
    },
    onSave: async () => {
      await navigationApi.goBack();
    },
  };
};

controller.storeDataAccessors = ['trainings'];
