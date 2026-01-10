import {
  createRouter,
  createRoute,
  createRootRoute,
  createHashHistory,
  Register,
  // RouteOptions,
  // RoutePathOptions,
  // BaseRouteOptions,
  // AnyRoute,
} from '@tanstack/react-router';
import { RouterConfiguration } from '../../types';

// Typesafety - https://tanstack.com/router/latest/docs/framework/react/guide/type-safety#exported-hooks-components-and-utilities
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof initRouter>['router'];
  }
}

export type Router = Register['router'];

export const initRouter = () => {
  // TODO Think of externalizing "history" for tests
  const history = createHashHistory();

  const router = createRouter({
    history,
  });

  const setConfiguration = ({
    root,
    buildRoutes,
    defaultNotFoundComponent,
  }: RouterConfiguration) => {
    const rootRoute = createRootRoute(root);
    const newRoutes = buildRoutes(rootRoute, createRoute);
    // TODO fix any
    const routeTree = rootRoute.addChildren(newRoutes) as any;

    // Re-build and update the route tree dynamically
    router.update({
      routeTree,
      defaultNotFoundComponent,
    });
  };

  return {
    router,
    setConfiguration,
  };
};
