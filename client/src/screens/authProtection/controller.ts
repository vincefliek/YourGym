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
    navigateHome: async () => {
      await navigationApi.toHome();
    },
  };
};

controller.storeDataAccessors = ['auth'] as string[];
