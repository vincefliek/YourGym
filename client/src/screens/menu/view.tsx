import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import { MenuController } from './types';

import { Layout, Navbar } from '../../components';

import style from './style.module.scss';

interface PureMenuProps {
  authData: ReturnType<MenuController['getAuthData']>
  syncData: ReturnType<MenuController['getSyncData']>
}

const PureMenu: React.FC<PureMenuProps> = (props) => {
  const {
    authData,
    syncData,
  } = props;

  return (
    <Layout bottomBar={<Navbar />}>
      <div>
        <div className={style.metadataBox}>
          <h4>Auth</h4>
          <div className={style.twoColumns}>
            <div>Status:</div>
            {authData.isLoading
              ? <div>⏳ Loading...</div>
              : authData.isAuthenticated
                ? <div>✅</div>
                : <div>⛔️</div>}
          </div>
          {authData.error && (
            <div className={style.twoColumns}>
              <div>Error:</div>
              <div>{authData.error}</div>
            </div>
          )}
        </div>
        <div className={style.metadataBox}>
          <h4>Sync</h4>
          <div className={style.twoColumns}>
            <div>Last at:</div>
            {syncData.isLoading
              ? <div>⏳ Loading...</div>
              : syncData.lastSyncAt
                ? <div>{syncData.lastSyncAt}</div>
                : <div>🏗️ TBD</div>}
          </div>
          {syncData.error && (
            <div className={style.twoColumns}>
              <div>Error:</div>
              <div>{syncData.error}</div>
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
  syncData: ctrl.getSyncData(),
}))(PureMenu);
