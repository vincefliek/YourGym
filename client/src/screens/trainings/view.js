import React from 'react';

import { Layout, Navbar } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';

class PureTrainings extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <Layout bottomBar={<Navbar />}>
        <div>
          Trainings: {data.length}
        </div>
      </Layout>
    );
  }
}

export const Trainings = connect({
  controller,
}, ctrl => ({
  data: ctrl.getTrainings(),
  onAddTraining: ctrl.onAddTraining,
}))(PureTrainings);
