import { navigationApi } from '../../apis';

export const controller = (getStoreData, props) => {
  return {
    goToTraining: () => {
      navigationApi.toTrainings();
    },
  };
};
