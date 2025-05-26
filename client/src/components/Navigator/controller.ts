import { AppContext } from '../../types';
import { NavigatorController } from './types';

export const controller = (serviceLocator: AppContext['serviceLocator']): NavigatorController => {
  const { navigationApi } = serviceLocator.getAPIs();
  const { getStoreData } = serviceLocator.getStore();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getRoute: () => getData().route,
    isReplace: () => false,
    onNavigateFinish: () => {
      navigationApi.resetRoute();
    },
    storeDataAccessors: controller.storeDataAccessors,
  };
};

controller.storeDataAccessors = ['route'];
