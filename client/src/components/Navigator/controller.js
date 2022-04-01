export const controller = (serviceLocator) => {
  const { navigationApi } = serviceLocator.getAPIs();
  const { getStoreData } = serviceLocator.getStore();

  return {
    getRoutes: () => navigationApi.routes,
    isHome: () => 
      getStoreData().route === navigationApi.storeRoutes.home,
    isTrainings: () =>
      getStoreData().route === navigationApi.storeRoutes.trainings,
    isMenu: () => 
      getStoreData().route === navigationApi.storeRoutes.menu,
    onNavigateFinish: () => {
      navigationApi.resetRoute();
    },
  };
};
