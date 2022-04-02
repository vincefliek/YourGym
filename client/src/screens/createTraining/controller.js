export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

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
    onDelete: () => {
      trainingsApi.deleteNew();
      navigationApi.toTrainings();
    },
    onSave: () => {
      trainingsApi.saveNew();
      navigationApi.toTrainings();
    },
    isLoading: () => !getData().newTraining,
  };
};

controller.storeDataAccessors = ['newTraining'];
