import { matchPath } from 'react-router-dom';

import { store } from '../../model';

const routes = {
  home: '/',
  trainings: 'trainings',
};

const storeRoutes = {
  home: '/',
  trainings: '/trainings',
};

const getLocation = () => window.location;

export const navigationApi = {
  routes,
  storeRoutes,
  resetRoute: () => {
    if (store.getStoreData().route !== undefined) {
      store.route = undefined;
    }
  },
  goBack: () => {
    store.route = -1;
  },
  toHome: () => {
    store.route = storeRoutes.home;
  },
  toTrainings: () => {
    store.route = storeRoutes.trainings;
  },
  isHomeUrl: () => {
    return matchPath(routes.home, getLocation().pathname);
  },
  isTrainingsUrl: () => {
    return matchPath(routes.trainings, getLocation().pathname);
  },
};
