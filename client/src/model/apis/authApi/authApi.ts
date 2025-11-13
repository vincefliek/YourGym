import type { ApiFactory, AppAPIs, AuthApi, AuthResponseData, Store, TokenStorage } from '../../types';
import { Validator } from '../../validation';
import { validateEmail, validatePassword } from './authValidation';

export const createAuthApi: ApiFactory<
  AuthApi,
  Pick<AppAPIs, 'httpClientAPI'>,
  [TokenStorage]
> = (
  tools: { store: Store, validator: Validator },
  dependencies,
  tokenStorage,
) => {
  const { store } = tools;
  const { httpClientAPI } = dependencies;

  async function signup(email: string, password: string) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (!validatePassword(password)) {
      throw new Error('Password does not meet requirements');
    }

    store.auth = { authLoading: true };

    try {
      const data = await httpClientAPI.post<AuthResponseData>('/api/signup', {
        email,
        password,
      }, { credentials: 'include' });

      const session = data.session;

      tokenStorage.saveToken({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
      });
      store.auth = {
        user: data.user,
        isAuthenticated: true,
        authLoading: false,
        authError: null,
      };
    } catch (e: any) {
      store.auth = {
        authError: e.message,
        authLoading: false,
      };
    }
  }

  async function signin(email: string, password: string) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    store.auth = { authLoading: true };

    try {
      const data = await httpClientAPI.post<AuthResponseData>('/api/signin', {
        email,
        password,
      }, { credentials: 'include' });

      const session = data.session;

      tokenStorage.saveToken({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
      });

      store.auth = {
        user: data.user,
        isAuthenticated: true,
        authLoading: false,
        authError: null,
      };
    } catch (e: any) {
      store.auth = {
        authError: e.message,
        authLoading: false,
      };
    }
  }

  async function signout() {
    store.auth = { authLoading: true };

    try {
      await httpClientAPI.post(
        '/api/logout',
        {},
        { credentials: 'include' },
      );

      tokenStorage.clearToken();

      store.auth = {
        user: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null,
      };
    } catch (e: any) {
      store.auth = {
        authError: e.message,
        authLoading: false,
      };
    }
  }

  async function getSession() {
    store.auth = { authLoading: true };

    try {
      const data = await httpClientAPI.get<AuthResponseData>('/api/session', {
        credentials: 'include',
      });

      store.auth = {
        user: data.user,
        isAuthenticated: !!data.user,
        authLoading: false,
        authError: null,
      };
    } catch (e: any) {
      store.auth = {
        authError: e.message,
        authLoading: false,
      };
    }
  }

  async function refreshToken() {
    try {
      const data = await httpClientAPI.post<AuthResponseData>(
        '/api/refresh',
        {},
        { credentials: 'include' },
      );

      const session = data.session;

      tokenStorage.saveToken({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
      });

      store.auth = {
        user: data.user,
        isAuthenticated: !!data.user,
      };
    } catch (e: any) {
      store.auth = {
        authError: e.message,
      };
    }
  }

  return {
    signup,
    signin,
    signout,
    getSession,
    refreshToken,
  };
};
