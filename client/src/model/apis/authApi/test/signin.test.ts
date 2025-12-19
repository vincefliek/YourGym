import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { mockUser } from './mockData';
import { createApi, mockFetch } from './utils';

describe('signin', () => {
  let store: Store;
  let validator: Validator;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    store = new Store();
    validator = new Validator();
    authApi = createApi(store, validator);
    mockFetch({ user: mockUser });
  });

  it('should validate email', async () => {
    await expect(authApi.signin('invalid', '123')).rejects.toThrow(
      'Invalid email format',
    );
  });

  it('should signin successfully', async () => {
    await authApi.signin(mockUser.email, 'password1');

    expect(store.auth.user).toBeDefined();
    expect(store.auth.isAuthenticated).toBe(true);
  });
});
