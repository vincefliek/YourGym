import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

import { Store } from './store';
import { createAPIs } from './apis';
import { Validator } from './validation';

export const initApp = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyBm80icd-F0c8tJZO1uYlKMlLa4Coau81A',
    authDomain: 'your-gym-b564f.firebaseapp.com',
    databaseURL:
      'https://your-gym-b564f-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'your-gym-b564f',
    storageBucket: 'your-gym-b564f.appspot.com',
    messagingSenderId: '933355137079',
    appId: '1:933355137079:web:515ec1551eb8ab84c677b2',
  };

  const firebaseApp = initializeApp(firebaseConfig);

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
