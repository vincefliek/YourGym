export const controller = (serviceLocator, props) => {
  const { getStoreData } = serviceLocator.getStore();

  return {
    getTrainings: () => getStoreData().trainings,
    onAddTraining: () => {},
  };
};
