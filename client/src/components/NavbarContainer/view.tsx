import React from 'react';
import classnames from 'classnames';
import { NavbarContainerProps } from './types';

import style from './style.module.scss';

export const NavbarContainer: React.FC<NavbarContainerProps> = ({ className, children }) => {
  return (
    <div className={classnames(style.navbar, className)}>
      {children}
    </div>
  );
};
