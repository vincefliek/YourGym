import React from 'react';
import classnames from 'classnames';

import { Button, Input, Layout, NavbarContainer } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

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
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDelete: () => Promise<void>;
  onSave: () => Promise<void>;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
}

interface Controller {
  getData: () => Training;
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDelete: () => Promise<void>;
  onSave: () => Promise<void>;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
}

class PureCreateTraining extends React.Component<Props> {
  renderTopBar = () => {
    const { data, onChangeName } = this.props;
    return (
      <div className={style.topBar}>
        <Input
          type="text"
          value={data.name}
          onBlur={onChangeName}
        />
      </div>
    );
  };

  renderBottomBar = () => {
    const { onDelete, onSave } = this.props;
    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button
          skin="icon"
          size="large"
          onClick={onDelete}
        >
          <DeleteIcon />
        </Button>
        <Button
          skin="icon"
          size="large"
          onClick={onSave}
        >
          <DoneIcon />
        </Button>
      </NavbarContainer>
    );
  };

  renderExercises = () => {
    const { data, onDeleteExercise, onOpenExercise } = this.props;
    return (
      <TransitionGroup component={'ul'} className={style.exercises}>
        {data.exercises.map(exercise => {
          return (
            <CSSTransition
              key={exercise.id}
              timeout={250}
              classNames={{
                enter: style.setEnter,
                enterActive: style.setActiveEnter,
                exit: style.setExit,
                exitActive: style.setActiveExit,
              }}
            >
              <li className={style.exercise}>
                <Button
                  skin="icon"
                  size="medium"
                  className={style.exerciseDelete}
                  onClick={() => onDeleteExercise(data.id, exercise.id)}
                >
                  <DeleteIcon />
                </Button>
                <div
                  className={style.exerciseBox}
                  onClick={() => onOpenExercise(exercise.id)}
                >
                  {exercise.name}
                  <br/>
                  {exercise.setsPreview}
                </div>
              </li>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  };

  render() {
    const { data, onAddExercise } = this.props;

    const areExercises = Boolean(data.exercises.length);

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div className={classnames(style.screen, {
          [style.screenNoData]: !areExercises,
        })}>
          {this.renderExercises()}
          <Button
            skin="primary"
            font="nunito"
            className={style.button}
            onClick={onAddExercise}
          >
            Add exersise
          </Button>
        </div>
      </Layout>
    );
  }
}

export const CreateTraining = connect<Controller, Props>({
  controller,
}, ctrl => ({
  data: ctrl.getData(),
  onNoData: ctrl.onNoData,
  onChangeName: ctrl.onChangeName,
  onAddExercise: ctrl.onAddExercise,
  onDelete: ctrl.onDelete,
  onSave: ctrl.onSave,
  onDeleteExercise: ctrl.onDeleteExercise,
  onOpenExercise: ctrl.onOpenExercise,
}))(
  requireData<Props>(props => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(
    PureCreateTraining,
  ),
);
