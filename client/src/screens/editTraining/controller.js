export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.editTraining,
  );

  return {
    getTraining: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(training =>
        training.id === params.training);

      // if (newTraining !== null) {
      //   return {
      //     ...newTraining,
      //     exercises: newTraining.exercises.map(exercise => ({
      //       ...exercise,
      //       setsPreview: trainingsApi.create.setsPreview(exercise.sets),
      //     })),
      //   };
      // }

      return training;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (trainingId, name) => {
      const trainings = getData().trainings.map(training => {
        if (training.id ===trainingId) {
          return {
            ...training,
            name,
          };
        }

        return training;
      });

      trainingsApi.update.allTrainings(trainings);
    },
    onDeleteExercise: (trainingId, exerciseId) => {
      trainingsApi.delete.exercise(trainingId, exerciseId);
    },
    onOpenExercise: (exerciseId) => {
      // const trainingId = getData().newTraining.id;

      // navigationApi.toEditNewExercise(trainingId, exerciseId);
    },
    onAddExercise: () => {
      // const trainingId = getParams().training;

      // trainingsApi.create.newExercise();
      // navigationApi.toCreateExercise(trainingId);
    },
    onDelete: async (trainingId) => {
      await navigationApi.toTrainings();
      trainingsApi.delete.training(trainingId);
    },
    onSave: (trainingId) => {
      navigationApi.toTraining(trainingId);
    },
  };
};

controller.storeDataAccessors = ['trainings'];
