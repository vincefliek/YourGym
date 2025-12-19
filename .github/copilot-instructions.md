# Copilot / Agent Instructions for YourGym

These concise notes help an AI coding agent be immediately productive in this repository.

**Big Picture**
- **Client:** A React + TypeScript SPA under [client](client) (entry: [client/src/index.tsx](client/src/index.tsx)). UI is componentized under [client/src/components](client/src/components) and screen-level containers under [client/src/screens](client/src/screens).
- **Server:** A TypeScript server under [server](server) (entry: [server/src/index.ts](server/src/index.ts)). Routes and auth logic live in [server/src/routes.ts](server/src/routes.ts) and [server/src/auth](server/src/auth).
- **Shared types (TBD):** Type definitions shared between client and server will be in [server-client-interfaces](server-client-interfaces) in the future.
- **Data / DB:** Project is offline first PWA. Firstly data is being saved into indexedDB, then user manually syncs data into Supabase DB. There's a "sync" button in the menu screen for that. Supabase setup and connection logic is in [server/src/supabase](server/src/supabase).

**Developer workflows (must-know commands)**
- Start the DB (server-local script): from `server` run `npm run startDB`.
- Stop the DB: from `server` run `npm run stopDB`.
- Start the development server (server): from `server` run `npm run dev` — the VS Code task `start dev server` depends on the DB startup.
- Client build artifacts are in `client/build` and the client source is in `client/src`.

Example (shell):
```
cd server
npm run startDB
npm run dev

cd ../client
# build or inspect
npm run build
```

**Project-specific conventions & patterns**
- Component structure: many components follow a `controller` / `view` split. Example: [client/src/components/Navbar/controller.ts](client/src/components/Navbar/controller.ts) and [client/src/components/Navbar/view.tsx](client/src/components/Navbar/view.tsx).
- client APIs' responsibilities: APIs contain business logic for trainings, exercises, user data management, HTTP calls to the server, and local indexedDB interactions.
- Controller`s responsibilities: data fetching, state management, and event handlers.
- View`s responsibilities: purely presentational, receives props from controller.
- Styling: CSS Modules with `.module.scss` files live next to components (e.g., `style.module.scss`).
- Re-exports: folders frequently expose public APIs via `index.ts` — prefer importing from the folder root (e.g., `components/Button`).
- Types: component- and feature-level `types.ts` files are common; prefer reading `types.ts` alongside the component for prop shapes.
- Model / API: client HTTP interactions are organized under [client/src/model/apis](client/src/model/apis) and a `store` folder for state logic.
- Initialization & global tasks: see [client/src/model/initialization.ts](client/src/model/initialization.ts) and [client/src/model/globalTasks.ts](client/src/model/globalTasks.ts) for app startup hooks.

**Integration points & cross-component communication**
- APIs: server endpoints are declared in [server/src/routes.ts](server/src/routes.ts); client calls live in `client/src/model/apis`.
- Auth: there is an `auth` area on the server and client-side auth APIs — inspect [server/src/auth](server/src/auth) and the client `authApi` folder under `model/apis`.
- Shared interfaces (TBD): cross-compiled contracts will live in [server-client-interfaces](server-client-interfaces) — update these when changing request/response shapes.

**Tests & quick checks**
- Client tests: see `client/src/setupTests.ts` and component tests (example: `client/src/components/App/App.test.tsx`). Run client tests with the client package scripts.

**Guidance for edits and PRs (practical rules an agent should follow)**
- Prefer minimal, focused changes that follow existing patterns (e.g. business logic in APIs, controller/view, `index.ts` re-exports, `types.ts`).
- When adding endpoints, update the shared types in [server-client-interfaces](server-client-interfaces) and client `model/apis` together.
- Keep styling local to a component using `.module.scss` unless a global variable in `client/src/components/common` is required.

If anything is unclear or you want more examples (specific component flows, common request shapes, or the DB setup), tell me which area to expand and I will update this file.
