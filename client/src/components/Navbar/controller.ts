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
    onDashboardClick: () => {
      navigationApi.toDashboard();
    },
    isHomeActive: () => navigationApi.isHomeUrl(),
    isTrainingsActive: () => navigationApi.isTrainingsUrl(),
    isBurgerActive: () => navigationApi.isMenuUrl(),
    isDashboardActive: () => navigationApi.isDashboardUrl(),
    storeDataAccessors: controller.storeDataAccessors,
  };
};

controller.storeDataAccessors = [] as string[];
