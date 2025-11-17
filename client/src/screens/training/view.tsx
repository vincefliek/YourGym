import React from 'react';

import { Button, Layout, NavbarContainer } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { ReactComponent as EditIcon } from '../../assets/edit.svg';
import { ReactComponent as BackIcon } from '../../assets/backArrow.svg';

import style from './style.module.scss';

interface Exercise {
  id: string;
  name: string;
  setsPreview: string;
}

interface Training {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Props {
  data: Training;
  isInProgress: boolean;
  onNoData: () => void;
  onStart: () => void;
  onFinish: () => void;
  onBack: () => void;
  onEdit: () => void;
  onOpenExercise: (training: Training, exercise: Exercise) => void;
}

interface Controller {
  isInProgress: () => boolean;
  getTraining: () => Training;
  onNoData: () => void;
  onStart: () => void;
  onFinish: () => void;
  onBack: () => void;
  onEdit: () => void;
  onOpenExercise: (training: Training, exercise: Exercise) => void;
}

class PureTraining extends React.Component<Props> {
  renderTopBar = () => {
    const { data } = this.props;
    return(
      <div className={style.topBar}>
        {data.name}
      </div>
    );
  };

  renderBottomBar = () => {
    const { onBack, onEdit } = this.props;
    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button
          skin="icon"
          size="large"
          onClick={onBack}
        >
          <BackIcon />
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
    const { data, isInProgress, onStart, onFinish } = this.props;

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
          {isInProgress ? (
            <Button
              skin="primary"
              font="nunito"
              className={style.button}
              onClick={onFinish}
            >
              🏆 FINISH 🏆
            </Button>
          ) : (
            <Button
              skin="primary"
              font="nunito"
              className={style.button}
              onClick={onStart}
            >
               Start
            </Button>
          )}
        </div>
      </Layout>
    );
  }
}

export const Training = connect<Controller, Props>({
  controller,
}, ctrl => ({
  data: ctrl.getTraining(),
  isInProgress: ctrl.isInProgress(),
  onNoData: ctrl.onNoData,
  onStart: ctrl.onStart,
  onFinish: ctrl.onFinish,
  onBack: ctrl.onBack,
  onEdit: ctrl.onEdit,
  onOpenExercise: ctrl.onOpenExercise,
}))(
  requireData<Props>(props => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(
    PureTraining,
  ),
);
