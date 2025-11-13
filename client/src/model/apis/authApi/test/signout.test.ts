import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { mockUser, tokenStorage } from './mockData';
import { mockFetch } from './utils';
import { createHttpClientAPI } from '../../httpClientApi';

describe('signout', () => {
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
      })},
      tokenStorage,
    );
    mockFetch({ success: true });
    store.auth = {
      user: mockUser,
      isAuthenticated: true,
      authLoading: false,
      authError: null,
    };
  });

  it('should signout successfully', async () => {
    expect(store.auth.isAuthenticated).toBe(true);
    expect(store.auth.user).toBeDefined();

    await authApi.signout();

    expect(store.auth.isAuthenticated).toBe(false);
    expect(store.auth.user).toBeNull();
  });
});
