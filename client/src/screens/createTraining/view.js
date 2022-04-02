import React from 'react';

import { Button, Input, Layout, Navbar } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';

import style from './style.module.scss';

class PureCreateTraining extends React.Component {
  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const { data, isLoading, onChangeName } = this.props;

    if (isLoading) {
      return (
        <Layout>
          <div className={style.screen}>
            Loading
          </div>
        </Layout>
      );
    }

    return (
      <Layout
        topBar={
          <div className={style.topBar}>
            <Input
              type="text"
              value={data.name}
              onBlur={onChangeName}
            />
          </div>
        }
        bottomBar={<Navbar />}
      >
        <div className={style.screen}>
          {!data.exercises.length && (
            <Button
              skin="primary"
              font="nunito"
              className={style.button}
            >
              Add exersise
            </Button>
          )}
        </div>
      </Layout>
    );
  }
}

export const CreateTraining = connect({
  controller,
}, ctrl => ({
  data: ctrl.getData(),
  isLoading: ctrl.isLoading(),
  onLoad: ctrl.onLoad,
  onChangeName: ctrl.onChangeName,
  onAddExercise: ctrl.onAddExercise,
}))(PureCreateTraining);
