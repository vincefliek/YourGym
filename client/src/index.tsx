import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import { App } from './components';
import { initApp } from './model';

window.addEventListener('load', async () => {
  const { apis, appContext } = await initApp();
  ReactDOM.render(
    <HashRouter>
      <App apis={apis} appContext={appContext} />
    </HashRouter>,
    document.getElementById('root'),
  );
}, false);


