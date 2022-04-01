export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();

  return {
    getTrainings: () => getStoreData().trainings,
    onAddTraining: () => {},
  };
};
