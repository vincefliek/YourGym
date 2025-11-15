import { Store, AppAPIs } from '../model/types';

export interface AppContext {
  serviceLocator: {
    getStore: () => {
      getStoreData: Store['getStoreData'];
      subscribe: Store['subscribe'];
    };
    getAPIs: () => AppAPIs;
  };
}

export interface AppState {}

export interface AppProps {
  apis: AppAPIs;
  appContext: AppContext;
}
