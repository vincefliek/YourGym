import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Store, createAPIs, Validator } from '../../model';
import {
  Trainings,
  Home,
  Menu,
  NotFound,
  CreateTraining,
  CreateExercise,
} from '../../screens';
import { Navigator } from '../../components';
import { AppContext } from '../../utils';
import style from './style.module.scss';

export class App extends React.Component {
  constructor(props) {
    super(props);

    const store = new Store();
    const validator = new Validator();

    this.apis = createAPIs({
      store,
      validator,
    });
    this.appContext = {
      serviceLocator: {
        getStore: () => ({
          getStoreData: store.getStoreData,
          subscribe: store.subscribe,
        }),
        getAPIs: () => this.apis,
      },
    };

    if (process.env.NODE_ENV === 'development') {
      window._debugTools_ = {
        store,
        validator,
        apis: this.apis,
      };
    }
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AppContext.Provider>
    );
  }
}
