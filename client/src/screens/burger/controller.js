export const controller = (serviceLocator, props) => {
  const { navigationApi } = serviceLocator.getAPIs();

  return {
    goToTraining: () => {
      navigationApi.toTrainings();
    },
  };
};
