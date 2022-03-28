import React from 'react';
import { Navbar } from '../../components';

import { connect } from '../../utils';
import { controller } from './controller';

class PureHome extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <div>
        Home
        <br/>
        <button onClick={onClick}>
          Go to Trainings
        </button>
        <Navbar />
      </div>
    );
  }
}

export const Home = connect({
  controller,
}, ctrl => ({
  onClick: ctrl.goToTraining,
}))(PureHome);
