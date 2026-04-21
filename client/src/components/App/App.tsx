import React from 'react';
import { RouterProvider, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';

import { AppAPIs, ThemeMode } from '../../model/types';
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

interface AppComponentState extends AppState {
  themeMode: ThemeMode;
}

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

export class App extends React.Component<AppProps, AppComponentState> {
  private apis: AppAPIs;
  private appContext: IAppContext;
  private unsubscribeTheme?: () => void;

  constructor(props: AppProps) {
    super(props);

    const { apis, appContext } = props;

    this.apis = apis;
    this.appContext = appContext;

    this.state = {
      themeMode: apis.themeApi.getTheme(),
    };
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

    // Subscribe to theme changes from store
    const store = this.appContext.serviceLocator.getStore();
    const handleThemeChange = () => {
      this.setState({ themeMode: this.apis.themeApi.getTheme() });
    };
    this.unsubscribeTheme = store.subscribe(handleThemeChange, ['theme']);
  }

  componentWillUnmount() {
    if (this.unsubscribeTheme) {
      this.unsubscribeTheme();
    }
  }

  render() {
    return (
      <AppContext.Provider value={this.appContext}>
        <MantineProvider forceColorScheme={this.state.themeMode}>
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
        </MantineProvider>
      </AppContext.Provider>
    );
  }
}
