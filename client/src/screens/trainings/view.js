import React from 'react';

import { Button, Layout, Navbar } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';

import style from './style.module.scss';

class PureTrainings extends React.Component {
  render() {
    return (
      <Layout bottomBar={<Navbar />}>
        <div className={style.screen}>
          <Button
            skin="primary"
            font="nunito"
            className={style.button}
          >
            Add your 1st training
          </Button>
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
