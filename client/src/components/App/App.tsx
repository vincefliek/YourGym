import React from 'react';
import { RouterProvider, Outlet } from '@tanstack/react-router';
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
  AuthProtection,
} from '../../screens';
import { Notifications, BlockingLayer } from '../../components';
import { AppContext } from '../../utils';
import { AppProps, AppState, AppContext as IAppContext } from '../../types';
import style from './style.module.scss';

const RootComp = () => <Outlet />;

export class App extends React.Component<AppProps, AppState> {
  private apis: AppAPIs;
  private appContext: IAppContext;

  constructor(props: AppProps) {
    super(props);

    const { apis, appContext } = props;

    this.apis = apis;
    this.appContext = appContext;
  }

  componentDidMount() {
    const routePathsToComponents = {
      DEFAULT_NOT_FOUND: NotFound,
      __root__: RootComp,
      '/': () => <Home />,
      '/dashboard': () => <Dashboard />,
      '/pathless_auth': () => <AuthProtection />,
      '/menu': () => <Menu />,
      '/trainings': undefined,
      '/trainings/': () => <Trainings />,
      '/trainings/$training': undefined,
      '/trainings/$training/': () => <Training />,
      '/trainings/$training/edit': () => <EditExistingTraining />,
      '/trainings/$training/new': () => <CreateTraining />,
      '/trainings/$training/$exercise': undefined,
      '/trainings/$training/$exercise/': () => <Exercise />,
      '/trainings/$training/$exercise/edit': () => <EditExistingExercise />,
      '/trainings/$training/$exercise/editNew': () => <EditNewExercise />,
      '/trainings/$training/$exercise/new-exercise': () => <CreateExercise />,
    };

    this.apis.navigationApi.setRouterConfiguration({
      routePathsToComponents,
      routePathsToGoBackPath: {
        '/trainings/$training/$exercise/new-exercise':
          '/trainings/$training/new',
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
