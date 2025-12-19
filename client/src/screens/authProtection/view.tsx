import React, { useEffect } from 'react';

import { Outlet } from 'react-router-dom';
import { AuthProtectionProps, AuthProtectionController } from './types';
import { connect } from '../../utils';
import { controller } from './controller';

const PureAuthProtection: React.FC<AuthProtectionProps> = (props) => {
  const { isAuthenticated, navigateHome } = props;

  useEffect(() => {
    if (!isAuthenticated) {
      navigateHome();
    }
  }, [isAuthenticated, navigateHome]);

  return isAuthenticated ? <Outlet /> : null;
};

export const AuthProtection = connect<
  AuthProtectionController,
  AuthProtectionProps
>(
  {
    controller,
  },
  (ctrl) => ({
    isAuthenticated: ctrl.isAuthenticated(),
    navigateHome: ctrl.navigateHome,
  }),
)(PureAuthProtection);
