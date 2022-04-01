import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { createAPIs } from '../../apis';
import { Store } from '../../model';
import { Trainings, Home, Burger, NotFound } from '../../screens';
import { Navigator } from '../../components';
import { ServiceLocatorContext } from '../../utils';
import style from './style.module.scss';

export class App extends React.Component {
  constructor(props) {
    super(props);

    const store = new Store();

    this.apis = createAPIs(store);
    this.SLContext = {
      serviceLocator: {
        getStore: () => store,
        getAPIs: () => this.apis,
      },
    };
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
              path={this.apis.navigationApi.routes.burger}
              element={<Burger />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ServiceLocatorContext.Provider>
    );
  }
}
