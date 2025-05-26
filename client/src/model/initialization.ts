import { Store } from './store';
import { createAPIs } from './apis';
import { Validator } from './validation';

export const initApp = () => {
  const store = new Store();
  const validator = new Validator();

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
