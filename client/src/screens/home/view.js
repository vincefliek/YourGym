import React from 'react';
import { Layout, Navbar } from '../../components';

import { connect } from '../../utils';
import { controller } from './controller';

class PureHome extends React.Component {
  render() {
    return (
      <Layout bottomBar={<Navbar />}>
        <div>
          Home
        </div>
      </Layout>
    );
  }
}

export const Home = connect({
  controller,
}, ctrl => ({
  onClick: ctrl.goToTraining,
}))(PureHome);
