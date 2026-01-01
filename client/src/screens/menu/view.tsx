import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import { MenuController } from './types';

import { Button, Layout, Navbar, TrainingProgressCard } from '../../components';

import style from './style.module.scss';

interface PureMenuProps {
  authData: ReturnType<MenuController['getAuthData']>;
  syncData: ReturnType<MenuController['getSyncData']>;
  sync: MenuController['sync'];
  signout: MenuController['signout'];
}

const PureMenu: React.FC<PureMenuProps> = (props) => {
  const { authData, syncData, sync, signout } = props;

  return (
    <Layout bottomBar={<Navbar />} dataTestId="menu-screen">
      <div>
        <div style={{ marginBottom: 12 }}>
          <TrainingProgressCard />
        </div>
        <div className={style.metadataBox}>
          <h4>Auth</h4>
          <div className={style.twoColumns}>
            <div>Status:</div>
            {authData.isLoading ? (
              <div>⏳ Loading...</div>
            ) : authData.isAuthenticated ? (
              <div>✅</div>
            ) : (
              <div>⛔️</div>
            )}
          </div>
          {authData.error && (
            <div className={style.twoColumns}>
              <div>Error:</div>
              <div>{authData.error}</div>
            </div>
          )}
          <br />
          <Button
            skin="primary"
            font="nunito"
            onClick={() => signout()}
            style={{ width: '100%' }}
            disabled={authData.isLoading}
            data-testid="signout-button"
          >
            Sign out
          </Button>
        </div>
        <div className={style.metadataBox}>
          <h4>Sync</h4>
          <div className={style.twoColumns}>
            <div>Last at:</div>
            {syncData.isLoading ? (
              <div>⏳ Loading...</div>
            ) : syncData.lastSyncAt ? (
              <div>{syncData.lastSyncAt}</div>
            ) : (
              <div>🏗️ TBD</div>
            )}
          </div>
          <div className={style.twoColumns}>
            <div>Status:</div>
            {syncData.serverHasChanges ? (
              <div>⚠️ Server has changes ⚠️</div>
            ) : (
              <div>✅</div>
            )}
          </div>
          {syncData.error && (
            <div className={style.twoColumns}>
              <div>Error:</div>
              <div>{syncData.error}</div>
            </div>
          )}
          <br />
          <Button
            skin="primary"
            font="nunito"
            onClick={sync}
            style={{ width: '100%' }}
            disabled={syncData.isLoading}
            data-testid="sync-button"
          >
            Sync
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export const Menu = connect<MenuController, PureMenuProps>(
  {
    controller,
  },
  (ctrl) => ({
    authData: ctrl.getAuthData(),
    syncData: ctrl.getSyncData(),
    sync: ctrl.sync,
    signout: ctrl.signout,
  }),
)(PureMenu);
