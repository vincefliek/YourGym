import { createNavigationApi } from './navigationApi';

export const createAPIs = (store) => {
  return {
    navigationApi: createNavigationApi(store),
  };
};
