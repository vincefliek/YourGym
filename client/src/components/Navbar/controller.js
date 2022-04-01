export const controller = (serviceLocator, props) => {
  const { navigationApi } = serviceLocator.getAPIs();

  return {
    onHomeClick: () => {
      navigationApi.toHome();
    },
    onTrainingsClick: () => {
      navigationApi.toTrainings();
    },
    onBurgerClick: () => {
      navigationApi.toBurger();
    },
    isHomeActive: () => navigationApi.isHomeUrl(),
    isTrainingsActive: () => navigationApi.isTrainingsUrl(),
    isBurgerActive: () => navigationApi.isBurgerUrl(),
  };
};
