import {
  createRouter,
  createRoute,
  createRootRoute,
  createHashHistory,
  Register,
  RouteComponent,
  AnyRoute,
} from '@tanstack/react-router';

const rootRoute = createRootRoute();

const authProtection = createRoute({
  getParentRoute: () => rootRoute,
  id: 'pathless_auth',
});
const menu = createRoute({
  getParentRoute: () => authProtection,
  path: 'menu',
});

const home = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
});
const dashboard = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
});

const trainings = createRoute({
  getParentRoute: () => rootRoute,
  path: 'trainings',
});
const trainingsIndex = createRoute({
  getParentRoute: () => trainings,
  path: '/',
});

const training = createRoute({
  getParentRoute: () => trainings,
  path: '$training',
});
const trainingIndex = createRoute({
  getParentRoute: () => training,
  path: '/',
});
const createNewTraining = createRoute({
  getParentRoute: () => training,
  path: 'new',
});
const editExistingTraining = createRoute({
  getParentRoute: () => training,
  path: 'edit',
});

const exercise = createRoute({
  getParentRoute: () => training,
  path: '$exercise',
});
const exerciseIndex = createRoute({
  getParentRoute: () => exercise,
  path: '/',
});
const createNewExercise = createRoute({
  getParentRoute: () => exercise,
  path: 'new-exercise',
});
const editNewExercise = createRoute({
  getParentRoute: () => exercise,
  path: 'editNew',
});
const editExistingExercise = createRoute({
  getParentRoute: () => exercise,
  path: 'edit',
});

const routeTree = rootRoute.addChildren([
  authProtection.addChildren([menu]),
  home,
  dashboard,
  trainings.addChildren([
    trainingsIndex,
    training.addChildren([
      trainingIndex,
      createNewTraining,
      editExistingTraining,
      exercise.addChildren([
        exerciseIndex,
        createNewExercise,
        editNewExercise,
        editExistingExercise,
      ]),
    ]),
  ]),
]);

// TODO Think of externalizing "history" for tests
const history = createHashHistory();

const router = createRouter({
  routeTree,
  history,
});

// Typesafety - https://tanstack.com/router/latest/docs/framework/react/guide/type-safety#exported-hooks-components-and-utilities
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export type Router = Register['router'];

type RoutePaths = Exclude<
  keyof Router['routesByPath'] | keyof Router['routesById'],
  '/pathless_auth/menu'
>;

type RoutePathsToComponents = Record<
  RoutePaths | 'DEFAULT_NOT_FOUND',
  RouteComponent | undefined
>;
type RoutePathsToRouteDefinitions<T extends AnyRoute> = Record<RoutePaths, T>;

export interface RouterConfiguration {
  routePathsToComponents: RoutePathsToComponents;
}

type AllRoutes =
  | typeof rootRoute
  | typeof home
  | typeof dashboard
  | typeof authProtection
  | typeof menu
  | typeof trainings
  | typeof trainingsIndex
  | typeof training
  | typeof trainingIndex
  | typeof editExistingTraining
  | typeof createNewTraining
  | typeof exercise
  | typeof exerciseIndex
  | typeof editExistingExercise
  | typeof editNewExercise
  | typeof createNewExercise;

const routePathsToRoutes: RoutePathsToRouteDefinitions<AllRoutes> = {
  __root__: rootRoute,
  '/': home,
  '/dashboard': dashboard,
  '/pathless_auth': authProtection,
  '/menu': menu,
  '/trainings': trainings,
  '/trainings/': trainingsIndex,
  '/trainings/$training': training,
  '/trainings/$training/': trainingIndex,
  '/trainings/$training/edit': editExistingTraining,
  '/trainings/$training/new': createNewTraining,
  '/trainings/$training/$exercise': exercise,
  '/trainings/$training/$exercise/': exerciseIndex,
  '/trainings/$training/$exercise/edit': editExistingExercise,
  '/trainings/$training/$exercise/editNew': editNewExercise,
  '/trainings/$training/$exercise/new-exercise': createNewExercise,
};
const routePathsToRoutesKeys = Object.keys(
  routePathsToRoutes,
) as unknown as (keyof typeof routePathsToRoutes)[];

export const initRouter = () => {
  const withComp = (
    routePath: RoutePaths,
    routePathsToComponents: RoutePathsToComponents,
  ) => {
    const originalRoute = routePathsToRoutes[routePath];

    if (!originalRoute) {
      throw new Error(
        `[ROUTER] originalRoute is absent for route path: ${routePath}`,
      );
    }

    const component = routePathsToComponents[routePath];

    if (!component) {
      return originalRoute;
    }

    const routeWithComponent = originalRoute.update({
      component,
    });

    return routeWithComponent;
  };

  const setConfiguration = ({
    routePathsToComponents,
  }: {
    routePathsToComponents: RoutePathsToComponents;
  }) => {
    routePathsToRoutesKeys.forEach((routePath) => {
      withComp(routePath, routePathsToComponents);
    });
  };

  return {
    router,
    setConfiguration,
  };
};
