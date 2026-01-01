// import { createRAFInterval } from '../../utils';
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
  // let _stopPeriodicTasks = () => {};
  const resumeManager = new ResumeManager();

  /* ========= LIFECYCLE ========= */

  checkAuthStatus();
  checkSyncStatus();
  // runPeriodicTasks(); // TEMP disabled for testing

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
        // stopPeriodicTasks(); // TEMP disabled for testing
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

    // runPeriodicTasks(); // TEMP disabled for testing
  }

  function checkAuthStatus() {
    return authApi.getSession();
  }

  function checkSyncStatus() {
    return syncApi.hasServerChanges();
  }

  // function stopPeriodicTasks() {
  //   _stopPeriodicTasks();
  // }

  // function runPeriodicTasks() {
  //   const ONE_MINUTE = 1000 * 60;
  //   const PERIODIC_TASKS_TIME_MS = ONE_MINUTE * 5;
  //   _stopPeriodicTasks = createRAFInterval(() => {
  //     checkSyncStatus();
  //   }, PERIODIC_TASKS_TIME_MS);
  // }

  let _hydrateInProgress = false;
  let _hydrationStart = 0;

  async function hydrateStoreFromServer() {
    // TODO: skip in tests until properly configured for tests
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    // a lock prevents concurrent hydrations
    if (_hydrateInProgress) {
      return;
    }

    try {
      const hasServerDataInIndexedDB = await store.hasServerDataInIndexedDB();

      if (!hasServerDataInIndexedDB) {
        if (store.auth?.isAuthenticated) {
          _hydrationStart = performance.now();

          _hydrateInProgress = true;

          store.uiBlockingLayer = {
            isVisible: true,
            message: 'Hydrating local store with data from server...',
          };

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
      const errorMessage = `[HydrateStoreFromServer] ⚠️ Failed to hydrate store from server. Error: ${error?.message || String(error) || 'Unknown error'}`;

      notificationsApi.addNotification({
        type: 'error',
        message: errorMessage,
      });
      console.error(errorMessage);
    } finally {
      _hydrateInProgress = false;

      const removeUiBlockingLayer = () => {
        store.uiBlockingLayer = {
          isVisible: false,
          message: undefined,
        };
      };

      const hydrationDuration = performance.now() - _hydrationStart;

      if (hydrationDuration < 1000) {
        setTimeout(() => {
          removeUiBlockingLayer();
        }, 1500);
      } else {
        removeUiBlockingLayer();
      }
    }
  }

  function isChangedAndNewValueTrue(
    prevValue: boolean | undefined,
    newValue: boolean | undefined,
  ): boolean {
    return prevValue !== newValue && newValue === true;
  }
};
