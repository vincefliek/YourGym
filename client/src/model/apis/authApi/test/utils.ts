import { createAuthApi } from '../authApi';
import { Validator } from '../../../validation';
import { createHttpClientAPI } from '../../httpClientApi';
import { tokenStorage } from './mockData';
import { Store as StoreType } from '../../../types';

export function mockFetch(data: any, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => data,
  });
}

export const createApi = (
  store: StoreType,
  validator: Validator,
) => {
  const tools = { store, validator };
  return createAuthApi(
    tools,
    { httpClientAPI: createHttpClientAPI({
      tools,
      baseUrl: '',
      tokenStorage,
      refreshEndpoint: '/refresh',
    }) },
    tokenStorage,
  );
};
