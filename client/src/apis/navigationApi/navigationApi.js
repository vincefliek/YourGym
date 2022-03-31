import { matchPath } from 'react-router-dom';

export const createNavigationApi = (store) => {
  const routes = {
    home: '/',
    trainings: 'trainings',
  };

  const storeRoutes = {
    home: '/',
    trainings: '/trainings',
  };

  const getPathName = () => window.location.hash.slice(1);

  return {
    routes,
    storeRoutes,
    resetRoute: () => {
      if (store.getStoreData().route !== undefined) {
        store.route = undefined;
      }
    },
    goBack: () => {
      store.route = -1;
    },
    toHome: () => {
      store.route = storeRoutes.home;
    },
    toTrainings: () => {
      store.route = storeRoutes.trainings;
    },
    isHomeUrl: () => {
      return matchPath(routes.home, getPathName());
    },
    isTrainingsUrl: () => {
      return matchPath(routes.trainings, getPathName());
    },
  };
};
