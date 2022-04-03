export const controller = (serviceLocator) => {
  const { navigationApi } = serviceLocator.getAPIs();
  const { getStoreData } = serviceLocator.getStore();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getRoute: () => getData().route,
    // TODO add `replace` mechanism
    isReplace: () => false,
    onNavigateFinish: () => {
      navigationApi.resetRoute();
    },
  };
};

controller.storeDataAccessors = ['route'];
