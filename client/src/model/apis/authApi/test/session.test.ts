import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { mockUser } from './mockData';
import { mockFetch } from './utils';

describe('getSession', () => {
  let store: Store;
  let validator: Validator;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    store = new Store();
    validator = new Validator();
    authApi = createAuthApi({ store, validator });
    mockFetch({ user: mockUser });
  });

  it('should get session successfully', async () => {
    const result = await authApi.getSession();
    expect(result.user).toBeDefined();
    expect(store.auth.isAuthenticated).toBe(true);
  });
});
