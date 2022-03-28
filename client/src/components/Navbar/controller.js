import { navigationApi } from '../../apis';

export const controller = (getStoreData, props) => {
  return {
    onHomeClick: () => {
      navigationApi.toHome();
    },
    onTrainingsClick: () => {
      navigationApi.toTrainings();
    },
    isHomeActive: () => navigationApi.isHomeUrl(),
    isTrainingsActive: () => navigationApi.isTrainingsUrl(),
  };
};
