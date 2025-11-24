import { AppContext } from '../../types';
import { MenuController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): MenuController => {
  const store = serviceLocator.getStore();
  const { trainingsApi } = serviceLocator.getAPIs();

  const getStoreData = () => store.getStoreData(controller.storeDataAccessors);

  return {
    getAuthData: () => {
      const auth = getStoreData().auth;
      return {
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.authLoading,
        error: auth.authError,
      };
    },
    getSyncData: () => {
      const sync = getStoreData().sync;
      return {
        lastSyncAt: sync.lastSyncAt,
        isLoading: sync.isLoading,
        serverHasChanges: sync.serverHasChanges,
        error: sync.error,
      };
    },
    sync: async () => {
      await trainingsApi.save.completedTrainings();
    },
  };
};

controller.storeDataAccessors = ['auth', 'sync'] as string[];
