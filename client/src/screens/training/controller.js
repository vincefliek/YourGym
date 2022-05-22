export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.openTraining,
  );
  
  return {
    getTraining: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(training => training.id === params.training);
      return training;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onStart: () => {
      window.alert('You will be able to preview very soon :)');
    },
    onBack:  () => {
      navigationApi.toTrainings();
    },
    onEdit: async () => {
      window.alert('You will be able to preview very soon :)');
    },
    onOpenExercise: (exerciseId) => {
      window.alert('You will be able to preview very soon :)');
    },
  };
};

controller.storeDataAccessors = ['trainings'];
