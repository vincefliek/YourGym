import { AppContext } from '../../types';
import { NavbarController } from './types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): NavbarController => {
  const { navigationApi, themeApi } = serviceLocator.getAPIs();
  const store = serviceLocator.getStore();

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
    onThemeToggle: () => {
      themeApi.toggleTheme();
    },
    getCurrentTheme: () => store.getStoreData(['theme']).theme || 'light',
    isHomeActive: () => navigationApi.isHomeUrl(),
    isTrainingsActive: () => navigationApi.isTrainingsUrl(),
    isBurgerActive: () => navigationApi.isMenuUrl(),
    isDashboardActive: () => navigationApi.isDashboardUrl(),
    storeDataAccessors: controller.storeDataAccessors,
  };
};

controller.storeDataAccessors = ['theme'] as string[];
