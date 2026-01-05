# Copilot / Agent Instructions for YourGym

These concise notes help an AI coding agent be immediately productive in this repository.

## Big Picture

- **Client:** A React + TypeScript SPA under [client](client) (entry: [client/src/index.tsx](client/src/index.tsx)). UI is componentized under [client/src/components](client/src/components) and screen-level containers under [client/src/screens](client/src/screens).
- **Server:** A TypeScript server under [server](server) (entry: [server/src/index.ts](server/src/index.ts)). Routes and auth logic live in [server/src/routes.ts](server/src/routes.ts) and [server/src/auth](server/src/auth).
- **Shared types (TBD):** Type definitions shared between client and server will be in [server-client-interfaces](server-client-interfaces) in the future.
- **Data / DB:** Project is offline first PWA. Firstly data is being saved into indexedDB, then user manually syncs data into Supabase DB. There's a "sync" button in the menu screen for that. Supabase setup and connection logic is in [server/src/supabase](server/src/supabase).

## Developer workflows (must-know commands)

- Start the DB (server-local script): from `server` run `npm run startDB`.
- Stop the DB: from `server` run `npm run stopDB`.
- Start the development server for `server`: from `server` run `npm run dev` — the VS Code task `start dev server` depends on the DB startup.
- Start the development server for `client`: from `client` run `npm run start` (not needed if only inspecting the code).
- Build the client for production: from `client` run `npm run build`.
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

## Project-specific conventions & patterns

- Component structure: many components follow a `controller` / `view` split. Example: [client/src/components/Navbar/controller.ts](client/src/components/Navbar/controller.ts) and [client/src/components/Navbar/view.tsx](client/src/components/Navbar/view.tsx).
- client APIs' responsibilities: APIs contain business logic for trainings, exercises, user data management, HTTP calls to the server, and local indexedDB interactions.
- Controller`s responsibilities: data fetching, state management, and event handlers.
- View`s responsibilities: purely presentational, receives props from controller.
- Styling: CSS Modules with `.module.scss` files live next to components (e.g., `style.module.scss`).
- Re-exports: folders frequently expose public APIs via `index.ts` — prefer importing from the folder root (e.g., `components/Button`).
- Types: component- and feature-level `types.ts` files are common; prefer reading `types.ts` alongside the component for prop shapes.
- Model / API: client HTTP interactions are organized under [client/src/model/apis](client/src/model/apis) and a `store` folder for state logic.
- Initialization & global tasks: see [client/src/model/initialization.ts](client/src/model/initialization.ts) and [client/src/model/globalTasks.ts](client/src/model/globalTasks.ts) for app startup hooks.

## Integration points & cross-component communication

- APIs: server endpoints are declared in [server/src/routes.ts](server/src/routes.ts); client calls live in `client/src/model/apis`.
- Auth: there is an `auth` area on the server and client-side auth APIs — inspect [server/src/auth](server/src/auth) and the client `authApi` folder under `model/apis`.
- Shared interfaces (TBD): cross-compiled contracts will live in [server-client-interfaces](server-client-interfaces) — update these when changing request/response shapes.

## Guidance for edits and PRs (practical rules an agent should follow)

- Prefer minimal, focused changes that follow existing patterns (e.g. business logic in APIs, controller/view, `index.ts` re-exports, `types.ts`).
- When adding endpoints, update the shared types in [server-client-interfaces](server-client-interfaces) and client `model/apis` together.
- Keep styling local to a component using `.module.scss` unless a global variable in `client/src/components/common` is required.

## General recommendations

If anything is unclear or you want more examples (specific component flows, common request shapes, or the DB setup), tell me which area to expand and I will update this file.

## Tests in the client codebase

**There are several kinds of tests in the codebase:**

- Integration tests: see `client/src/test-user-stories` for user story-based integration tests. Main idea: they work end-to-end within the client app, only interacting with the UI controls via DOM (specifically via `@testing-library/user-event` and "data-testid" HTML attributes). Main goal: cover critical user flows (e.g., training flow, auth flow, data sync flow) to prevent regressions.
- Unit tests: see examples in `client/src/model/apis/authApi/test/`, `client/src/model/initialization/resumeManager.test.ts`. Main idea: cover business logic in isolation (e.g., API data transformations, utility functions, component rendering with various props). Main goal: cover all branches and edge cases, basically to test every line of the isolated unit.

**Integration tests principles, patterns, key utilities:**

- setup file - `client/src/setupTests.ts`. It configures global test environment, sets up global mocks (e.g. for `window.fetch`, `window.indexedDB`), and provides common utilities for tests (e.g. `apiMocks` for mocking HTTP requests to the server).
- `driver` - `client/src/test-utils/driver.ts`. It provides a high-level API for common tasks in tests. Also, it abstracts away some low-level DOM interactions, making tests more readable and maintainable.
- `data-testid` attributes - used extensively in the codebase to identify elements in tests. They provide a stable way to select elements, independent of styling or layout changes.
- Test user stories - `client/src/test-user-stories/`. Each file represents a specific user story or flow in the app. They are organized by feature or area (e.g., `inProgressTraining`, `authFlows`).
- Mocking backend API responses - `apiMocks` utility in `client/src/test-utils/mocks/apiMocks.ts`. It allows defining mock responses for server endpoints, enabling tests to run in isolation without relying on a real backend.
- Common patterns - tests typically follow the Arrange-Act-Assert pattern, setting up the initial state, performing user actions via the `driver`, and asserting expected outcomes in the DOM.

**MUST HAVE RULES in integration tests (NEVER skip these rules)**:

- ALWAYS render app via `driver.render.app()` to ensure consistent setup.
- ALWAYS query DOM elements via `driver.waitFor` methods to ensure we don't query elements after the test is completed.
- ALWAYS query DOM elements via `data-testid` attributes for stability.
- ALWAYS use `userEvent` from `@testing-library/user-event` for simulating user interactions (clicks, typing, etc.) to better mimic real user behavior.
- ALWAYS wrap `userEvent` from `@testing-library/user-event` with `act(...)` from `react` to ensure all state updates and effects are processed before assertions.
- ALWAYS check for element presence or absence using `await expect(...).resolves` or `await expect(...).rejects` patterns to handle asynchronous DOM updates correctly.
- ALWAYS check for the expected screen after navigation or actions that do navigation to facilitate further maintenance and debugging. Example: `expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();`
- ALWAYS wait for element to disappear/to be removed via `waitForElementToBeRemoved` from `@testing-library/react`.

**TROUBLESHOOTING:**:

- If the test can't/wait for find a needed DOM element, then firstly check that it was queried with the correct value of the `data-testid`.
- If the test can't/wait for find a needed DOM element (e.g. there is a suspection of the flakiness), then wrap the failed code into `waitFor(...)` from `@testing-library/react`.
