export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.editTraining,
  );

  return {
    getTraining: () => {
      const trainingId = getParams().training;
      const training = getData().trainings.find(training =>
        training.id === trainingId);

      if (training !== undefined) {
        training.exercises = training.exercises.map(exercise => ({
          ...exercise,
          setsPreview: trainingsApi.create.setsPreview(exercise.sets),
        }));
      }

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
      const trainingId = getParams().training;

      navigationApi.toEditExistingExercise(trainingId, exerciseId);
    },
    onAddExercise: () => {
      const trainingId = getParams().training;

      trainingsApi.create.newExercise();
      navigationApi.toCreateExerciseForExistingTraining(trainingId);
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
