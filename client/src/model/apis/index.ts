import { ApiTools } from '../types';
import { createNavigationApi } from './navigationApi';
import { createTrainingsApi } from './trainingsApi';
import { createAuthApi } from './authApi';

export const createAPIs = (tools: ApiTools) => {
  return {
    navigationApi: createNavigationApi(tools),
    trainingsApi: createTrainingsApi(tools),
    authApi: createAuthApi(tools),
  };
};
