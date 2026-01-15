import { render, RenderResult } from '@testing-library/react';
import { RouterHistory } from '@tanstack/react-router';

import { App } from '../components/App/App';
import { initApp } from '../model';
import { AppAPIs } from '../model/types';
import { AppContext } from '../types';
import * as AllInGetRouterParams from '../model/apis/navigationApi/getRouterParams';

export interface RenderAppResult {
  app: RenderResult;
  apis: AppAPIs;
  appContext: AppContext;
  // live as in URL, e.g. `/trainings/dac07736-f441-4ae8-96a2-ff1a0c9febf7/new`
  getUrlNavPath: () => string;
  // template as in definition, e.g. `/trainings/$training/new`
  getRouteNavPath: () => string | undefined;
  // https://tanstack.com/router/latest/docs/framework/react/guide/history-types
  mockedHistory: RouterHistory;
}

export const renderApp = async (): Promise<RenderAppResult> => {
  const { apis, appContext } = await initApp();

  await apis.authApi.signin('test@gmail.com', 'testpassword');

  const app = render(<App apis={apis} appContext={appContext} />);

  const getUrlNavPath = (): string => apis.navigationApi.getCurrentPath();
  const getRouteNavPath = () => apis.navigationApi.getCurrentRoutePath();

  return {
    app,
    apis,
    appContext,
    getUrlNavPath,
    getRouteNavPath,
    mockedHistory: (AllInGetRouterParams as any).mockedHistory,
  };
};
