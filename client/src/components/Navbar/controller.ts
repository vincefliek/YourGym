import { AppContext } from '../../types';
import { NavbarController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): NavbarController => {
  const { navigationApi } = serviceLocator.getAPIs();

  return {
    onHomeClick: () => {
      navigationApi.toHome();
    },
    onTrainingsClick: () => {
      navigationApi.toTrainings();
    },
    onBurgerClick: () => {
      navigationApi.toMenu();
    },
    isHomeActive: () => navigationApi.isHomeUrl(),
    isTrainingsActive: () => navigationApi.isTrainingsUrl(),
    isBurgerActive: () => navigationApi.isMenuUrl(),
    storeDataAccessors: controller.storeDataAccessors,
  };
};

controller.storeDataAccessors = [] as string[];
