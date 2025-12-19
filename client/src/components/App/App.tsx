import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import { Navigator, Notifications } from '../../components';
import { AppContext } from '../../utils';
import { AppProps, AppState, AppContext as IAppContext } from '../../types';
import style from './style.module.scss';

export class App extends React.Component<AppProps, AppState> {
  private apis: AppAPIs;
  private appContext: IAppContext;

  constructor(props: AppProps) {
    super(props);

    const { apis, appContext } = props;

    this.apis = apis as any;
    this.appContext = appContext as any;
  }

  render() {
    return (
      <AppContext.Provider value={this.appContext}>
        <div className={style.app}>
          <Navigator />
          <Notifications />
          <Routes>
            <Route element={<AuthProtection />}>
              <Route
                path={this.apis.navigationApi.routes.menu}
                element={<Menu />}
              />
            </Route>
            <Route
              path={this.apis.navigationApi.routes.home}
              element={<Home />}
            />
            <Route
              path={this.apis.navigationApi.routes.trainings}
              element={<Trainings />}
            />
            <Route
              path={this.apis.navigationApi.routes.createTraining}
              element={<CreateTraining />}
            />
            <Route
              path={this.apis.navigationApi.routes.createExercise}
              element={<CreateExercise />}
            />
            <Route
              path={this.apis.navigationApi.routes.editNewExercise}
              element={<EditNewExercise />}
            />
            <Route
              path={this.apis.navigationApi.routes.editExistingExercise}
              element={<EditExistingExercise />}
            />
            <Route
              path={this.apis.navigationApi.routes.openTraining}
              element={<Training />}
            />
            <Route
              path={this.apis.navigationApi.routes.openExercise}
              element={<Exercise />}
            />
            <Route
              path={this.apis.navigationApi.routes.editTraining}
              element={<EditExistingTraining />}
            />
            <Route
              path={this.apis.navigationApi.routes.dashboard}
              element={<Dashboard />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AppContext.Provider>
    );
  }
}
