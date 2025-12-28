import type { FetchMock } from 'jest-fetch-mock';

/**
 * Test helper to centralize jest-fetch-mock handlers for APIs
 */

type Matcher = string | RegExp | ((req: Request) => boolean);

type DefaultEntry = {
  matcher: Matcher;
  method?: string;
  responder: (req: Request) => Promise<{
    status: number;
    body?: any;
    headers?: Record<string, string>;
  }>;
};

function createApiMocks() {
  const fetchMock: FetchMock = global.fetch as FetchMock;
  const defaults: DefaultEntry[] = [];

  // one-off overrides (replyOnce) keyed by an id
  const onceOverrides: Array<{
    matcher: Matcher;
    method?: string;
    status: number;
    body?: any;
    reject?: boolean;
  }> = [];

  // persistent overrides (replace defaults)
  const overrides: Array<{
    matcher: Matcher;
    method?: string;
    handler: DefaultEntry['responder'];
  }> = [];

  let globalDelay = 0;

  function matchMatcher(m: Matcher, req: Request) {
    if (typeof m === 'string') {
      try {
        const url = new URL(req.url);
        if (url.pathname === m) return true;
      } catch {
        // not an absolute URL
      }
      if (req.url.endsWith(m)) return true;
      if (req.url.includes(m)) return true;
      return false;
    }
    if (m instanceof RegExp) return m.test(req.url);
    try {
      return (m as (r: Request) => boolean)(req);
    } catch {
      return false;
    }
  }

  async function defaultResponder(req: Request) {
    // check onceOverrides first
    const onceIndex = onceOverrides.findIndex((o) => {
      if (o.method && o.method !== req.method) return false;
      return matchMatcher(o.matcher, req);
    });
    if (onceIndex >= 0) {
      const o = onceOverrides.splice(onceIndex, 1)[0];
      if (o.reject) throw new Error('NetworkError');
      return { status: o.status, body: o.body };
    }

    // check persistent overrides
    const over = overrides.find((o) => {
      if (o.method && o.method !== req.method) return false;
      return matchMatcher(o.matcher, req);
    });
    if (over) return over.handler(req);

    // check defaults
    const d = defaults.find((d) => {
      if (d.method && d.method !== req.method) return false;
      return matchMatcher(d.matcher, req);
    });
    if (d) return d.responder(req);

    return {
      status: 404,
      body: { message: 'No mock registered for this endpoint' },
    };
  }

  function jsonResponse(status: number, body?: any) {
    const headers = { 'Content-Type': 'application/json' };
    return { status, body, headers };
  }

  // register default endpoints
  function registerDefaults() {
    defaults.length = 0;

    // Auth
    defaults.push({
      matcher: '/api/session',
      method: 'GET',
      responder: async () =>
        jsonResponse(200, {
          user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
          session: {
            access_token: 'mock_access_token',
            refresh_token: 'mock_refresh_token',
            expires_in: 3600,
            // expires_at: Date.now() + 3600 * 1000,
          },
        }),
    });

    defaults.push({
      matcher: '/api/signin',
      method: 'POST',
      responder: async () =>
        jsonResponse(200, {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            access_token: 'mock_access_token',
            refresh_token: 'mock_refresh_token',
            expires_in: 3600,
            // expires_at: Date.now() + 3600 * 1000,
          },
        }),
    });

    defaults.push({
      matcher: '/api/signup',
      method: 'POST',
      responder: async () =>
        jsonResponse(200, {
          user: { id: 'user-1', email: 'test@example.com' },
        }),
    });

    defaults.push({
      matcher: '/api/refresh',
      method: 'POST',
      responder: async () =>
        jsonResponse(200, {
          session: {
            access_token: 'new_access_token',
            refresh_token: 'new_refresh_token',
            expires_in: 3600,
            // expires_at: Date.now() + 3600 * 1000,
          },
        }),
    });

    defaults.push({
      matcher: '/api/logout',
      method: 'POST',
      responder: async () => jsonResponse(200, {}),
    });

    // Trainings server API
    defaults.push({
      matcher: '/api/workouts',
      method: 'GET',
      responder: async () => jsonResponse(200, []),
    });

    defaults.push({
      matcher: '/api/workouts',
      method: 'POST',
      responder: async (req: Request) => {
        try {
          const body = await req.json();
          const created = {
            id: `srv-${Math.random().toString(36).slice(2, 8)}`,
            ...body,
          };
          return jsonResponse(200, created);
        } catch {
          return jsonResponse(200, {});
        }
      },
    });

    defaults.push({
      // eslint-disable-next-line no-useless-escape
      matcher: /\/api\/workouts\/[^\/]+$/,
      method: 'DELETE',
      responder: async () => jsonResponse(200, {}),
    });

    // Sync changes
    defaults.push({
      matcher: (req: Request) => req.url.includes('/api/changes'),
      method: 'GET',
      responder: async () =>
        jsonResponse(200, {
          completedTrainings: { data: [] },
          completedExercises: { data: [] },
        }),
    });
  }

  function applyToFetchMock() {
    if (!fetchMock) {
      throw new Error(
        'fetchMock is not available. Ensure "jest-fetch-mock/setupJest" is loaded.',
      );
    }

    fetchMock.resetMocks();
    // register a single global handler using mockIf which delegates to our resolver
    fetchMock.mockIf(
      () => {
        // always handle; we decide response in resolver
        return true;
      },
      async (req: any) => {
        if (globalDelay) await new Promise((r) => setTimeout(r, globalDelay));

        const r = await defaultResponder(req as Request);
        const body = r.body === undefined ? '' : JSON.stringify(r.body);
        const headers =
          r.headers ||
          (r.body !== undefined ? { 'Content-Type': 'application/json' } : {});
        return { status: r.status, body, headers };
      },
    );
  }

  // Public API
  return {
    init() {
      if (!fetchMock) {
        throw new Error('fetchMock is not available (global.fetchMock).');
      }

      if (typeof fetchMock.enableMocks === 'function') {
        fetchMock.enableMocks();
      }

      registerDefaults();
      applyToFetchMock();
    },
    resetCache() {
      onceOverrides.length = 0;
      overrides.length = 0;
      globalDelay = 0;

      if (fetchMock && typeof fetchMock.resetMocks === 'function') {
        fetchMock.resetMocks();
      }

      registerDefaults();
      applyToFetchMock();
    },
    destroy() {
      onceOverrides.length = 0;
      overrides.length = 0;
      defaults.length = 0;

      if (fetchMock && typeof fetchMock.disableMocks === 'function') {
        fetchMock.disableMocks();
      }
    },
    when(matcher: Matcher, method?: string) {
      return {
        reply(status: number, body?: any) {
          overrides.push({
            matcher,
            method,
            handler: async () => jsonResponse(status, body),
          });
          applyToFetchMock();
        },
        replyOnce(status: number, body?: any) {
          onceOverrides.push({ matcher, method, status, body });
          applyToFetchMock();
        },
        networkErrorOnce() {
          onceOverrides.push({
            matcher,
            method,
            status: 0,
            body: undefined,
            reject: true,
          });
          applyToFetchMock();
        },
      };
    },
    replyOnce(matcher: Matcher, status: number, body?: any) {
      onceOverrides.push({ matcher, status, body });
      applyToFetchMock();
    },
    setDefaultResponse(
      matcher: Matcher,
      method: string | undefined,
      responder: DefaultEntry['responder'],
    ) {
      defaults.push({ matcher, method, responder });
      applyToFetchMock();
    },
    restoreDefault(matcher?: Matcher) {
      if (!matcher) {
        overrides.length = 0;
      } else {
        for (let i = overrides.length - 1; i >= 0; i--) {
          // crude equality check for simple strings/regex
          const o = overrides[i];
          if (String(o.matcher) === String(matcher)) overrides.splice(i, 1);
        }
      }
      applyToFetchMock();
    },
    simulateNetworkError(matcher?: Matcher, once = false) {
      if (once) {
        onceOverrides.push({
          matcher: matcher || '/api',
          status: 0,
          body: undefined,
          reject: true,
        });
      } else {
        overrides.push({
          matcher: matcher || '/api',
          handler: async () => {
            throw new Error('NetworkError');
          },
        });
      }
      applyToFetchMock();
    },
    delay(ms: number) {
      globalDelay = ms;
    },
    // convenience helpers
    ok(body?: any) {
      return jsonResponse(200, body);
    },
    unauthorized(body?: any) {
      return jsonResponse(401, body || { message: 'Unauthorized' });
    },
    serverError(body?: any) {
      return jsonResponse(500, body || { message: 'Server Error' });
    },
    notFound(body?: any) {
      return jsonResponse(404, body || { message: 'Not Found' });
    },
  } as const;
}

export { createApiMocks };
