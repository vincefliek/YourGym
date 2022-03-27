import React from 'react';

import { connect } from '../../model';
import { controller } from './controller';

class PureTrainings extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        Trainings: {data.length}
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
