## Quick Start

### Run dev mode:
- **RECOMMENDED:** VS code -> open "Run and Debug" -> click "Run Server & DB". This will also setup automatically Supabase local DB.
- manual: `nvm use && npm i && npm run startDB && npm run dev`.

### Run production mode: `nvm use && npm i && npm start`.

## Stack

### Backend
- Node + Express.
- Served via [Render.com](https://render.com/).
- Render Dashboard: https://dashboard.render.com/web/srv-d4588an5r7bs73ac1ga0.
- Local dev URL: http://localhost:3100/.
- Public URL: https://yourgym.onrender.com/.
- Pricing model: free tier.

Pricing model Limits:
- 0.1 CPU
- 512 MB

### Persistent Storage
- [Supabase](https://supabase.com)
- Supabase Dashboard: https://supabase.com/dashboard/project/lberawfoejvzxjvausub.
- Local dev Dashboard: http://127.0.0.1:54323/project/default.
- Public/local KEYs switch is done via `process.env` variables.
- Production `process.env` variables are injected and are defined in the Dashboard.
- Pricing model: free tier.

Pricing model Limits:
 - TBD

## Authentication (via Supabase Auth API)

### ⚙️ Strategy

- Use one Supabase client (service or anon key — choose per your needs). Configure `{ auth: { persistSession: false, autoRefreshToken: false } }`.

- Store access & refresh tokens in secure, HttpOnly cookies set by the backend. The backend uses those cookies to call Supabase auth endpoints (signInWithPassword, refreshSession, getUser).

- Middleware checks access token validity; if expired, it attempts a server refresh using the refresh token and rotates tokens (sets fresh cookies). If refresh fails, request is unauthorized.

### Decisions reasoning/tradeoffs

1. 🔒 Disable `persistSession` & `autoRefreshToken` on the server

- Server environments have no browser storage. persistSession expects a storage adapter and will behave unexpectedly if left enabled.

- autoRefreshToken will internally use the refresh token on a timer; that can cause race conditions (refresh token in Supabase is single-use) if your server handles concurrent requests. Disabling them gives you explicit, deterministic control over when refreshes happen.

2. 🛡️ No `adminClient` / `auth.admin.*` calls

- `auth.admin.*` methods require the `service_role` key and are for privileged admin actions (deleting users, revoking sessions).

- Without admin calls you cannot force-revoke server-side sessions in the Supabase auth table; you can still clear cookies and stop the client from using tokens. If you need strict server-side session revocation, add a small admin endpoint protected by your environment and the service_role key later. 