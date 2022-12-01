import React from 'react';
import classnames from 'classnames';

import {
  Button,
  Input,
  Layout,
  NavbarContainer,
} from '..';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import style from './style.module.scss';

export class Training extends React.Component {
  renderTopBar = () => {
    const { training, onChangeName } = this.props;
    return (
      <div className={style.topBar}>
        <Input
          type="text"
          value={training.name}
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
    const { training, onDeleteExercise, onOpenExercise } = this.props;
    return (
      <TransitionGroup component={'ul'} className={style.exercises}>
        {training.exercises.map(exercise => {
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
                  onClick={() => onDeleteExercise(exercise.id)}
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
    const { training, onAddExercise } = this.props;

    const areExercises = Boolean(training.exercises.length);

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
