import { navigationApi } from '../../apis';

export const controller = (getStoreData, props) => {
  return {
    isHome: () => getStoreData().route === navigationApi.routes.home,
    isTrainings: () => getStoreData().route === navigationApi.routes.trainings,
    onNavigateFinish: () => {
      navigationApi.resetRoute();
    }
  };
};
