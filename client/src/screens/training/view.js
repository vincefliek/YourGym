import React from 'react';
import classnames from 'classnames';

import { Button, Layout, NavbarContainer } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { ReactComponent as EditIcon } from '../../assets/edit.svg';
import { ReactComponent as BackIcon } from '../../assets/backArrow.svg';

import style from './style.module.scss';

class PureTraining extends React.Component {
  renderTopBar = () => {
    const { data } = this.props;
    return(
      <div className={style.topBar}>
        <div className={style.name}>
          {data.name}
        </div>
      </div>
    );
  };

  renderBottomBar = () => {
    const { data, onBack, onStopwatch, onEdit } = this.props;

    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button
          skin="icon"
          size="large"
          onClick={() => onBack(data)}
        >
          <BackIcon />
        </Button>
        <Button
          skin="text"
          size="large"
          className={classnames(style.stopwatch, {
            [style.stopwatchActive]: data.trainingActive,
          })}
          onClick={() => onStopwatch(data)}
        >
          {data.trainingTime}
        </Button>
        <Button
          skin="icon"
          size="large"
          onClick={onEdit}
        >
          <EditIcon />
        </Button>
      </NavbarContainer>
    );
  };

  renderExercises = () => {
    const { data, onOpenExercise } = this.props;
    return (
      <ul className={style.exercises}>
        {data.exercises.map(exercise => {
          return (
            <li
              key={exercise.id}
              className={style.exercise}
            >
              <div
                className={style.exerciseBox}
                onClick={() => onOpenExercise(data, exercise)}
              >
                {exercise.name}
                <br/>
                {exercise.setsPreview}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    const { data, onStart, onFinish } = this.props;

    const areExercises = Boolean(data.exercises.length);

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div className={style.screen}>
          {areExercises && this.renderExercises()}
        </div>
        <div className={style.buttonScreen}>
          {!data.trainingActive ?
            <Button
              skin="primary"
              font="nunito"
              className={style.startButton}
              onClick={() => onStart(data)}
            >
              Start
            </Button>
            :
            <Button
              skin="primary"
              font="nunito"
              className={style.finishButton}
              onClick={() => onFinish(data)}
            >
              Finish
            </Button>
          }
        </div>
      </Layout>
    );
  }
}

export const Training = connect({
  controller,
}, ctrl => ({
  data: ctrl.getTraining(),
  onNoData: ctrl.onNoData,
  onStart: ctrl.onStart,
  onFinish: ctrl.onFinish,
  onStopwatch: ctrl.onStopwatch,
  onBack: ctrl.onBack,
  onEdit: ctrl.onEdit,
  onOpenExercise: ctrl.onOpenExercise,
}))(
  requireData(props => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(
    PureTraining,
  ),
);
