import React from 'react';

import { Button, Layout, NavbarContainer } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import EditIcon from '../../assets/edit.svg?react';
import BackIcon from '../../assets/backArrow.svg?react';

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
  isAnyTrainingInProgress: boolean;
  isCurrentTrainingInProgress: boolean;
  onNoData: () => void;
  onStart: () => void;
  onFinish: () => void;
  onBack: () => void;
  onEdit: () => void;
  onOpenExercise: (training: Training, exercise: Exercise) => void;
}

interface Controller {
  isAnyTrainingInProgress: () => boolean;
  isCurrentTrainingInProgress: () => boolean;
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
    return <div className={style.topBar}>{data.name}</div>;
  };

  renderBottomBar = () => {
    const { onBack, onEdit } = this.props;
    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button skin="icon" size="large" onClick={onBack}>
          <BackIcon />
        </Button>
        <Button
          skin="icon"
          size="large"
          onClick={onEdit}
          data-testid="training-edit-button"
        >
          <EditIcon />
        </Button>
      </NavbarContainer>
    );
  };

  renderExercises = () => {
    const { data, onOpenExercise } = this.props;
    return (
      <ul className={style.exercises} data-testid="training-exercises-list">
        {data.exercises.map((exercise) => {
          return (
            <li
              key={exercise.id}
              className={style.exercise}
              data-testid="training-exercise-item"
            >
              <div
                className={style.exerciseBox}
                onClick={() => onOpenExercise(data, exercise)}
              >
                {exercise.name}
                <br />
                {exercise.setsPreview}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    const {
      data,
      isAnyTrainingInProgress,
      isCurrentTrainingInProgress,
      onStart,
      onFinish,
    } = this.props;

    const areExercises = Boolean(data.exercises.length);

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
        dataTestId="existing-training-screen"
      >
        <div className={style.screen}>
          {areExercises && this.renderExercises()}
        </div>
        <div className={style.buttonScreen}>
          {isCurrentTrainingInProgress ? (
            <Button
              skin="primary"
              font="nunito"
              className={style.button}
              onClick={onFinish}
              data-testid="finish-training-button"
            >
              🏆 FINISH 🏆
            </Button>
          ) : isAnyTrainingInProgress ? null : (
            <Button
              skin="primary"
              font="nunito"
              className={style.button}
              onClick={onStart}
              data-testid="start-training-button"
            >
              Start
            </Button>
          )}
        </div>
      </Layout>
    );
  }
}

export const Training = connect<Controller, Props>(
  {
    controller,
  },
  (ctrl) => ({
    data: ctrl.getTraining(),
    isAnyTrainingInProgress: ctrl.isAnyTrainingInProgress(),
    isCurrentTrainingInProgress: ctrl.isCurrentTrainingInProgress(),
    onNoData: ctrl.onNoData,
    onStart: ctrl.onStart,
    onFinish: ctrl.onFinish,
    onBack: ctrl.onBack,
    onEdit: ctrl.onEdit,
    onOpenExercise: ctrl.onOpenExercise,
  }),
)(
  requireData<Props>((props) => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(PureTraining),
);
