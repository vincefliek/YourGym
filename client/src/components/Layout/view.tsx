import React from 'react';
import { LayoutProps } from './types';
import style from './style.module.scss';

export const Layout: React.FC<LayoutProps> = (props) => {
  const { topBar, bottomBar, children, dataTestId } = props;
  return (
    <div className={style.layout} data-testid={dataTestId}>
      {topBar && <div className={style.layoutTop}>{topBar}</div>}
      <div className={style.layoutCenter}>
        <div className={style.layoutContent}>{children}</div>
      </div>
      {bottomBar && <div className={style.layoutBottom}>{bottomBar}</div>}
    </div>
  );
};
