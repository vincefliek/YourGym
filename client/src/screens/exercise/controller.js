export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.openExercise,
  );
  const findTraining = () => {
    const params = getParams();
    const trainings = getData().trainings;
    const training = trainings.find(training =>
      training.id === params.training);

    return training;
  };
  const toNumber = (value) => Number.parseInt(value, 10);

  return {
    getTraining: () => findTraining(),
    getExercise: () => {
      const params = getParams();
      const training = findTraining();
      const exercise = training?.exercises.find(exercise =>
        exercise.id === params.exercise);

      return exercise;
    },
    getHash: (trainingId, exerciseId) => {
      return`/trainings/${trainingId}/${exerciseId}`;
    },
    getCurrentExerciseIntoNavbar: (training, exercise) => {
      return training.exercises.indexOf(exercise) + 1;
    },
    onChangeRepetitions: (exerciseId, setId, value) => {
      const trainingId = findTraining().id;

      const trainings = getData().trainings.map(training => {
        if (training.id === trainingId) {
          return {
            ...training,
            exercises: training.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
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

              return exercise;
            }),
          };
        }

        return training;
      });

      trainingsApi.update.allTrainings(trainings);
    },
    onChangeWeight: (exerciseId, setId, value) => {
      const trainingId = findTraining().id;

      const trainings = getData().trainings.map(training => {
        if (training.id === trainingId) {
          return {
            ...training,
            exercises: training.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
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

              return exercise;
            }),
          };
        }

        return training;
      });

      trainingsApi.update.allTrainings(trainings);
    },
    onDoneSet: async (trainingId, exerciseId, set) => {
      await trainingsApi.create.setsHistory(trainingId, exerciseId, set);
      trainingsApi.delete.set(trainingId, exerciseId, set.id);
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onBack: () => {
      const trainingId = getParams().training;

      navigationApi.toTraining(trainingId);
    },
  };
};

controller.storeDataAccessors = ['trainings'];
