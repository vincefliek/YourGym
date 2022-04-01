import React from 'react';

import { Layout, Navbar } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';

class PureBurger extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <Layout bottomBar={<Navbar />}>
        <div>
          Burger
          <br/>
          <button onClick={onClick}>
            Go to Trainings
          </button>
        </div>
      </Layout>
    );
  }
}

export const Burger = connect({
  controller,
}, ctrl => ({
  onClick: ctrl.goToTraining,
}))(PureBurger);
