import { matchPath } from 'react-router-dom';

export const createNavigationApi = (store) => {
  const routes = {
    home: '/',
    trainings: 'trainings',
    burger: 'burger',
  };

  const storeRoutes = {
    home: '/',
    trainings: '/trainings',
    burger: '/burger',
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
    toBurger: () => {
      store.route = storeRoutes.burger;
    },
    isHomeUrl: () => {
      return matchPath(routes.home, getPathName());
    },
    isTrainingsUrl: () => {
      return matchPath(routes.trainings, getPathName());
    },
    isBurgerUrl: () => {
      return matchPath(routes.burger, getPathName());
    },
  };
};
