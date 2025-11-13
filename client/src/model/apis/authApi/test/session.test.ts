import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { mockUser, tokenStorage } from './mockData';
import { mockFetch } from './utils';
import { createHttpClientAPI } from '../../httpClientApi';

describe.skip('getSession', () => {
  let store: Store;
  let validator: Validator;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    store = new Store();
    validator = new Validator();
    authApi = createAuthApi(
      { store, validator },
      { httpClientAPI: createHttpClientAPI({
        baseUrl: '',
        tokenStorage,
        refreshEndpoint: '/refresh',
      }) },
      tokenStorage,
    );
    mockFetch({ user: mockUser });
  });

  it('should get session successfully', async () => {
    await authApi.getSession();

    expect(store.auth.user).toBeDefined();
    expect(store.auth.isAuthenticated).toBe(true);
  });
});
