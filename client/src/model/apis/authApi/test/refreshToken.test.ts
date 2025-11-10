import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { mockFetch } from './utils';

describe.skip('refreshToken', () => {
  let store: Store;
  let validator: Validator;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    store = new Store();
    validator = new Validator();
    authApi = createAuthApi({ store, validator });
    mockFetch({ success: true });
  });

  it('should refresh token successfully', async () => {
    await authApi.refreshToken();

    expect(store.auth.isAuthenticated).toBe(true);
  });
});
