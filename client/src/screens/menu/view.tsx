import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import { MenuController } from './types';

import { Layout, Navbar } from '../../components';

import style from './style.module.scss';

interface PureMenuProps {
  authData: ReturnType<MenuController['getAuthData']>
}

const PureMenu: React.FC<PureMenuProps> = (props) => {
  const {
    isAuthenticated,
    isLoading,
    error,
  } = props.authData;

  return (
    <Layout bottomBar={<Navbar />}>
      <div style={{ textAlign: 'center' }}>
        Menu
        <div className={style.authBox}>
          <h4>Auth</h4>
          <div className={style.twoColumns}>
            <div>Status:</div>
            {isLoading
              ? <div>⏳ Loading...</div>
              : isAuthenticated
                ? <div>✅</div>
                : <div>⛔️</div>}
          </div>
          {error && (
            <div className={style.twoColumns}>
              <div>Error:</div>
              <div>{error}</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const Menu = connect<MenuController, PureMenuProps>({
  controller,
}, ctrl => ({
  authData: ctrl.getAuthData(),
}))(PureMenu);
