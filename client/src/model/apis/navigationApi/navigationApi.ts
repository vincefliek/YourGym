// import { waitForCondition } from '../../../utils';
import { ApiFactory, NavigationApi } from '../../types';
import { initRouter } from './router';

interface Routes {
  home: string;
  trainings: string;
  menu: string;
  createTraining: string;
  openTraining: string;
  editTraining: string;
  createExercise: string;
  editNewExercise: string;
  editExistingExercise: string;
  openExercise: string;
  dashboard: string;
}

export const createNavigationApi: ApiFactory<NavigationApi, {}> = () => {
  const routes: Routes = {
    home: '/',
    menu: '/menu',
    dashboard: '/dashboard',
    trainings: '/trainings',
    openTraining: '/trainings/$training',
    createTraining: '/trainings/$training/new',
    editTraining: '/trainings/$training/edit',
    openExercise: '/trainings/$training/$exercise',
    createExercise: '/trainings/$training/$exercise/new-exercise',
    editNewExercise: '/trainings/$training/$exercise/editNew',
    editExistingExercise: '/trainings/$training/$exercise/edit',
  };

  const { router, setConfiguration } = initRouter();

  const getPathParams = (route: string) => {
    const params = router.matchRoute({ to: route }) as any;
    return { ...params };
  };

  const getCurrentPath = () => router.state.location.pathname;
  const getCurrentRoutePath = () => {
    const currentPath = getCurrentPath();
    const matches = router.matchRoutes(currentPath);
    // The last match in the array is usually the most specific leaf route
    const currentRoutePath = matches[matches.length - 1]?.routeId;
    return currentRoutePath;
  };

  const isRouteOpenedRightNow = (route: string): boolean =>
    Boolean(router.matchRoute({ to: route }));

  const setRoute = async (
    route: string,
    params: Record<string, string> = {},
  ) => {
    await router.navigate({
      to: route,
      params,
    });
  };

  let routePathsToGoBackPath: any = {};
  const setRouteBackPath = (backPathsMap: any) => {
    routePathsToGoBackPath = { ...backPathsMap };
  };
  const getRouteBackPath = (path: string) => {
    return routePathsToGoBackPath[path];
  };

  return {
    __router: router,
    routes,
    setRouterConfiguration: (config) => {
      setConfiguration(config);
      setRouteBackPath(config.routePathsToGoBackPath);
    },
    goBack: async ({ replace } = {}) => {
      const to = getRouteBackPath(getCurrentRoutePath());
      const params = getPathParams(to);

      if (to) {
        return router.navigate({
          // from: router.state.matches[router.state.matches.length - 1]?.routeId,
          to,
          params,
          replace,
        });
      } else {
        // TODO check how to handle "replace" in this flow
        // if (replace) {
        //   router.history.replace(getCurrentPath());
        // }
        if (router.history.canGoBack()) {
          router.history.back();
        }
      }
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
    toCreateTraining: (newTrainingId: string) => {
      return setRoute(routes.createTraining, {
        training: newTrainingId,
      });
    },
    toCreateExercise: (trainingId: string, exerciseId: string) => {
      return setRoute(routes.createExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toEditNewExercise: (trainingId: string, exerciseId: string) => {
      return setRoute(routes.editNewExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toEditExistingExercise: (trainingId: string, exerciseId: string) => {
      return setRoute(routes.editExistingExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toEditTraining: (trainingId: string) => {
      return setRoute(routes.editTraining, {
        training: trainingId,
      });
    },
    toTraining: (trainingId: string) => {
      return setRoute(routes.openTraining, {
        training: trainingId,
      });
    },
    toExercise: (trainingId: string, exerciseId: string) => {
      return setRoute(routes.openExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toDashboard: () => {
      return setRoute(routes.dashboard);
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
    getPathParams,
    getCurrentPath,
    getCurrentRoutePath,
  };
};
