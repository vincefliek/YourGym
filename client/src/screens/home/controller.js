export const controller = (serviceLocator) => {
  const { navigationApi } = serviceLocator.getAPIs();

  return {
    goToTraining: () => {
      navigationApi.toTrainings();
    },
  };
};

controller.storeDataAccessors = [];
