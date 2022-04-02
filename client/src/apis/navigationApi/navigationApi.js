import { matchPath } from 'react-router-dom';

export const createNavigationApi = (store) => {
  const routes = {
    home: '/',
    trainings: '/trainings',
    createTraining: '/trainings/new',
  };

  const storeRoutes = {
    home: '/',
    trainings: '/trainings',
    createTraining: '/trainings/new',
  };

  /**
   * Handles URL with and without hash like:
   * - `/#/`
   * - `#/`
   * - `/`
   */
  const getPathName = () => window.location.hash.slice(1) || routes.home;

  const getData = () => store.getStoreData(['route']);

  return {
    routes,
    storeRoutes,
    resetRoute: () => {
      if (getData().route !== undefined) {
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
    toCreateTraining: () => {
      store.route = storeRoutes.createTraining;
    },
    isHomeUrl: () => {
      return matchPath(routes.home, getPathName());
    },
    isTrainingsUrl: () => {
      return matchPath(routes.trainings, getPathName());
    },
  };
};
