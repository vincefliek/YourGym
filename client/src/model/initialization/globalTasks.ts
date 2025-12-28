import { createRAFInterval } from '../../utils';
import { ResumeManager } from './resumeManager';
import { AppAPIs, Store } from '../types';

export const initGlobalTasks = (
  store: Store,
  {
    authApi,
    syncApi,
    trainingsApi,
    trainingsServerApi,
    notificationsApi,
  }: AppAPIs,
) => {
  let _stopPeriodicTasks = () => {};
  const resumeManager = new ResumeManager();

  /* ========= LIFECYCLE ========= */

  checkAuthStatus();
  checkSyncStatus();
  runPeriodicTasks();

  resumeManager.init({
    onResume: resumeAppFromBackground,
    onRetryFailed: async (err) => {
      notificationsApi.addNotification({
        type: 'error',
        message: `Resume from background failed. Error: ${err?.message || String(err)}`,
      });
    },
  });

  window.document.addEventListener(
    'visibilitychange',
    () => {
      // move into background / tab becomes inactive
      if (document.visibilityState === 'hidden') {
        stopPeriodicTasks();
      }
    },
    false,
  );

  let _prevIsAuthenticated = store.auth?.isAuthenticated;

  store.subscribe(() => {
    if (
      isChangedAndNewValueTrue(
        _prevIsAuthenticated,
        store.auth?.isAuthenticated,
      )
    ) {
      _prevIsAuthenticated = store.auth?.isAuthenticated;

      void hydrateStoreFromServer();
    }
  }, ['auth']);

  /* ========= IMPLEMENTATION ========= */

  async function resumeAppFromBackground() {
    // return from background / tab becomes active
    await Promise.all([checkAuthStatus(), checkSyncStatus()]);
    // wait for auth check before hydration
    await hydrateStoreFromServer();
    runPeriodicTasks();
  }

  function checkAuthStatus() {
    return authApi.getSession();
  }

  function checkSyncStatus() {
    return syncApi.hasServerChanges();
  }

  function stopPeriodicTasks() {
    _stopPeriodicTasks();
  }

  function runPeriodicTasks() {
    const ONE_MINUTE = 1000 * 60;
    const PERIODIC_TASKS_TIME_MS = ONE_MINUTE * 5;
    _stopPeriodicTasks = createRAFInterval(() => {
      checkSyncStatus();
    }, PERIODIC_TASKS_TIME_MS);
  }

  let _hydrateInProgress = false;

  async function hydrateStoreFromServer() {
    // a lock prevents concurrent hydrations
    if (_hydrateInProgress) {
      return;
    }

    try {
      // TODO: add UI indication of hydration in progress

      const hasServerDataInIndexedDB = await store.hasServerDataInIndexedDB();

      if (!hasServerDataInIndexedDB) {
        if (store.auth?.isAuthenticated) {
          _hydrateInProgress = true;

          console.log(
            '[HydrateStoreFromServer] 🏗️ Starting hydration from server...',
          );

          // Promise.all preserves the order of the results
          const [serverCompletedTrainings] = await Promise.all([
            trainingsServerApi.get.completedTrainings(),
          ]);

          const clientCompletedTrainings =
            trainingsServerApi.mappers.toClientCompletedTrainings(
              serverCompletedTrainings,
            );

          trainingsApi.update.completedTrainings(clientCompletedTrainings);

          console.log(
            '[HydrateStoreFromServer] ✅ Hydration from server completed successfully!',
          );
        }
      }
    } catch (error: any) {
      console.error(
        '[HydrateStoreFromServer] ⚠️ Failed to hydrate store from server. Error:',
        error?.message || String(error) || 'Unknown error',
      );
    } finally {
      _hydrateInProgress = false;
    }
  }

  function isChangedAndNewValueTrue(
    prevValue: boolean | undefined,
    newValue: boolean | undefined,
  ): boolean {
    return prevValue !== newValue && newValue === true;
  }
};
