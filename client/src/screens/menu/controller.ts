import { AppContext } from '../../types';
import { MenuController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): MenuController => {
  const store = serviceLocator.getStore();

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
  };
};

controller.storeDataAccessors = ['auth'] as string[];
