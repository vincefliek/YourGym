import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import style from './style.module.scss';

type Props = {
  data: { isVisible: boolean; message?: string };
};

const PureBlockingLayer: React.FC<Props> = ({ data }) => {
  if (!data.isVisible) return null;

  return (
    <div className={style.blockingLayer} role="status" aria-live="polite">
      <div className={style.overlay} />
      <div className={style.messageWrapper}>
        <div className={style.message}>{data.message}</div>
      </div>
    </div>
  );
};

export const BlockingLayer = connect({ controller }, (ctrl) => ({
  data: ctrl.getData(),
}))(PureBlockingLayer);
