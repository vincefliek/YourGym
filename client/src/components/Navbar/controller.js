export const controller = (serviceLocator) => {
  const { navigationApi } = serviceLocator.getAPIs();

  return {
    onHomeClick: () => {
      navigationApi.toHome();
    },
    onTrainingsClick: () => {
      navigationApi.toTrainings();
    },
    onBurgerClick: () => {
      navigationApi.toMenu();
    },
    isHomeActive: () => navigationApi.isHomeUrl(),
    isTrainingsActive: () => navigationApi.isTrainingsUrl(),
    isBurgerActive: () => navigationApi.isMenuUrl(),
  };
};

controller.storeDataAccessors = [];
