import { store } from '../../model';

const routes = {
  home: '/',
  trainings: '/trainings',
};

export const navigationApi = {
  routes,
  resetRoute: () => {
    if (store.getStoreData().route !== undefined) {
      store.route = undefined;
    }
  },
  goBack: () => {
    store.route = -1;
  },
  toHome: () => {
    store.route = routes.home;
  },
  toTrainings: () => {
    store.route = routes.trainings;
  },
};
