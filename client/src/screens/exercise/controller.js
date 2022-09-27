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
    onDoneSet: async (exerciseId, set) => {
      const trainingId = findTraining().id;
      const date = new Date();
      const currentDate =
        date.toDateString().slice(0, 3) + ', ' +
        date.toLocaleDateString();

      const currentHours =
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      const currentMinutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      const currentTime = `${currentHours}:${currentMinutes}`;

      const addSetToHistory = (setsHistory) => {
        const setsByCurrentDate = setsHistory.find(
          setsByDate => setsByDate.date === currentDate,
        );

        set.time = currentTime;

        if (setsByCurrentDate) {
          return setsHistory.map(setsByDate => {
            if (setsByDate.date === currentDate) {
              return {
                ...setsByDate,
                sets: [set].concat(setsByDate.sets),
              };
            }

            return setsByDate;
          });
        }
        return [{
          date: currentDate,
          sets: [set],
        }].concat(setsHistory);
      };

      const trainings = getData().trainings.map(training => {
        if (training.id === trainingId) {
          return {
            ...training,
            exercises: training.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  setsHistory: addSetToHistory(exercise.setsHistory),
                };
              }

              return exercise;
            }),
          };
        }

        return training;
      });

      await trainingsApi.update.allTrainings(trainings);
      trainingsApi.delete.set(trainingId, exerciseId, set.id);
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
  };
};

controller.storeDataAccessors = ['trainings'];
