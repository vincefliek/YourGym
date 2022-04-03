import { matchPath } from 'react-router-dom';

export const createNavigationApi = ({ store }) => {
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

  const isRouteOpenedRightNow = (route) =>
    Boolean(matchPath(route, getPathName()));

  const setRoute = (route) => {
    if (isRouteOpenedRightNow(route)) {
      return;
    }

    store.route = route;
  };

  return {
    routes,
    storeRoutes,
    resetRoute: () => {
      if (getData().route !== undefined) {
        store.route = undefined;
      }
    },
    goBack: () => {
      setRoute(-1);
    },
    toHome: () => {
      setRoute(storeRoutes.home);
    },
    toTrainings: () => {
      setRoute(storeRoutes.trainings);
    },
    toCreateTraining: () => {
      setRoute(storeRoutes.createTraining);
    },
    isHomeUrl: () => {
      return isRouteOpenedRightNow(routes.home);
    },
    isTrainingsUrl: () => {
      return isRouteOpenedRightNow(routes.trainings);
    },
  };
};
