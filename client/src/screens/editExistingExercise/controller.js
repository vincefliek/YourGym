export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.editExistingExercise,
  );
  const toNumber = (value) => Number.parseInt(value, 10);
  const changeValue = (repetitions, sets, setId, value) => {
    sets.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          repetitions: toNumber(value),
        };
      }
      return set;
    })
  };

  return {
    getExercise: () => { 
      const exerciseId = getParams().exercise;
      const exercises = getData().newTraining.exercises;

      const exercise = exercises.find(exercise => 
        exercise.id === exerciseId);

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
              sets: changeValue('repetitions', sets, setId, value),
            };
          }
          return ex;
        }),
      });
    },

    /**
     * 
     * sets: sets.map(set => {
     * if (set.id === setId) {
     *   return {
     *     ...set,
     *     weight: toNumber(value),
     *   };
     * }
     * return set; 
     * 
     * this code must will moved in separate function (if its not impossible)
     * 
     * [trainingsApi] fix addSet 121 - 128
     *  
     * 
     */

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
      trainingsApi.delete.set(exerciseId, setId);
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
