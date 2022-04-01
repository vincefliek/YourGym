export const controller = (serviceLocator, props) => {
  const { navigationApi } = serviceLocator.getAPIs();
  const { getStoreData } = serviceLocator.getStore();

  return {
    getRoutes: () => navigationApi.routes,
    isHome: () => 
      getStoreData().route === navigationApi.storeRoutes.home,
    isTrainings: () =>
      getStoreData().route === navigationApi.storeRoutes.trainings,
    isBurger: () => 
      getStoreData().route === navigationApi.storeRoutes.burger,
    onNavigateFinish: () => {
      navigationApi.resetRoute();
    },
  };
};
