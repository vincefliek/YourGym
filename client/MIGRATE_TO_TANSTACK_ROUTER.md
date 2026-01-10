# Migrate from react-router-dom to @tanstack/router

TL;DR

- Replace `react-router-dom` with `@tanstack/router` and expose a single programmatic navigation API.
- Move all route definitions into a central router instance (hash-history).
- Remove the `Navigator` component and the store-driven `route` / `backRouteWithHistoryReplace` hacks.

Goals and constraints

- Routing must be decoupled from React and fully programmatic.
- Preserve existing route patterns and parameter behavior.
- Keep hash-based URLs (preserve current behavior and tests).

Routes (to preserve)

- `/` (home)
- `/trainings` (trainings)
- `/menu` (menu)
- `/trainings/new` (createTraining)
- `/trainings/:training` (openTraining)
- `/trainings/:training/edit` (editTraining)
- `/trainings/:training/new-exercise` (createExercise)
- `/trainings/:training/:exercise/editNew` (editNewExercise)
- `/trainings/:training/:exercise/edit` (editExistingExercise)
- `/trainings/:training/:exercise` (openExercise)
- `/dashboard` (dashboard)

High-level migration steps

1. Create a central router file
   - Add `client/src/model/navigation/router.ts` that defines the route tree mirroring the above patterns and exports the router instance and helpers for _path generation and param reading_: `generatePath`, `getPathParams`, and the router instance itself.
   - Do NOT call `router.navigate` directly from UI components or other modules. `router.navigate` must be invoked only inside `navigationApi` (see rule below).
   - Use hash history (tanstack/router configured for hash mode) so existing `window.location.hash` behavior stays intact.

2. Update `navigationApi` to be the ONLY caller of `router.navigate`
   - Edit `client/src/model/apis/navigationApi/navigationApi.ts` to remove `store.route` writes and `matchPath` hacks.
   - `navigationApi` will call `router.navigate({ to, replace: true })` (or without `replace`) as needed. No other module should call `router.navigate` directly — all programmatic navigation goes through `navigationApi`.
   - Delete the old `setBackRouteWithReplace` mechanism from the store and from `navigationApi`. Instead, when you need to navigate and replace history, call `navigationApi` which will internally call `router.navigate({ to, replace: true })`.

3. Replace `Routes` / `Route` in `App` with `RouterProvider`
   - In `client/src/components/App/App.tsx` replace usage of `Routes`/`Route` with the router's React integration. Use the same route-to-screen mapping.

4. Remove `Navigator` and store route hack
   - Delete or disable `client/src/components/Navigator/view.tsx` (and controller) which uses `Navigate`.
   - Remove `route` and `backRouteWithHistoryReplace` writes from the store implementation (`client/src/model/store/*`). The legacy "store-driven navigation" mechanism must be removed.
   - Implement `navigationApi.goBack()` to call `router.navigate({ to: '..' })` for normal back, or `router.navigate({ to: '..', replace: true })` when you need replace semantics. Again: `router.navigate` is invoked only inside `navigationApi`.

5. Update entry and tests
   - Replace `HashRouter` in `client/src/index.tsx` with a provider from the new router (`RouterProvider`), and ensure `initApp()` returns or wires the router instance used by `navigationApi`.
   - Update test helpers such as `client/src/test-utils/renderApp.tsx` to render the app with the router provider instead of `HashRouter`. Replace assertions that read `window.location.hash` with a small helper `getUrlNavPath()` that reads from the router when possible, or continue reading hash if easier while the router uses hash history.

6. Sweep components for remaining rrd usages
   - Replace imports/usages of: `Navigate`, `Routes`, `Route`, `matchPath`, `generatePath`, `HashRouter`, `useNavigate`, and any direct `window.location.hash`/`window.history.back` calls with `navigationApi` wrappers or path helpers exposed by the central router (e.g., `generatePath`, `getPathParams`).
   - Update `AuthProtection` (`client/src/screens/authProtection/view.tsx`) in terms of the usage of `Outlet` to the appropriate substitute from tanstack/router.

Testing & compatibility notes

- Keep hash-history to avoid changing server configuration and preserve existing deep-link behavior.
- Update tests that rely on `window.location.hash` to use the router instance.
- Provide a small test helper that returns the router instance used by the app for assertions when needed.

Back-route-with-replace behavior

- Remove the `setBackRouteWithReplace` mechanism entirely.
- When you need to navigate with replace semantics, call `navigationApi` which will execute `router.navigate({ to: <path>, replace: true })` internally.
- For returning to the previous logical route, implement `navigationApi.goBack()` which calls `router.navigate({ to: '..' })`. If the caller needs to perform a replace instead of a push, `goBack()` may be called with a flag and then call `router.navigate({ to: '..', replace: true })` internally.

Important rule: `router.navigate` must be encapsulated inside `navigationApi` only; no other file should call `router.navigate` or use the router's history directly.

Files to change (suggested order)

- `client/src/model/navigation/router.ts` (new)
- `client/src/model/apis/navigationApi/navigationApi.ts`
- `client/src/components/App/App.tsx`
- `client/src/components/Navigator/*` (remove)
- `client/src/model/store/*` (remove `route`/`backRouteWithHistoryReplace` usage)
- `client/src/index.tsx`
- `client/src/test-utils/renderApp.tsx` and tests under `client/src/test-user-stories/`
- Sweep: any file importing from `react-router-dom`

Quick commands to run locally after migration

```bash
# from client
npm run build # or npm run start during development
# run tests
npm test
```
