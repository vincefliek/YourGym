export const controller = (serviceLocator) => {
  const { navigationApi } = serviceLocator.getAPIs();
  const { getStoreData } = serviceLocator.getStore();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getRoutes: () => navigationApi.routes,
    isHome: () => getData().route === navigationApi.storeRoutes.home,
    isTrainings: () =>
      getData().route === navigationApi.storeRoutes.trainings,
    isCreateTraining: () =>
      getData().route === navigationApi.storeRoutes.createTraining,
    onNavigateFinish: () => {
      navigationApi.resetRoute();
    },
  };
};

controller.storeDataAccessors = ['route'];
