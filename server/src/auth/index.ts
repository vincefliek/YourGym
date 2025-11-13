import type { Express, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import type { Session, SupabaseClient, AuthResponse } from '@supabase/supabase-js';

import { routes } from '../routes';

const { COOKIE_DOMAIN = undefined, NODE_ENV } = process.env;

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const isDevEnv = NODE_ENV === 'development';

const sameMandatoryCookieOptions = {
  httpOnly: true,
  secure: isDevEnv ? false : true,
  sameSite: isDevEnv ? 'lax' as const : 'none' as const,
  path: '/',
  domain: COOKIE_DOMAIN,
};

const getCookieOptions = (maxAgeSec: number) => ({
  ...sameMandatoryCookieOptions,
});

/**
 * https://expressjs.com/en/api.html#res.clearCookie
 * 
 * IMPORTANT!
 * Web browsers and other compliant clients will only clear the cookie
 * if the given options is identical to those given to `res.cookie()`
 */
const getClearCookieOptions = () => ({
  ...sameMandatoryCookieOptions,
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
  res.clearCookie(ACCESS_TOKEN_COOKIE, getClearCookieOptions());
  res.clearCookie(REFRESH_TOKEN_COOKIE, getClearCookieOptions());
}

const assignAuthDataToRequest = (req: Request, data: AuthResponse['data']) => {
  (req as any).auth = { user: data.user, session: data.session };
};
const clearAuthDataFromRequest = (req: Request) => {
  assignAuthDataToRequest(req, { user: null, session: null });
};
export const getAuthDataFromRequest = (req: Request): AuthResponse['data'] => {
  return (req as any).auth ?? {};
}

/**
 * Middleware: protect routes.
 * - tries to read access token from cookie and get user.
 * - if access token expired, tries to refresh using refresh token.
 * - if refresh successful, rotates tokens and continues.
 */
// const createRequireAuthMiddleware = (supabase: () => SupabaseClient) => {
//   async function requireAuth(req: Request, res: Response, next: NextFunction) {
//     try {
//       const accessToken = req.cookies[ACCESS_TOKEN_COOKIE] as string | undefined;
//       const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined;

//       if (!accessToken) {
//         return res.status(401).json({ error: 'Missing access token' });
//       }

//       // Try to get user using current access token
//       const { data: userData, error: userErr } = await supabase().auth.getUser(accessToken);

//       if (userErr) {
//         // If token expired / invalid, try refresh path
//         if (refreshToken) {
//           const { data: refreshData, error: refreshErr } = await supabase().auth.refreshSession({
//             refresh_token: refreshToken,
//           });

//           if (refreshErr || !refreshData?.session) {
//             clearSessionCookies(res);
//             return res.status(401).json({ error: 'Failed to refresh session' });
//           }

//           // rotate: set new cookies
//           setSessionCookies(res, refreshData.session);

//           // attach user to req and continue
//           assignAuthDataToRequest(req, refreshData);

//           return next();
//         } else {
//           return res.status(401).json({ error: 'Access token invalid and no refresh token' });
//         }
//       }

//       // success: attach user
//       assignAuthDataToRequest(req, { user: userData.user, session: null });

//       next();
//     } catch (err) {
//       return res.status(500).json({ error: 'Internal auth error' });
//     }
//   }
//   return requireAuth;
// };
const createRequireAuthMiddleware = (supabase: () => SupabaseClient) => {
  async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers['authorization']?.split(' ')[1];

      if (!accessToken) {
        return res.status(401).json({ error: 'Missing access token' });
      }

      // Try to get user using current access token
      const { data: userData, error: userErr } = await supabase().auth.getUser(accessToken);

      // If token expired / invalid
      if (userErr || !userData.user) {
        clearAuthDataFromRequest(req);
        return res
          .status(401)
          .json({ error: 'Access token is invalid' });
      }

      // attach user to req and continue
      assignAuthDataToRequest(req, {
        user: userData.user,
        session: null,
      });

      next();
    } catch (err) {
      return res.status(500).json({ error: 'Internal auth error' });
    }
  }
  return requireAuth;
};

const registerAuthRoutes = (app: Express, supabase: () => SupabaseClient) => {
  /**
   * Signup
   * - creates user using email+password
   * - returns httpOnly cookies (access+refresh) on success
   */
  app.post(routes.signup, authLimiter, async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'email and password required' });

      const { data, error } = await supabase().auth.signUp({
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

      return res.status(201).json({
        user: data.user,
        session: data.session,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post(routes.signin, authLimiter, async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'email and password required' });
      }

      const { data, error } = await supabase().auth.signInWithPassword({
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

      return res.status(200).json({
        user: data.user,
        session: data.session,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * Logout
   * - clears cookies. If you want to fully revoke sessions server-side, you'd use admin API (service_role).
   *   We intentionally avoid that here per your request.
   */
  app.post(routes.logout, authLimiter, async (req: Request, res: Response) => {
    try {
      const { error } = await supabase().auth.signOut();

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

  /**
   * Refresh endpoint (explicit)
   * - uses refresh token from cookie, refreshes session, sets rotated cookies
   */
  app.post(routes.refreshSession, authLimiter, async (req: Request, res: Response) => {
    try {
      const refreshToken = req.body.refreshToken as string | undefined;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Missing refresh token' });
      }

      const { data, error } = await supabase().auth.refreshSession({
        refresh_token: refreshToken,
      } as any);

      if (error || !data.session) {
        clearSessionCookies(res);
        return res.status(401).json({ error: 'Unable to refresh session' });
      }

      setSessionCookies(res, data.session);

      return res.status(200).json({
        user: data.user,
        session: data.session,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};

export {
  registerAuthRoutes,
  createRequireAuthMiddleware,
};
