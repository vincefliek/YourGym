import { render, RenderResult } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';

import { App } from '../components/App/App';
import { initApp } from '../model';
import { AppAPIs } from '../model/types';
import { AppContext } from '../types';

export interface RenderAppResult {
  app: RenderResult;
  apis: AppAPIs;
  appContext: AppContext;
  getUrlNavPath: () => string;
}

export const renderApp = async (): Promise<RenderAppResult> => {
  const { apis, appContext } = await initApp();

  await apis.authApi.signin('test@gmail.com', 'testpassword');

  const app = render(
    <HashRouter>
      <App apis={apis} appContext={appContext} />
    </HashRouter>,
  );

  const getUrlNavPath = (): string => window.location.hash.slice(1);

  return { app, apis, appContext, getUrlNavPath };
};
