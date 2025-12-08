import { createRAFInterval } from '../utils';
import { AppAPIs, Store } from './types';

export const initGlobalTasks = (
  store: Store,
  apis: AppAPIs,
) => {
  let _stopPeriodicTasks = () => {};

  /* ========= LIFECYCLE ========= */

  checkAuthStatus();
  checkSyncStatus();
  runPeriodicTasks();

  window.document.addEventListener('visibilitychange', () => {
    // return from background / tab becomes active
    if (document.visibilityState === 'visible') {
      checkAuthStatus();
      checkSyncStatus();
      runPeriodicTasks();
    }

    // move into background / tab becomes inactive
    if (document.visibilityState === 'hidden') {
      stopPeriodicTasks();
    }
  }, false);

  /* ========= IMPLEMENTATION ========= */

  function checkAuthStatus() {
    void apis.authApi.getSession();
  };

  function checkSyncStatus() {
    void apis.syncApi.hasServerChanges();
  };

  function stopPeriodicTasks() {
    _stopPeriodicTasks();
  }

  function runPeriodicTasks() {
    const ONE_MINUTE = 1000 * 60;
    const PERIODIC_TASKS_TIME_MS = ONE_MINUTE * 5;
    _stopPeriodicTasks = createRAFInterval(() => {
      checkSyncStatus();
    }, PERIODIC_TASKS_TIME_MS);
  };
};
