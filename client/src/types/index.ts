import { Store, NavigationApi, TrainingsApi, AuthApi } from '../model/types';

export interface AppAPIs {
  navigationApi: NavigationApi;
  trainingsApi: TrainingsApi;
  authApi: AuthApi;
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
