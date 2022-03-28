import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { createAPIs } from '../../apis';
import { Store } from '../../model';
import { Trainings, Home } from '../../screens';
import { Navigator } from '../../components';
import { ServiceLocatorContext } from '../../utils';
import './App.css';

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
        <div className="App">
          <Navigator />
          <Routes>
            <Route path={this.apis.navigationApi.routes.home} element={<Home />} />
            <Route path={this.apis.navigationApi.routes.trainings} element={<Trainings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ServiceLocatorContext.Provider>
    );
  }
}

// TODO REFACTOR
function NotFound() {
  return (
    <div>
      Oops! This page doesn't exist.
    </div>
  );
}
