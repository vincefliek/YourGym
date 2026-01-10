import { AppContext } from '../../types';
import { AuthProtectionController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): AuthProtectionController => {
  const store = serviceLocator.getStore();
  const { navigationApi } = serviceLocator.getAPIs();

  const getStoreData = () => store.getStoreData(controller.storeDataAccessors);

  return {
    isAuthenticated: () => {
      const auth = getStoreData().auth;
      return auth.isAuthenticated;
    },
    navigate: async () => {
      await navigationApi.goBack({ replace: true });
    },
  };
};

controller.storeDataAccessors = ['auth'] as string[];
