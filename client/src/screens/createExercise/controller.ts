import { AppContext } from '../../types';
import { Set } from '../../model/types';

export const controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.createExercise,
  );
  const toNumber = (value: string) => Number.parseInt(value, 10);

  return {
    getData: () => getData().newExercise,
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (name: string) => {
      trainingsApi.update.newExercise({
        name,
      });
    },
    onChangeRepetitions: (setId: string, value: string) => {
      const { sets } = getData().newExercise;

      trainingsApi.update.newExercise({
        sets: sets.map((set: Set) => {
          if (set.id === setId) {
            return {
              ...set,
              repetitions: toNumber(value),
            };
          }
          return set;
        }),
      });
    },
    onChangeWeight: (setId: string, value: string) => {
      const { sets } = getData().newExercise;

      trainingsApi.update.newExercise({
        sets: sets.map((set: Set) => {
          if (set.id === setId) {
            return {
              ...set,
              weight: toNumber(value),
            };
          }
          return set;
        }),
      });
    },
    onAddSet: () => {
      const trainingId = getParams().training;
      const exerciseId = getData().newExercise?.id;

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
    onDelete: async () => {
      await navigationApi.goBack();
      trainingsApi.delete.newExercise();
    },
    onSave: async () => {
      const trainingId = getParams().training;

      await navigationApi.goBack();

      if (trainingId) {
        trainingsApi.save.newExercise(trainingId);
      }
    },
  };
};

controller.storeDataAccessors = ['newExercise'];
