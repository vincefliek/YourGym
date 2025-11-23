import { ApiTools, TokenPair, TokenStorage } from '../types';
import { createNavigationApi } from './navigationApi';
import { createTrainingsApi } from './trainingsApi';
import { createAuthApi } from './authApi';
import { createHttpClientAPI } from './httpClientApi';
import { createTrainingsServerApi } from './trainingsServerApi';

export const createAPIs = (tools: ApiTools) => {
  const accessTokenKey = '__yg_at_rt';

  const tokenStorage: TokenStorage = {
    getToken: () => {
      const item = localStorage.getItem(accessTokenKey);
      if (!item) {
        return;
      }
      return JSON.parse(item);
    },
    saveToken: (t: TokenPair) =>
      localStorage.setItem(accessTokenKey, JSON.stringify(t)),
    clearToken: () => localStorage.removeItem(accessTokenKey),
  };

  const httpClientAPI = createHttpClientAPI({
    tools,
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://yourgym.onrender.com'
      : 'http://localhost:3100',
    tokenStorage,
    refreshEndpoint: '/api/refresh',
  });

  const trainingsServerApi = createTrainingsServerApi(tools, { httpClientAPI });

  return {
    navigationApi: createNavigationApi(tools, {}),
    trainingsApi: createTrainingsApi(tools, {
      httpClientAPI,
      trainingsServerApi,
    }),
    authApi: createAuthApi(tools, { httpClientAPI }, tokenStorage),
    httpClientAPI,
    trainingsServerApi,
  };
};
