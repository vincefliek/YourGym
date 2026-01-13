import { render, RenderResult } from '@testing-library/react';

import { App } from '../components/App/App';
import { initApp } from '../model';
import { AppAPIs } from '../model/types';
import { AppContext } from '../types';

export interface RenderAppResult {
  app: RenderResult;
  apis: AppAPIs;
  appContext: AppContext;
  // live as in URL, e.g. `/trainings/dac07736-f441-4ae8-96a2-ff1a0c9febf7/new`
  getUrlNavPath: () => string;
  // template as in definition, e.g. `/trainings/$training/new`
  getRouteNavPath: () => string;
}

export const renderApp = async (): Promise<RenderAppResult> => {
  const { apis, appContext } = await initApp();

  await apis.authApi.signin('test@gmail.com', 'testpassword');

  const app = render(<App apis={apis} appContext={appContext} />);

  const getUrlNavPath = (): string => apis.navigationApi.getCurrentPath();
  const getRouteNavPath = (): string =>
    apis.navigationApi.getCurrentRoutePath();

  return { app, apis, appContext, getUrlNavPath, getRouteNavPath };
};
