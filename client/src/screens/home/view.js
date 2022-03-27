import React from 'react';

import { connect } from '../../model';
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
      </div>
    );
  }
}

export const Home = connect({
  controller,
}, ctrl => ({
  onClick: ctrl.goToTraining,
}))(PureHome);
