import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Store, createAPIs, Validator } from '../../model';
import { Trainings, Home, NotFound, CreateTraining } from '../../screens';
import { Navigator } from '../../components';
import { ServiceLocatorContext } from '../../utils';
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
    this.SLContext = {
      serviceLocator: {
        getStore: () => store,
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
      <ServiceLocatorContext.Provider value={this.SLContext}>
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
              path={this.apis.navigationApi.routes.createTraining}
              element={<CreateTraining />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ServiceLocatorContext.Provider>
    );
  }
}
