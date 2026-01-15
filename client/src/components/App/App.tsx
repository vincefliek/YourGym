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
const WrappedHome = () => <Home />;
const WrappedDashboard = () => <Dashboard />;
const WrappedAuthProtection = () => <AuthProtection />;
const WrappedMenu = () => <Menu />;
const WrappedTrainings = () => <Trainings />;
const WrappedTraining = () => <Training />;
const WrappedEditExistingTraining = () => <EditExistingTraining />;
const WrappedCreateTraining = () => <CreateTraining />;
const WrappedExercise = () => <Exercise />;
const WrappedEditExistingExercise = () => <EditExistingExercise />;
const WrappedEditNewExercise = () => <EditNewExercise />;
const WrappedCreateExercise = () => <CreateExercise />;

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
      '/': WrappedHome,
      '/dashboard': WrappedDashboard,
      '/pathless_auth': WrappedAuthProtection,
      '/menu': WrappedMenu,
      '/trainings': undefined,
      '/trainings/': WrappedTrainings,
      '/trainings/$training': undefined,
      '/trainings/$training/': WrappedTraining,
      '/trainings/$training/edit': WrappedEditExistingTraining,
      '/trainings/$training/new': WrappedCreateTraining,
      '/trainings/$training/$exercise': undefined,
      '/trainings/$training/$exercise/': WrappedExercise,
      '/trainings/$training/$exercise/edit': WrappedEditExistingExercise,
      '/trainings/$training/$exercise/editNew': WrappedEditNewExercise,
      '/trainings/$training/$exercise/new-exercise': WrappedCreateExercise,
    };

    this.apis.navigationApi.setRouterConfiguration({
      routePathsToComponents,
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
