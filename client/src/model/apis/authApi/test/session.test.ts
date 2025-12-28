import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { createApi, mockFetch } from './utils';

describe('getSession', () => {
  let store: Store;
  let validator: Validator;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    store = new Store();
    validator = new Validator();
    authApi = createApi(store, validator);
    mockFetch({});
  });

  it('should get session successfully', async () => {
    await authApi.getSession();

    expect(store.auth.user).toBeDefined();
    expect(store.auth.isAuthenticated).toBe(true);
  });
});
