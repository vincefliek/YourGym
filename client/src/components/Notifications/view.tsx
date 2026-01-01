import React, { useEffect } from 'react';
import classNames from 'classnames';

import { connect } from '../../utils';
import DeleteIcon from '../../assets/delete.svg?react';
import { Notification } from '../../model/types';
import { Button } from '../Button';
import { controller } from './controller';
import style from './style.module.scss';

const AUTO_DISMISS_MS = 5000;

type Props = {
  notifications: Notification[];
  removeNotification: (id: string) => void;
};

const ToastItem: React.FC<{
  n: Notification;
  onClose: (id: string) => void;
}> = ({ n, onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(n.id), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [n.id, onClose]);

  return (
    <div
      className={classNames(style.toast, {
        [style.toastError]: n.type === 'error',
        [style.toastSuccess]: n.type === 'success',
        [style.toastInfo]: n.type === 'info',
      })}
      role="status"
      aria-live="polite"
      data-testid="notification"
    >
      <div className={style.message} data-testid="notification-message">
        {n.message}
      </div>
      <Button
        skin="icon"
        size="small"
        className={style.closeBtn}
        onClick={() => onClose(n.id)}
        aria-label="Dismiss"
        data-testid="dismiss-notification-button"
      >
        <DeleteIcon />
      </Button>
    </div>
  );
};

const PureNotifications: React.FC<Props> = ({
  notifications,
  removeNotification,
}) => {
  if (!notifications.length) {
    return null;
  }

  return (
    <div
      className={style.notifications}
      aria-live="polite"
      data-testid="notifications-container"
    >
      {notifications.map((n) => (
        <ToastItem key={n.id} n={n} onClose={removeNotification} />
      ))}
    </div>
  );
};

export const Notifications = connect({ controller }, (ctrl) => ({
  notifications: ctrl.getNotifications(),
  removeNotification: ctrl.removeNotification,
}))(PureNotifications);
