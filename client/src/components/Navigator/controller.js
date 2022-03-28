import { navigationApi } from '../../apis';

export const controller = (getStoreData, props) => {
  return {
    getRoutes: () => navigationApi.routes,
    isHome: () => getStoreData().route === navigationApi.storeRoutes.home,
    isTrainings: () => getStoreData().route === navigationApi.storeRoutes.trainings,
    onNavigateFinish: () => {
      navigationApi.resetRoute();
    }
  };
};
