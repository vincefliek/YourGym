import { ApiTools, AuthResponseData, HttpClientAPI, TokenPair, TokenStorage } from '../../types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface HttpClientOptions {
  tools: ApiTools;
  baseUrl: string;
  tokenStorage: TokenStorage;
  refreshEndpoint: string; // e.g., '/api/refresh'
  defaultHeaders?: Record<string, string>;
}

interface RequestOptions<Body = any> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: Body;
}

export function createHttpClientAPI(options: HttpClientOptions): HttpClientAPI {
  const {
    tools,
    baseUrl,
    tokenStorage,
    refreshEndpoint,
    defaultHeaders = {
      'Content-Type': 'application/json',
      credentials: 'include',
    },
  } = options;
  const { store } = tools;

  let refreshing = false;
  let refreshQueue: ((token: string) => void)[] = [];

  async function performRefresh(): Promise<string | undefined> {
    if (refreshing) {
      return new Promise(resolve => {
        refreshQueue.push(resolve);
      });
    }

    refreshing = true;

    let newToken: TokenPair | null = null;

    try {
      const currentToken = tokenStorage.getToken();

      if (!currentToken) return;

      const res = await fetch(`${baseUrl}${refreshEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...defaultHeaders },
        body: JSON.stringify({ refreshToken: currentToken.refresh_token }),
      });

      if (!res.ok) {
        tokenStorage.clearToken();
        return;
      }

      const refreshedSessionData = await res.json() as AuthResponseData;
      const refreshedSession = refreshedSessionData.session;

      newToken = {
        access_token: refreshedSession.access_token,
        refresh_token: refreshedSession.refresh_token,
        expires_in: refreshedSession.expires_in,
      };

      tokenStorage.saveToken(newToken);
    } finally {
      refreshing = false;
      if (newToken) {
        refreshQueue.forEach(cb => cb(newToken!.access_token));
      }
      refreshQueue = [];
    }
  }

  async function request<TResponse = Response, TBody = any>(
    url: string,
    reqOptions: RequestOptions<TBody> = {},
    retry = true,
  ): Promise<TResponse> {
    const { method = 'GET', headers = {}, body, ...fetchOptions } = reqOptions;

    let tokenPair = tokenStorage.getToken();
    let accessToken = tokenPair?.access_token;

    const mergedHeaders: Record<string, string> = {
      ...defaultHeaders,
      ...headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const response = await fetch(`${baseUrl}${url}`, {
      ...fetchOptions,
      method,
      headers: mergedHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && retry) {
      await performRefresh();

      const newToken = tokenStorage.getToken();

      if (!newToken) {
        const errMsg = 'Unauthorized. Token refresh failed.';
        store.auth = {
          isAuthenticated: false,
          authError: errMsg,
        };
        throw new Error(errMsg);
      }

      return request<TResponse, TBody>(url, reqOptions, false); // retry once
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<TResponse>;
    }

    // fallback for non-JSON responses
    return response.text() as unknown as Promise<TResponse>;
  }

  return {
    get: <TResponse>(url: string, options?: RequestInit & { headers?: Record<string, string> }) =>
      request<TResponse>(url, { ...options, method: 'GET' }),
    post: <TResponse, TBody = any>(
      url: string,
      body?: TBody,
      options?: RequestInit & { headers?: Record<string, string> }
    ) => request<TResponse, TBody>(url, { ...options, method: 'POST', body }),
    put: <TResponse, TBody = any>(
      url: string,
      body?: TBody,
      options?: RequestInit & { headers?: Record<string, string> }
    ) => request<TResponse, TBody>(url, { ...options, method: 'PUT', body }),
    patch: <TResponse, TBody = any>(
      url: string,
      body?: TBody,
      options?: RequestInit & { headers?: Record<string, string> }
    ) => request<TResponse, TBody>(url, { ...options, method: 'PATCH', body }),
    delete: <TResponse>(url: string, options?: RequestInit & { headers?: Record<string, string> }) =>
      request<TResponse>(url, { ...options, method: 'DELETE' }),
  };
}
