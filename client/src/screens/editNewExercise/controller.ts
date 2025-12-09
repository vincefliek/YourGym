import toNumber from 'lodash/toNumber';

import { AppContext } from '../../types';
import { Exercise, Set } from '../../model/types';

export const controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.editNewExercise,
  );

  return {
    getExercise: () => {
      const exerciseId = getParams().exercise;
      const exercise = getData().newTraining?.exercises.find(
        (exercise: Exercise) => exercise.id === exerciseId,
      );

      return exercise;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (exerciseId: string, name: string) => {
      const { exercises } = getData().newTraining;

      trainingsApi.update.newTraining({
        exercises: exercises.map((exercise: Exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              name,
            };
          }
          return exercise;
        }),
      });
    },
    onChangeRepetitions: (exercise: Exercise, setId: string, value: string) => {
      const { exercises } = getData().newTraining;
      const { sets } = exercise;

      trainingsApi.update.newTraining({
        exercises: exercises.map((ex: Exercise) => {
          if (ex.id === exercise.id) {
            return {
              ...ex,
              sets: sets.map((set: Set) => {
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
          return ex;
        }),
      });
    },
    onChangeWeight: (exercise: Exercise, setId: string, value: string) => {
      const { exercises } = getData().newTraining;
      const { sets } = exercise;

      trainingsApi.update.newTraining({
        exercises: exercises.map((ex: Exercise) => {
          if (ex.id === exercise.id) {
            return {
              ...ex,
              sets: sets.map((set: Set) => {
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
          return ex;
        }),
      });
    },
    onAddSet: () => {
      const trainingId = getParams().training;
      const exerciseId = getParams().exercise;

      if (trainingId && exerciseId) {
        trainingsApi.create.set(trainingId, exerciseId);
      }
    },
    onDeleteSet: (exerciseId: string, setId: string) => {
      const trainingId = getParams().training;

      if (trainingId) {
        trainingsApi.delete.set(trainingId, exerciseId, setId);
      }
    },
    onDelete: () => {
      const trainingId = getParams().training;
      const exerciseId = getParams().exercise;

      if (trainingId && exerciseId) {
        trainingsApi.delete.exercise(trainingId, exerciseId);
      }
      navigationApi.toCreateTraining();
    },
    onSave: () => {
      navigationApi.toCreateTraining();
    },
  };
};

controller.storeDataAccessors = ['newTraining'];
