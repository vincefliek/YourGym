import { createNavigationApi } from './navigationApi';
import { createTrainingsApi } from './trainingsApi';

export const createAPIs = (tools) => {
  return {
    navigationApi: createNavigationApi(tools),
    trainingsApi: createTrainingsApi(tools),
  };
};
