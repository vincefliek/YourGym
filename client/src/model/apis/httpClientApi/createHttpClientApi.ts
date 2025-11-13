import { HttpClientAPI, TokenPair, TokenStorage } from '../../types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface HttpClientOptions {
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
    baseUrl,
    tokenStorage,
    refreshEndpoint,
    defaultHeaders = {
      'Content-Type': 'application/json',
      credentials: 'include',
    },
  } = options;

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
        body: JSON.stringify({ refresh_token: currentToken.refresh_token }),
      });

      if (!res.ok) {
        tokenStorage.clearToken();
        return;
      }

      newToken = await res.json() as TokenPair;

      tokenStorage.saveToken(newToken);

      return newToken.access_token;
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
      const newToken = await performRefresh();

      if (!newToken) {
        throw new Error('Unauthorized. Token refresh failed.');
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
