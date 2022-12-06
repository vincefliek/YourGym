export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.createExerciseForExistingTraining,
  );
  const toNumber = (value) => Number.parseInt(value, 10);

  return {
    getData: () => getData().newExercise,
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (name) => {
      trainingsApi.update.newExercise({
        name,
      });
    },
    onChangeRepetitions: (setId, value) => {
      const { sets } = getData().newExercise;

      trainingsApi.update.newExercise({
        sets: sets.map(set => {
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
    onChangeWeight: (setId, value) => {
      const { sets } = getData().newExercise;

      trainingsApi.update.newExercise({
        sets: sets.map(set => {
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
      const exerciseId = getData().newExercise.id;

      trainingsApi.create.set(trainingId, exerciseId);
    },
    onDeleteSet: (exerciseId, setId) => {
      const trainingId = getParams().training;

      trainingsApi.delete.set(trainingId, exerciseId, setId);
    },
    onDelete: async () => {
      await navigationApi.toCreateTraining();
      trainingsApi.delete.newExercise();
    },
    onSave: async () => {
      const trainingId = getParams().training;

      await navigationApi.toEditTraining(trainingId);
      trainingsApi.save.newExercise(trainingId);
    },
  };
};

controller.storeDataAccessors = ['newExercise'];
