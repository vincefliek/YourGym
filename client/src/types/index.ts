import { Store, NavigationApi, TrainingsApi } from '../model/types';

export interface AppAPIs {
  navigationApi: NavigationApi;
  trainingsApi: TrainingsApi;
}

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

export interface AppProps {}
