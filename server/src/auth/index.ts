import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
// @ts-ignore
import rateLimit from 'express-rate-limit';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

const { COOKIE_DOMAIN = undefined } = process.env;

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const isDevEnv = process.env.NODE_ENV === 'development';

const getCookieOptions = (maxAgeSec: number) => ({
  httpOnly: true,
  secure: !isDevEnv,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: maxAgeSec * 1000,
  // domain: COOKIE_DOMAIN,
});

const ACCESS_TOKEN_COOKIE = 'sb_access';
const REFRESH_TOKEN_COOKIE = 'sb_refresh';

/**
 * Set cookies (access + refresh) from a Supabase session object.
 * Note: adjust maxAge to match your security policy. We use values from the session if available,
 * otherwise sensible defaults are used.
 */
function setSessionCookies(res: Response, session: Session) {
  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;

  // access token expiry is short — we set cookie ttl to access token expires_in or fallback 15min
  const accessMaxAge = (session.expires_in ?? 900); // in seconds
  // refresh token lifetime: choose a value: Supabase sessions may be long-lived; we use 7 days default
  const refreshMaxAge = 7 * 24 * 3600;

  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(accessMaxAge));
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, getCookieOptions(refreshMaxAge));
}

/**
 * Clear auth cookies (logout client-side).
 */
function clearSessionCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/', domain: COOKIE_DOMAIN });
  res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/', domain: COOKIE_DOMAIN });
}

/**
 * Middleware: protect routes.
 * - tries to read access token from cookie and get user.
 * - if access token expired, tries to refresh using refresh token.
 * - if refresh successful, rotates tokens and continues.
 */
const createRequireAuthMiddleware = (supabase: SupabaseClient) => {
  async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies[ACCESS_TOKEN_COOKIE] as string | undefined;
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined;

      if (!accessToken) {
        return res.status(401).json({ error: 'Missing access token' });
      }

      // Try to get user using current access token
      const { data: userData, error: userErr } = await supabase.auth.getUser(accessToken);

      if (userErr) {
        // If token expired / invalid, try refresh path
        if (refreshToken) {
          const { data: refreshData, error: refreshErr } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
          } as any); // typings sometimes accept session/currentSession; passing object with refresh_token works

          if (refreshErr || !refreshData?.session) {
            clearSessionCookies(res);
            return res.status(401).json({ error: 'Failed to refresh session' });
          }

          // rotate: set new cookies
          setSessionCookies(res, refreshData.session);
          // attach user to req and continue
          (req as any).auth = { user: refreshData.user };
          return next();
        } else {
          return res.status(401).json({ error: 'Access token invalid and no refresh token' });
        }
      }

      // success: attach user
      (req as any).auth = { user: userData.user };
      next();
    } catch (err) {
      console.error('Auth middleware error', err);
      return res.status(500).json({ error: 'Internal auth error' });
    }
  }
  return requireAuth;
};

const registerAuthRoutes = (app: Express, supabase: SupabaseClient) => {
  /**
   * Signup
   * - creates user using email+password
   * - returns httpOnly cookies (access+refresh) on success
   */
  app.post('/api/signup', authLimiter, async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'email and password required' });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // on signUp, Supabase may return user but not session in some flows (e.g. email confirm required)
      if (!data.session) {
        // If your project requires email confirmation, you won't get tokens yet.
        return res.status(200).json({ message: 'User created, confirmation email sent', user: data.user });
      }

      // set cookies
      setSessionCookies(res, data.session);

      return res.status(201).json({ user: data.user });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/signin', authLimiter, async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'email and password required' });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      if (!data.session) {
        // e.g. magic-link flows; handle accordingly
        return res.status(200).json({ message: 'Check email for sign-in link', user: data.user ?? null });
      }

      setSessionCookies(res, data.session);

      return res.status(200).json({ user: data.user });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * Refresh endpoint (explicit)
   * - uses refresh token from cookie, refreshes session, sets rotated cookies
   */
  app.post('/api/refresh', authLimiter, async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined;
      if (!refreshToken) return res.status(401).json({ error: 'Missing refresh token' });

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      } as any);

      if (error || !data.session) {
        clearSessionCookies(res);
        return res.status(401).json({ error: 'Unable to refresh session' });
      }

      setSessionCookies(res, data.session);

      return res.status(200).json({ user: data.user });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * Logout
   * - clears cookies. If you want to fully revoke sessions server-side, you'd use admin API (service_role).
   *   We intentionally avoid that here per your request.
   */
  app.post('/api/logout', authLimiter, async (req: Request, res: Response) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res
          .status(400)
          .json({ error: error.message });
      }

      clearSessionCookies(res);

      return res.status(200).json({ message: 'Logged out' });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/session', authLimiter, async (req, res) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE] as string | undefined;

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: 'No access token provided' });
    }

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      return res
        .status(401)
        .json({ error: error.message });
    }

    res.json({ user: data.user });
  });
};

export {
  registerAuthRoutes,
  createRequireAuthMiddleware,
};



// ========================================================

// app.post('/api/signup', async (req, res) => {
//   const { email, password } = req.body;

//   const { data, error } = await supabase.auth.signUp({ email, password });

//   if (error) {
//     return res
//       .status(400)
//       .json({ error: error.message });
//   }

//   res.json(data);
// });

// app.post('/api/signin', async (req, res) => {
//   const { email, password } = req.body;

//   const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//   if (error) {
//     return res
//       .status(400)
//       .json({ error: error.message });
//   }

//   if (!data.session) {
//     return res
//       .status(400)
//       .json({ error: 'No session returned', data });
//   }

//   const { access_token, refresh_token, expires_in } = data.session;

//   res.cookie('access_token', access_token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: expires_in * 1000,
//     path: '/',
//   });
//   res.cookie('refresh_token', refresh_token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     path: '/',
//   });

//   res.json(data);
// });

// app.post('/api/signout', async (req, res) => {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     return res
//       .status(400)
//       .json({ error: error.message });
//   }

//   res.clearCookie('access_token', { path: '/' });
//   res.clearCookie('refresh_token', { path: '/' });

//   res.json({ message: 'Signed out successfully' });
// });
