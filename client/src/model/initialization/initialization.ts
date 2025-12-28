import { Store } from '../store';
import { createAPIs } from '../apis';
import { Validator } from '../validation';
import { initGlobalTasks } from './globalTasks';

export const initApp = async () => {
  const store = new Store();
  const validator = new Validator();

  try {
    // TODO: skip in tests, becase next test block is affected by previous test data from indexedDB
    if (process.env.NODE_ENV !== 'test') {
      await store.hydrateFromIndexedDB();
    }
  } catch (error: any) {
    console.error(
      '[initApp] hydrateFromIndexedDB failed. Error:',
      error?.message || String(error) || 'Unknown error',
    );
  }

  const apis = createAPIs({
    store,
    validator,
  });

  const appContext = {
    serviceLocator: {
      getStore: () => ({
        getStoreData: store.getStoreData,
        subscribe: store.subscribe,
      }),
      getAPIs: () => apis,
    },
  };

  initGlobalTasks(store, apis);

  // if (process.env.NODE_ENV === 'development') {
  window._debugTools_ = {
    store,
    validator,
    apis,
  };
  // }

  return {
    apis,
    appContext,
  };
};
