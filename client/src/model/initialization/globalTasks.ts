import { createRAFInterval } from '../../utils';
import { ResumeManager } from './resumeManager';
import { AppAPIs, Store } from '../types';

export const initGlobalTasks = (store: Store, apis: AppAPIs) => {
  let _stopPeriodicTasks = () => {};
  const resumeManager = new ResumeManager();

  /* ========= LIFECYCLE ========= */

  checkAuthStatus();
  checkSyncStatus();
  runPeriodicTasks();

  resumeManager.init({
    onResume: resumeAppFromBackground,
    onRetryFailed: async (err) => {
      apis.notificationsApi.addNotification({
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

  /* ========= IMPLEMENTATION ========= */

  async function resumeAppFromBackground() {
    // return from background / tab becomes active
    await Promise.all([checkAuthStatus(), checkSyncStatus()]);
    runPeriodicTasks();
  }

  function checkAuthStatus() {
    return apis.authApi.getSession();
  }

  function checkSyncStatus() {
    return apis.syncApi.hasServerChanges();
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
};
