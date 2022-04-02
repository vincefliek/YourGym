export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getData: () => getData().newTraining,
    onLoad: () => {
      trainingsApi.createNew();
    },
    onChangeName: (name) => {
      trainingsApi.updateNew({ name });
    },
    onAddExercise: () => {},
    isLoading: () => !getData().newTraining,
  };
};

controller.storeDataAccessors = ['newTraining'];
