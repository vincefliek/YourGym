import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { createApi, mockFetch } from './utils';
import { Store as StoreType } from '../../../types';

describe.skip('refreshToken', () => {
  let store: StoreType;
  let validator: Validator;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    store = new Store();
    validator = new Validator();
    authApi = createApi(store, validator);
    mockFetch({ success: true });
  });

  it('should refresh token successfully', async () => {
    await authApi.refreshToken();

    expect(store.auth.isAuthenticated).toBe(true);
  });
});
