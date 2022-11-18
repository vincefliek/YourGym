export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () =>
    navigationApi.getPathParams(navigationApi.routes.openExercise);
  const findTraining = () => {
    const params = getParams();
    const trainings = getData().trainings;
    const training = trainings.find(
      (training) => training.id === params.training,
    );

    return training;
  };
  const toNumber = (value) => Number.parseInt(value, 10);

  return {
    getTraining: () => findTraining(),
    getExercise: () => {
      const params = getParams();
      const training = findTraining();
      const exercise = training?.exercises.find(
        (exercise) => exercise.id === params.exercise,
      );

      return exercise;
    },
    getCurrentExerciseIntoNavbar: (training, exercise) => {
      return training.exercises.indexOf(exercise) + 1;
    },
    getTotalExercisesIntoNavbar: (training) => {
      return training.exercises.length;
    },
    onChangeRepetitions: (exerciseId, setId, value) => {
      const trainingId = findTraining().id;

      const trainings = getData().trainings.map((training) => {
        if (training.id === trainingId) {
          return {
            ...training,
            exercises: training.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map((set) => {
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

      const trainings = getData().trainings.map((training) => {
        if (training.id === trainingId) {
          return {
            ...training,
            exercises: training.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map((set) => {
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
    onDoneSet: async (training, exerciseId, set) => {
      if (!training.trainingActive) {
        trainingsApi.update.training(training.id, {
          trainingActive: true,
        });

        trainingsApi.create.stopwatch(training.id);
      }

      trainingsApi.update.training(training.id, {
        totalRepetitions: toNumber(training.totalRepetitions + set.repetitions),
        totalWeight:
          toNumber(training.totalWeight + (set.weight * set.repetitions)),
      });

      await trainingsApi.create.setsHistory(training.id, exerciseId, set);
      trainingsApi.delete.set(training.id, exerciseId, set.id);
    },
    onExerciseNext: async (training, exercise) => {
      const currentExerciseIndex = training.exercises.indexOf(exercise);

      if (currentExerciseIndex < training.exercises.length - 1) {
        const nextExerciseId = training.exercises[currentExerciseIndex + 1].id;

        await navigationApi.toExercise(training.id, nextExerciseId);
        const trainings = getData().trainings;
        trainingsApi.update.allTrainings(trainings);
      }
    },
    onExercisePrev: async (training, exercise) => {
      const currentExerciseIndex = training.exercises.indexOf(exercise);

      if (currentExerciseIndex > 0) {
        const prevExerciseId = training.exercises[currentExerciseIndex - 1].id;

        await navigationApi.toExercise(training.id, prevExerciseId);
        const trainings = getData().trainings;
        trainingsApi.update.allTrainings(trainings);
      }
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onBack: () => {
      const trainingId = getParams().training;

      navigationApi.toTraining(trainingId);
    },
    onStart: (trainingId) => {
      trainingsApi.update.training(trainingId, {
        trainingActive: true,
      });

      trainingsApi.create.stopwatch(trainingId);
    },
    onStopwatch: (training) => {
      const result = window.confirm(`Do you really want to finish training?`);

      if (result) {
        if (training.totalRepetitions === 0 && training.totalWeight === 0) {
          return trainingsApi.update.training(training.id, {
            trainingActive: false,
            trainingTime: '00:00',
          });
        }

        trainingsApi.update.training(training.id, {
          trainingActive: false,
        });

        navigationApi.toTrainingResults(training.id);
      }
    },
  };
};

controller.storeDataAccessors = ['trainings'];
