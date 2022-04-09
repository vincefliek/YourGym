import { generatePath, matchPath } from 'react-router-dom';

export const createNavigationApi = ({ store }) => {
  const routes = {
    home: '/',
    trainings: '/trainings',
    menu: '/menu',
    createTraining: '/trainings/new',
    openTraining: '/trainings/:training',
    editTraining: '/trainings/:training/edit',
    createExercise: '/trainings/:training/new-exercise',
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

  const setRoute = (route, params = {}) => {
    if (isRouteOpenedRightNow(route)) {
      return;
    }

    store.route = generatePath(route, params);
  };

  return {
    routes,
    resetRoute: () => {
      if (getData().route !== undefined) {
        store.route = undefined;
      }
    },
    goBack: () => {
      setRoute(-1);
    },
    toHome: () => {
      setRoute(routes.home);
    },
    toTrainings: () => {
      setRoute(routes.trainings);
    },
    toMenu: () => {
      setRoute(routes.menu);
    },
    toCreateTraining: () => {
      setRoute(routes.createTraining);
    },
    toCreateExercise: (trainingId) => {
      setRoute(routes.createExercise, {
        training: trainingId,
      });
    },
    isHomeUrl: () => {
      return isRouteOpenedRightNow(routes.home);
    },
    isTrainingsUrl: () => {
      return isRouteOpenedRightNow(routes.trainings);
    },
    isMenuUrl: () => {
      return isRouteOpenedRightNow(routes.menu);
    },
    getPathParams: (route) => {
      const match = matchPath(route, getPathName());
      return match?.params;
    },
  };
};
