import type { Store } from '../../types';
import { Validator } from '../../validation';
import { validateEmail, validatePassword } from './authValidation';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://yourgym.onrender.com'
  : 'http://localhost:3100';

export const createAuthApi = (
  tools: { store: Store, validator: Validator },
) => {
  const { store } = tools;

  async function signup(email: string, password: string) {
    if (!validateEmail(email)) {
      return { error: 'Invalid email format' };
    }
    if (!validatePassword(password)) {
      return { error: 'Password does not meet requirements' };
    }

    store.auth = { authLoading: true };

    try {
      const res = await fetch(`${BASE_URL}/api/signup`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      store.auth = {
        user: data.user,
        isAuthenticated: true,
        authLoading: false,
        authError: null,
      };

      return data;
    } catch (e: any) {
      store.auth = {
        authError: e.message,
        authLoading: false,
      };
      return { error: e.message };
    }
  }

  async function signin(email: string, password: string) {
    if (!validateEmail(email)) {
      return { error: 'Invalid email format' };
    }
    if (!validatePassword(password)) {
      return { error: 'Password does not meet requirements' };
    }

    store.auth = { authLoading: true };

    try {
      const res = await fetch(`${BASE_URL}/api/signin`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      store.auth = {
        user: data.user,
        isAuthenticated: true,
        authLoading: false,
        authError: null,
      };

      return data;
    } catch (e: any) {
      store.auth = {
        authError: e.message,
        authLoading: false,
      };
      return { error: e.message };
    }
  }

  async function signout() {
    store.auth = { authLoading: true };

    try {
      const res = await fetch(`${BASE_URL}/api/signout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Signout failed');
      }

      store.auth = {
        user: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null,
      };

      return { success: true };
    } catch (e: any) {
      store.auth = {
        authError: e.message,
        authLoading: false,
      };

      return { error: e.message };
    }
  }

  async function getSession() {
    store.auth = { authLoading: true };

    try {
      const res = await fetch(`${BASE_URL}/api/session`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      store.auth = {
        user: data.user,
        isAuthenticated: !!data.user,
        authLoading: false,
        authError: null,
      };

      return data;
    } catch (e: any) {
      store.auth = {
        authError: e.message,
        authLoading: false,
      };

      return { error: e.message };
    }
  }

  async function refreshToken() {
    try {
      const res = await fetch(`${BASE_URL}/api/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    } catch (e: any) {
      return { error: e.message };
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
