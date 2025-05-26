import React from 'react';

import { Layout, Navbar } from '../../components';

export class Menu extends React.Component {
  render() {
    return (
      <Layout bottomBar={<Navbar />}>
        <div style={{ textAlign: 'center' }}>
          Menu
        </div>
      </Layout>
    );
  }
}
