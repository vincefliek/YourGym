import { createNavigationApi } from './navigationApi';
import { createTrainingsApi } from './trainingsApi';

export const createAPIs = (store) => {
  return {
    navigationApi: createNavigationApi(store),
    trainingsApi: createTrainingsApi(store),
  };
};
