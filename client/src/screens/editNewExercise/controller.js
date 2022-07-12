export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.editNewExercise,
  );
  const toNumber = (value) => Number.parseInt(value, 10);

  return {
    getExercise: () => {
      const exerciseId = getParams().exercise;
      const exercise = getData().newTraining?.exercises.find(exercise =>
        exercise.id === exerciseId);;

      return exercise;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (exerciseId, name) => {
      const { exercises } = getData().newTraining;

      trainingsApi.update.newTraining({
        exercises: exercises.map(exercise => {
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
    onChangeRepetitions: (exercise, setId, value) => {
      const { exercises } = getData().newTraining;
      const { sets } = exercise;

      trainingsApi.update.newTraining({
        exercises: exercises.map(ex => {
          if (ex.id === exercise.id) {
            return {
              ...ex,
              sets: sets.map(set => {
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
    onChangeWeight: (exercise, setId, value) => {
      const { exercises } = getData().newTraining;
      const { sets } = exercise;

      trainingsApi.update.newTraining({
        exercises: exercises.map(ex => {
          if (ex.id === exercise.id) {
            return {
              ...ex,
              sets: sets.map(set => {
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

      trainingsApi.create.set(trainingId, exerciseId);
    },
    onDeleteSet: (exerciseId, setId) => {
      const trainingId = getParams().training;

      trainingsApi.delete.set(trainingId, exerciseId, setId);
    },
    onDelete: async () => {
      const trainingId = getParams().training;
      const exerciseId = getParams().exercise;

      await trainingsApi.delete.exercise(trainingId, exerciseId);
      navigationApi.toCreateTraining();
    },
    onSave:  () => {
      navigationApi.toCreateTraining();
    },
  };
};

controller.storeDataAccessors = ['newTraining'];
