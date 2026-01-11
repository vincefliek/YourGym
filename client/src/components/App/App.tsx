import React from 'react';
import {
  RouterProvider,
  Outlet,
  useParams,
  NavigateOptions,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { AppAPIs } from '../../model/types';
import {
  Trainings,
  Home,
  Menu,
  Dashboard,
  NotFound,
  CreateTraining,
  CreateExercise,
  EditNewExercise,
  EditExistingExercise,
  Training,
  Exercise,
  EditExistingTraining,
  // AuthProtection,
} from '../../screens';
import { Notifications, BlockingLayer } from '../../components';
import { AppContext } from '../../utils';
import { AppProps, AppState, AppContext as IAppContext } from '../../types';
import style from './style.module.scss';

const RootComp = () => <Outlet />;

interface WithGoBackProps {
  goBack: () => void;
}

/**
 * HOC to inject a 'goBack' prop into a component.
 * @param navOptions - Standard TanStack NavigateOptions (e.g., { to: '..', replace: true })
 */
function withGoBack(apis: AppAPIs, navOptions: NavigateOptions) {
  return <TProps extends WithGoBackProps>(
    WrappedComponent: React.ComponentType<TProps>,
  ) => {
    // The resulting component takes all props of WrappedComponent MINUS goBack
    const ComponentWithGoBack = (
      props: Omit<TProps, keyof WithGoBackProps>,
    ) => {
      const params = useParams({ strict: false });
      const goBack = () => {
        console.log('goBack', params);
        apis.navigationApi.__router.navigate({ ...navOptions, params });
      };

      // Cast back to TProps because we are providing the missing goBack prop
      return <WrappedComponent {...(props as TProps)} goBack={goBack} />;
    };

    ComponentWithGoBack.displayName = `withGoBack(${
      WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return ComponentWithGoBack;
  };
}

export class App extends React.Component<AppProps, AppState> {
  private apis: AppAPIs;
  private appContext: IAppContext;

  constructor(props: AppProps) {
    super(props);

    const { apis, appContext } = props;

    this.apis = apis;
    this.appContext = appContext;
  }

  componentDidMount(): void {
    this.apis.navigationApi.setRouterConfiguration({
      defaultNotFoundComponent: NotFound,
      root: {
        component: RootComp,
      },
      buildRoutes: (rootRoute, createRoute) => {
        // const authProtection = createRoute({
        //   getParentRoute: () => rootRoute,
        //   id: 'pathless_auth',
        //   component: AuthProtection,
        // });
        const menu = createRoute({
          // getParentRoute: () => authProtection,
          getParentRoute: () => rootRoute,
          path: 'menu',
          component: Menu,
        });

        const home = createRoute({
          getParentRoute: () => rootRoute,
          path: '/',
          component: Home,
        });
        const dashboard = createRoute({
          getParentRoute: () => rootRoute,
          path: 'dashboard',
          component: Dashboard,
        });

        const trainings = createRoute({
          getParentRoute: () => rootRoute,
          path: 'trainings',
        });
        const trainingsIndex = createRoute({
          getParentRoute: () => trainings,
          path: '/',
          component: Trainings,
        });

        const training = createRoute({
          getParentRoute: () => trainings,
          path: '$training',
        });
        const trainingIndex = createRoute({
          getParentRoute: () => training,
          path: '/',
          component: Training,
        });
        const createNewTraining = createRoute({
          getParentRoute: () => training,
          path: 'new',
          component: CreateTraining,
        });
        const editExistingTraining = createRoute({
          getParentRoute: () => training,
          path: 'edit',
          component: EditExistingTraining,
        });

        const exercise = createRoute({
          getParentRoute: () => training,
          path: '$exercise',
        });
        const exerciseIndex = createRoute({
          getParentRoute: () => exercise,
          path: '/',
          component: Exercise,
        });
        const createNewExercise = createRoute({
          getParentRoute: () => exercise,
          path: 'new-exercise',
          component: withGoBack(this.apis, {
            // to: apis.navigationApi.routes.createTraining,
            // to: '/trainings/$training/new' as any,
            // params: (prev: any, curr: any) => {
            //   console.log('withGoBack - params', prev, curr);
            //   return prev;
            // },
            to: '../../new' as any,
            // replace: true,
          })(CreateExercise),
        });
        const editNewExercise = createRoute({
          getParentRoute: () => exercise,
          path: 'editNew',
          component: EditNewExercise,
        });
        const editExistingExercise = createRoute({
          getParentRoute: () => exercise,
          path: 'edit',
          component: EditExistingExercise,
        });

        return [
          // authProtection.addChildren([menu]),
          home,
          menu,
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
        ];
      },
    });
  }

  render() {
    return (
      <AppContext.Provider value={this.appContext}>
        <div className={style.releaseVersion}>v{__APP_VERSION__}</div>
        <div className={style.app}>
          <Notifications />
          <BlockingLayer />
          <TanStackRouterDevtools
            position="bottom-right"
            router={this.apis.navigationApi.__router}
          />
          <RouterProvider router={this.apis.navigationApi.__router} />
        </div>
      </AppContext.Provider>
    );
  }
}
