import { AppContext } from '../../types';
import { MenuController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): MenuController => {
  const store = serviceLocator.getStore();
  const { syncApi, authApi, notificationsApi } = serviceLocator.getAPIs();

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
      await syncApi.sync();
    },
    signout: async () => {
      try {
        await authApi.signout();
      } catch (e: any) {
        notificationsApi.addNotification({
          type: 'error',
          message: `Sigout failed, details: ${e.message}`,
        });
      }
    },
  };
};

controller.storeDataAccessors = ['auth', 'sync'] as string[];
