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

  return {
    getTraining: () => findTraining(),
    getExercise: () => {
      const params = getParams();
      const training = findTraining();
      const exercise = training?.exercises.find(exercise =>
        exercise.id === params.exercise);
      // console.log("params.training: ", params.training);
      // console.log("params.exercise: ", params.exercise);

      // console.log('🚀dataId', exercise?.id);
      // return training.exercises[training.exerciseIndex];
      return exercise;
    },
    onDoneSet: async (exerciseId, set) => {
      const trainingId = findTraining().id;
      const trainings = getData().trainings.map(training => {
        if (training.id === trainingId) {
          return {
            ...training,
            exercises: training.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  setsHistory: exercise.setsHistory.concat(set),
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
    onExerciseNext: async (training) => {
      if (training.exerciseIndex < (training.exercises.length - 1)) {
        const trainings = getData().trainings.map(tr => {
          if (tr.id === training.id) {
            return {
              ...tr,
              exerciseIndex: tr.exerciseIndex + 1,
            };
          }

          return tr;
        });

        console.log('"exerciseIndex:"', training.exerciseIndex + 1);
        trainingsApi.update.allTrainings(trainings);
        const exerciseId = training.exercises[training.exerciseIndex + 1].id;
        console.log('🚀 ===id: ', exerciseId);

        await navigationApi.toTraining(training.id);
        navigationApi.toExercise(training.id, exerciseId);
      }


    },
    onExercisePrev: (training) => {
      if (training.exerciseIndex >= 1) {
        const trainings = getData().trainings.map(tr => {
          if (tr.id === training.id) {
            return {
              ...tr,
              exerciseIndex: tr.exerciseIndex - 1,
            };
          }

          return tr;
        });

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
