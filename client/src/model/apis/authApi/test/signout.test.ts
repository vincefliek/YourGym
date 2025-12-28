import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { mockUser } from './mockData';
import { createApi, mockFetch } from './utils';

describe('signout', () => {
  let store: Store;
  let validator: Validator;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    store = new Store();
    validator = new Validator();
    authApi = createApi(store, validator);
    mockFetch({});
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
