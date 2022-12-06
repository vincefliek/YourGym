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
    createExerciseForNewTraining: '/trainings/:training/new-exercise',
    createExerciseForExistingTraining:
      '/trainings/:training/new-exerciseForExistingTraining',
    editNewExercise: '/trainings/:training/:exercise/editNew',
    editExistingExercise: '/trainings/:training/:exercise/edit',
    openExercise: '/trainings/:training/:exercise',
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
    // TODO [vlad-ozh] [it's a hack]
    if (isRouteOpenedRightNow(route) && (route !== routes.openExercise)) {
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
    toEditTraining: (trainingId) => {
      return setRoute(routes.editTraining, {
        training: trainingId,
      });
    },
    toCreateExerciseForNewTraining: (trainingId) => {
      return setRoute(routes.createExerciseForNewTraining, {
        training: trainingId,
      });
    },
    toCreateExerciseForExistingTraining: (trainingId) => {
      return setRoute(routes.createExerciseForExistingTraining, {
        training: trainingId,
      });
    },
    toEditNewExercise: (trainingId, exerciseId) => {
      return setRoute(routes.editNewExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toEditExistingExercise: (trainingId, exerciseId) => {
      return setRoute(routes.editExistingExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toTraining: (trainingId) => {
      return setRoute(routes.openTraining, {
        training: trainingId,
      });
    },
    toExercise: (trainingId, exerciseId) => {
      return setRoute(routes.openExercise, {
        training: trainingId,
        exercise: exerciseId,
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
