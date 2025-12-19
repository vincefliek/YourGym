import React from 'react';
import classnames from 'classnames';
import { Button, Input, Layout, NavbarContainer } from '../index';
import DoneIcon from '../../assets/done.svg?react';
import DeleteIcon from '../../assets/delete.svg?react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import style from './style.module.scss';
import { TrainingProps } from './types';

export const Training: React.FC<TrainingProps> = ({
  id,
  name,
  exercises,
  onChangeName,
  onAddExercise,
  onDelete,
  onSave,
  onDeleteExercise,
  onOpenExercise,
}) => {
  const areExercises = Boolean(exercises.length);

  return (
    <Layout
      topBar={
        <div className={style.topBar}>
          <Input type="text" value={name} onBlur={onChangeName} />
        </div>
      }
      bottomBar={
        <NavbarContainer className={style.navbarContainer}>
          <Button skin="icon" size="large" onClick={onDelete}>
            <DeleteIcon />
          </Button>
          <Button skin="icon" size="large" onClick={onSave}>
            <DoneIcon />
          </Button>
        </NavbarContainer>
      }
    >
      <div
        className={classnames(style.screen, {
          [style.screenNoData]: !areExercises,
        })}
      >
        <TransitionGroup component={'ul'} className={style.exercises}>
          {exercises.map((exercise) => (
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
                  onClick={() => onDeleteExercise(id, exercise.id)}
                >
                  <DeleteIcon />
                </Button>
                <div
                  className={style.exerciseBox}
                  onClick={() => onOpenExercise(exercise.id)}
                >
                  {exercise.name}
                  <br />
                  {exercise.setsPreview}
                </div>
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
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
};
