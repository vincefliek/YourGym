import { Store } from './store';
import { createAPIs } from './apis';
import { Validator } from './validation';

export const initApp = async () => {
  const store = new Store();
  const validator = new Validator();

  await store.hydrateFromIndexedDB();

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

  const checkAuthStatus = () => {
    if (document.visibilityState === 'visible') {
      void apis.authApi.getSession();
    }
  };

  checkAuthStatus();

  window.document.addEventListener('visibilitychange', (e) => {
    console.log('>>> VISIBILITYCHANGE event <<<', e);
    checkAuthStatus();
  }, false);

  if (process.env.NODE_ENV === 'development') {
    window._debugTools_ = {
      store,
      validator,
      apis,
    };
  }

  return {
    apis,
    appContext,
  };
};
