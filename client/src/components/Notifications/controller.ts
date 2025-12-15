import { Notification } from '../../model/types';
import { AppContext } from '../../types';

interface NotificationsController {
  getNotifications: () => Notification[];
  removeNotification: (id: string) => void;
}

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): NotificationsController => {
  const store = serviceLocator.getStore();
  const { notificationsApi } = serviceLocator.getAPIs();

  return {
    getNotifications: () =>
      store.getStoreData(controller.storeDataAccessors).notifications,
    removeNotification: (id: string) => notificationsApi.removeNotification(id),
  };
};

controller.storeDataAccessors = ['notifications'];
