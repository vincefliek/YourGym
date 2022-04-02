export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getTrainings: () => getData().trainings,
    onAddTraining: () => {
      navigationApi.toCreateTraining();
    },
  };
};

controller.storeDataAccessors = ['trainings'];
