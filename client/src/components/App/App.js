import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { initApp } from '../../model';
import {
  Trainings,
  Home,
  Menu,
  NotFound,
  CreateTraining,
  CreateExercise,
  EditNewExercise,
  EditExistingExercise,
  Training,
  Exercise,
  EditTraining,
} from '../../screens';
import { Navigator } from '../../components';
import { AppContext } from '../../utils';
import style from './style.module.scss';

export class App extends React.Component {
  constructor(props) {
    super(props);

    const { apis, appContext } = initApp();

    this.apis = apis;
    this.appContext = appContext;
  }

  render() {
    return (
      <AppContext.Provider value={this.appContext}>
        <div className={style.app}>
          <Navigator />
          <Routes>
            <Route
              path={this.apis.navigationApi.routes.home}
              element={<Home />}
            />
            <Route
              path={this.apis.navigationApi.routes.trainings}
              element={<Trainings />}
            />
            <Route
              path={this.apis.navigationApi.routes.menu}
              element={<Menu />}
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
              element={<EditTraining />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AppContext.Provider>
    );
  }
}
