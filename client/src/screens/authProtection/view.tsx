import React, { useEffect } from 'react';

import { Outlet } from '@tanstack/react-router';
import { AuthProtectionProps, AuthProtectionController } from './types';
import { connect } from '../../utils';
import { controller } from './controller';

const PureAuthProtection: React.FC<AuthProtectionProps> = (props) => {
  const { isAuthenticated, navigate } = props;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate();
    }
  }, [isAuthenticated, navigate]);

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
    navigate: ctrl.navigate,
  }),
)(PureAuthProtection);
