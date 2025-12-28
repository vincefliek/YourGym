import { createAuthApi } from '../authApi';
import { Validator } from '../../../validation';
import { createHttpClientAPI } from '../../httpClientApi';
import { mockUser, tokenStorage } from './mockData';
import { Store as StoreType } from '../../../types';
import { createNotificationsApi } from '../../notificationsApi';

export function mockFetch(data: any, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => ({
      user: mockUser,
      session: {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
        expires_at: Date.now() + 3600 * 1000,
      },
      ...data,
    }),
    headers: {
      get: (headerName: string) => {
        if (headerName.toLowerCase() === 'content-type') {
          return 'application/json';
        }
        throw new Error(
          `NOT IMPLEMENTED! Header not found in the mock: ${headerName}`,
        );
      },
    },
  });
}

export const createApi = (store: StoreType, validator: Validator) => {
  const tools = { store, validator };
  return createAuthApi(
    tools,
    {
      httpClientAPI: createHttpClientAPI({
        tools,
        baseUrl: '',
        tokenStorage,
        refreshEndpoint: '/refresh',
      }),
      notificationsApi: createNotificationsApi(tools, {}),
    },
    tokenStorage,
  );
};
