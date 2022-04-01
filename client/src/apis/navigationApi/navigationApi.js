import { matchPath } from 'react-router-dom';

export const createNavigationApi = (store) => {
  const routes = {
    home: '/',
    trainings: 'trainings',
    menu: 'menu',
  };

  const storeRoutes = {
    home: '/',
    trainings: '/trainings',
    menu: '/menu',
  };

  /**
   * Handles URL with and without hash like:
   * - `/#/`
   * - `#/`
   * - `/`
   */
  const getPathName = () => window.location.hash.slice(1) || routes.home;

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
    toMenu: () => {
      store.route = storeRoutes.menu;
    },
    isHomeUrl: () => {
      return matchPath(routes.home, getPathName());
    },
    isTrainingsUrl: () => {
      return matchPath(routes.trainings, getPathName());
    },
    isMenuUrl: () => {
      return matchPath(routes.menu, getPathName());
    },
  };
};
