import React from 'react';
import { Navbar } from '../../components';

import { connect } from '../../utils';
import { controller } from './controller';

class PureTrainings extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        Trainings: {data.length}
        <Navbar />
      </div>
    );
  }
}

export const Trainings = connect({
  controller,
}, ctrl => ({
  data: ctrl.getTrainings(),
  onAddTraining: ctrl.onAddTraining,
}))(PureTrainings);
