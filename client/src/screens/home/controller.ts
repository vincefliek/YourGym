import { AppContext } from '../../types';
import { HomeController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): HomeController => {
  const { authApi } = serviceLocator.getAPIs();
  const store = serviceLocator.getStore();

  const getStoreData = () => store.getStoreData(controller.storeDataAccessors);

  return {
    isAuthenticated: () => {
      return getStoreData().auth.isAuthenticated;
    },
    fetchAuthData: async () => {
      await authApi.getSession();
    },
    signin: (email: string, password: string) => {
      authApi.signin(email, password);
    },
    signup: (email: string, password: string) => {
      authApi.signup(email, password);
    },
    signout: () => {
      authApi.signout();
    },
  };
};

controller.storeDataAccessors = ['auth'] as string[];
