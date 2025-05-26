import React from 'react';
import { Layout, Navbar } from '../../components';

import { connect } from '../../utils';
import { controller } from './controller';
import { HomeProps, HomeState, HomeController } from './types';

class PureHome extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <Layout bottomBar={<Navbar />}>
        <div style={{ textAlign: 'center' }}>
          Home
        </div>
      </Layout>
    );
  }
}

export const Home = connect<HomeController, HomeProps>({
  controller,
}, ctrl => ({
  onClick: ctrl.goToTraining,
}))(PureHome);
