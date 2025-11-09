import { createAuthApi } from '../authApi';
import { Store } from '../../../store';
import { Validator } from '../../../validation';
import { mockUser } from './mockData';
import { mockFetch } from './utils';

describe('signin', () => {
  let store: Store;
  let validator: Validator;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    store = new Store();
    validator = new Validator();
    authApi = createAuthApi({ store, validator });
    mockFetch({ user: mockUser });
  });

  it('should validate email and password', async () => {
    const result = await authApi.signin('invalid', '123');
    expect(result.error).toBe('Invalid email format');
  });

  it('should signin successfully', async () => {
    const result = await authApi.signin(mockUser.email, 'password1');
    expect(result.user).toBeDefined();
    expect(store.auth.isAuthenticated).toBe(true);
  });
});
