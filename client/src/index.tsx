import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import { App } from './components';
import { initApp } from './model';

window.addEventListener(
  'load',
  async () => {
    console.log('>>> LOAD event <<<');

    const { apis, appContext } = await initApp();

    const rootEl = document.getElementById('root');
    if (rootEl) {
      const root = createRoot(rootEl);
      root.render(
        <HashRouter>
          <App apis={apis} appContext={appContext} />
        </HashRouter>,
      );
    }
  },
  false,
);
