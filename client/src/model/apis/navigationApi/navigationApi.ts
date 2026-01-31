import { ApiFactory, NavigationApi } from '../../types';
import { initRouter } from './router';

interface StateInRoute extends Partial<Record<string, string>> {
  // TODO how to add types?
  // goBackTo?: string;
}

export const createNavigationApi: ApiFactory<NavigationApi, {}> = () => {
  const routes: NavigationApi['routes'] = {
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
    const params = router.matchRoute({ to: route });
    return { ...params };
  };

  const removeTrailingSlash = (path?: string): string | undefined => {
    if (path && path !== '/') {
      return path.replace(/\/$/, '');
    }
    return path;
  };

  const getCurrentPath = () => router.state.location.pathname;

  const getCurrentRoutePath = () => {
    const currentPath = getCurrentPath();
    const matches = router.matchRoutes(currentPath);
    // The last match in the array is usually the most specific leaf route
    const currentRoutePath = matches[matches.length - 1]?.routeId;
    return removeTrailingSlash(currentRoutePath);
  };

  const isRouteOpenedRightNow = (route: string): boolean =>
    Boolean(router.matchRoute({ to: route }));

  const setRoute = async (
    route: string,
    params: Record<string, string> = {},
    state: StateInRoute = {},
  ) => {
    await router.navigate({
      to: route,
      params,
      state,
    });
  };

  const getRouteBackPath = () => {
    return (router.state.location.state as unknown as StateInRoute)?.goBackTo;
  };

  return {
    __router: router,
    routes,
    setRouterConfiguration: (config) => {
      setConfiguration(config);
    },
    goBack: async ({ replace } = {}) => {
      const to = getRouteBackPath();

      if (to) {
        const params = getPathParams(to);
        return router.navigate({
          to,
          params,
          replace,
        });
      } else {
        // TODO check how to handle "replace" in this flow
        // if (replace) {
        //   router.history.replace(...);
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
    toCreateExercise: (trainingId: string, exerciseId: string, options) => {
      return setRoute(
        routes.createExercise,
        {
          training: trainingId,
          exercise: exerciseId,
        },
        { goBackTo: options?.goBackTo },
      );
    },
    toEditNewExercise: (trainingId: string, exerciseId: string, options) => {
      return setRoute(
        routes.editNewExercise,
        {
          training: trainingId,
          exercise: exerciseId,
        },
        { goBackTo: options?.goBackTo },
      );
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
