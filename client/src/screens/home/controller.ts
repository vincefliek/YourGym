import { AppContext } from '../../types';
import { HomeController } from './types';

export const controller = (serviceLocator: AppContext['serviceLocator']): HomeController => {
  const { navigationApi } = serviceLocator.getAPIs();

  return {
    goToTraining: () => {
      navigationApi.toTrainings();
    },
    storeDataAccessors: controller.storeDataAccessors,
  };
};

controller.storeDataAccessors = [] as string[];
