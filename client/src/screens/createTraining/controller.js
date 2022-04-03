export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getData: () => getData().newTraining,
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (name) => {
      trainingsApi.updateNew({
        name,
      });
    },
    onAddExercise: () => {
      window.alert('You will be able to preview very soon :)');
    },
    onDelete: () => {
      trainingsApi.deleteNew();
      navigationApi.toTrainings();
    },
    onSave: () => {
      trainingsApi.saveNew();
      navigationApi.toTrainings();
    },
  };
};

controller.storeDataAccessors = ['newTraining'];
