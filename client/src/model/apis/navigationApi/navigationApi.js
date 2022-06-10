import { generatePath, matchPath } from 'react-router-dom';

import { waitForCondition } from '../../../utils';

export const createNavigationApi = ({ store }) => {
  const routes = {
    home: '/',
    trainings: '/trainings',
    menu: '/menu',
    createTraining: '/trainings/new',
    openTraining: '/trainings/:training',
    editTraining: '/trainings/:training/edit',
    createExercise: '/trainings/:training/new-exercise',
    editExercise: '/trainings/:training/:exercise',
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

  const setRoute = async (route, params = {}) => {
    if (isRouteOpenedRightNow(route)) {
      return;
    }

    store.route = generatePath(route, params);

    return waitForCondition(async () => isRouteOpenedRightNow(route));
  };

  return {
    routes,
    resetRoute: () => {
      if (getData().route !== undefined) {
        store.route = undefined;
      }
    },
    goBack: () => {
      return setRoute(-1);
    },
    toHome: () => {
      return setRoute(routes.home);
    },
    toTrainings: () => {
      return setRoute(routes.trainings);
    },
    toMenu: () => {
      return setRoute(routes.menu);
    },
    toCreateTraining: () => {
      return setRoute(routes.createTraining);
    },
    toCreateExercise: (trainingId) => {
      return setRoute(routes.createExercise, {
        training: trainingId,
      });
    },
    toEditExercise: (trainingId, exerciseId) => {
      return setRoute(routes.editExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toTraining: (trainingId) => {
      return setRoute(routes.openTraining, {
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
      return match?.params ?? {};
    },
  };
};
