export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.editExercise,
  );
  const toNumber = (value) => Number.parseInt(value, 10);

  return {
    getExercise: () => {
      const exercises = getData().newTraining.exercises;
      const exercise = exercises.find(exercise => 
        exercise.id === getParams().exercise);

      return exercise;
    },
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
      const exerciseId = getParams().exercise;

      trainingsApi.create.set(trainingId, exerciseId);
    },
    onDeleteSet: (setId) => {
      trainingsApi.delete.set(setId);
    },
    onDelete: async () => {
      await navigationApi.toCreateTraining();
      // trainingsApi.delete.exercise(getParams().training, getParams().exercise);
    },
    onSave: async () => {
      const trainingId = getParams().training;

      await navigationApi.toCreateTraining();
      // trainingsApi.save.newExercise(trainingId);
    },
  };
};

controller.storeDataAccessors = ['newTraining'];
