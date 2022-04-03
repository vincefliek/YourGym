import React from 'react';

import { Layout, Navbar } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';

class PureMenu extends React.Component {
  render() {
    return (
      <Layout bottomBar={<Navbar />}>
        <div>
          Menu
        </div>
      </Layout>
    );
  }
}

export const Menu = connect({
  controller,
}, ctrl => ({
}))(PureMenu);
