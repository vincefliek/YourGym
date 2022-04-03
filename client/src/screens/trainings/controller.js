export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getTrainings: () => getData().trainings,
    onAddTraining: () => {},
  };
};

controller.storeDataAccessors = ['trainings'];
