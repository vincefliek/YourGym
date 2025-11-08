# Frontend Authentication Infra Layer Plan

## 1. Folder & File Structure

- Create a dedicated folder `src/model/apis/authApi/`.
- Main files:
  - `authApi.ts` – Contains a factory function `createAuthApi` (similar to `createTrainingsApi`).
    - All business logic and API methods (signup, signin, signout, getSession, token management, state updates, validation, error handling) are implemented and exposed from this factory.
    - No separate `authService.ts` file is needed; keep all logic inside `createAuthApi`.
    - Example structure:
      ```ts
      export const createAuthApi = (tools: { store: Store, validator: Validator }) => {
        // All business logic, API calls, token management, validation, error handling
        return {
          signup,
          signin,
          signout,
          getSession,
          // ...other methods
        };
      };
      ```
  - `authTypes.ts` – Types/interfaces for auth data (User, AuthState, etc.).
  - `authValidation.ts` – Input validation for auth forms.
  - `auth.test.ts` – Unit tests for infra logic.
  - `index.ts` - export only 1 function `createAuthApi` from `authApi.ts`.
    - Example:
      ```ts
      export { createAuthApi } from './authApi';
      ```
- Register `createAuthApi` in the system by following the pattern of existing APIs (e.g. `createTrainingsApi`).
  - Update initialization logic to include `createAuthApi` in your service locator or API registry.

### Implementation Notes
- All authentication-related business logic (API calls, token/session management, state updates, error handling, validation) must be encapsulated in the `createAuthApi` factory.
- The factory receives dependencies (e.g. store, validator) and returns an object exposing all auth methods.
- This approach keeps the infra layer clean, testable, and easy to extend, without scattering logic across multiple files.

## 2. API Layer

- Use `fetch` for HTTP requests to `/api/signup`, `/api/signin`, `/api/signout`, `/api/session`.
- Always use the correct backend base URL depending on environment:
  - Development: `http://localhost:3100`
  - Production: `https://yourgym.onrender.com/`
- Implement a utility to resolve the backend URL based on `process.env.NODE_ENV`:
  ```ts
  const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://yourgym.onrender.com'
    : 'http://localhost:3100';
  // Usage: fetch(`${BASE_URL}/api/signin`, ...)
  ```
- Ensure all API calls use the resolved base URL.
- For cookies, set `credentials: 'include'` in fetch options to allow cookie-based auth/session management.
- Example implementation:
  ```ts
  export async function signin(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/signin`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // important for cookies
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }
  ```

## 3. Session & Token Management

- Do NOT use localStorage/sessionStorage for tokens.
- Supabase returns tokens in the response body, not via cookies. You must handle tokens manually in the frontend.
- Store tokens in cookies (preferably httpOnly, set by backend if possible). If backend cannot set httpOnly cookies, use secure, short-lived, in-memory storage for access tokens. For refresh tokens, if you must store them, use cookies with `Secure` and `SameSite=Strict` attributes.
- On signin/signup, extract `access_token`, `refresh_token`, `expires_in`, and `expires_at` from the response body (`data.session`).
- On signout, clear all cookies and tokens (via backend endpoint or by expiring cookies in frontend).
- Implement token refresh logic:
  - When access token expires, use the refresh token (from cookie or memory) to request a new access token from Supabase (via your backend `/api/refresh` endpoint).
  - Create a function (e.g. `refreshToken(refreshToken: string)`) that calls the backend refresh endpoint, passing the refresh token, and updates the access token.
  - Automatically attempt token refresh on 401/expired token responses.
- Example:
  ```ts
  // Store tokens in cookies
  document.cookie = `access_token=${accessToken}; path=/; Secure; SameSite=Strict`;
  document.cookie = `refresh_token=${refreshToken}; path=/; Secure; SameSite=Strict`;

  // Refresh token logic
  export async function refreshToken(refreshToken: string) {
    const res = await fetch(`${BASE_URL}/api/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    // Update tokens in cookies
    return data;
  }
  ```
- Never expose tokens to UI components. Keep all token logic in the infra layer.
- Ensure all session management logic (get/set/clear user, token refresh) is handled via cookies and backend endpoints, not localStorage.

## 4. Auth State Management

- Use your custom Store (see `store.ts`) to manage auth state.
- Add new state fields: `user`, `accessToken`, `isAuthenticated`, `authLoading`, `authError`.
- Add subscribers for auth state changes.
- Update state on signin/signup/signout.
- Example:
  ```ts
  store.state.auth = { user: null, accessToken: null, isAuthenticated: false, authLoading: false, authError: null };
  // ...
  store._updateStoreData(/* ... */);
  ```

## 5. Input Validation

- Implement validation functions in `authValidation.ts`.
- Validate email/password before calling API.
- Return error messages for invalid input.
- Example:
  ```ts
  if (!validateEmail(email)) return { error: 'Invalid email format' };
  ```

## 6. Error Handling

- Catch and normalize errors from API calls.
- Store error messages in auth state (`authError`).
- Provide clear error codes/messages for UI.
- Example:
  ```ts
  try { await signin(email, password); } catch (e) { store.state.auth.authError = e.message; }
  ```

## 7. Security Best Practices

- Never store sensitive tokens in JS-accessible storage if avoidable.
- Always use HTTPS for API requests.
- Sanitize all inputs before sending to backend.
- Do not store passwords anywhere in frontend.

## 8. Testing

- Instead of a single `auth.test.ts` file, create a dedicated `test/` folder in your project root or inside `src/model/apis/authApi/`.
- For each endpoint or feature, create a separate test file:
  - `test/signup.test.ts`
  - `test/signin.test.ts`
  - `test/signout.test.ts`
  - `test/session.test.ts`
  - `test/refreshToken.test.ts`
- For shared setup logic (e.g. test environment, global mocks), create `test/setup.ts`.
- For reusable mock data (e.g. user objects, token payloads), create `test/mockData.ts`.
- If you need shared utility functions for tests (e.g. token extraction, cookie parsing), create `test/utils.ts`.
- Example structure:
  ```
  test/
    setup.ts
    mockData.ts
    utils.ts
    signup.test.ts
    signin.test.ts
    signout.test.ts
    session.test.ts
    refreshToken.test.ts
  ```
- Use Jest, Vitest, or your preferred test runner.
- Mock fetch and cookie APIs as needed.
- Test edge cases: invalid input, expired token, network errors, etc.
- Keep tests isolated and easy to maintain.

## 9. Extensibility

- Design API/service to allow future features:
  - Password reset: add `resetPassword(email)` API.
  - Email verification: add `verifyEmail(token)` API.
  - Social login: add `loginWithProvider(provider, token)` API.
- Keep logic decoupled from UI and easy to extend.

## 10. Documentation

- Document all public methods, expected inputs/outputs, and error handling in code comments and README.
- Provide usage examples for other developers.
- Example:
  ```ts
  /**
   * Sign in user
   * @param email User email
   * @param password User password
   * @returns Auth response
   */
  export async function signin(email: string, password: string): Promise<AuthResponse> { /* ... */ }
  ```
