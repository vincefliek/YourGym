import { v4 as uuidv4 } from 'uuid';

import { ApiFactory, Notification, NotificationsApi } from '../../types';
import { getTimestampWithTimeZone } from '../../../utils';

export const createNotificationsApi: ApiFactory<
  NotificationsApi,
  {}
> = ({ store }) => {
  const getNotifications = () => store
    .getStoreData(['notifications']).notifications || [];

  const addNotification = (notification: Partial<Notification>) => {
    const id = uuidv4();
    const full = {
      id,
      type: notification.type ?? 'info',
      message: notification.message ?? '',
      createdAt: getTimestampWithTimeZone(new Date()),
      meta: notification.meta ?? {},
    };

    store.notifications = [full, ...getNotifications()].slice(0, 8);

    return id;
  };

  const removeNotification = (id: string) => {
    store.notifications = getNotifications().filter((n: any) => n.id !== id);
  };

  return {
    getNotifications,
    addNotification,
    removeNotification,
  };
};
