export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.openTraining,
  );

  return {
    getTraining: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(training =>
        training.id === params.training);

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
    onStart: () => {
      window.alert('You will be able to preview very soon :)');
    },
    onBack: () => {
      navigationApi.toTrainings();
    },
    onEdit: () => {
      window.alert('You will be able to preview very soon :)');
    },
    onOpenExercise: (training, exercise) => {
      navigationApi.toExercise(training.id, exercise.id);
    },
  };
};

controller.storeDataAccessors = ['trainings'];
