import React from 'react';
import classnames from 'classnames';
import { Paper } from '@mantine/core';

import { Button, DndList, Input, Layout, NavbarContainer } from '../index';
import { DeleteIcon, DoneIcon } from '../icons';
import style from './style.module.scss';
import { TrainingProps } from './types';

export const Training: React.FC<TrainingProps> = ({
  id,
  name,
  exercises,
  dataTestId,
  onChangeName,
  onAddExercise,
  onDelete,
  onSave,
  onDeleteExercise,
  onOpenExercise,
  onReorderExercises,
}) => {
  const areExercises = Boolean(exercises.length);

  return (
    <Layout
      dataTestId={dataTestId}
      topBar={
        <div className={style.topBar}>
          <Input
            type="text"
            value={name}
            onBlur={onChangeName}
            data-testid="training-name-input"
          />
        </div>
      }
      bottomBar={
        <NavbarContainer className={style.navbarContainer}>
          <Button
            skin="icon"
            size="large"
            onClick={onDelete}
            data-testid="training-delete-button"
          >
            <DeleteIcon />
          </Button>
          <Button
            skin="icon"
            size="large"
            onClick={onSave}
            data-testid="training-save-button"
          >
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
        <DndList
          data={exercises}
          containerClassName={style.exercises}
          containerDataTestId="exercises-list"
          animationClassNames={{
            enter: style.setEnter,
            enterActive: style.setActiveEnter,
            exit: style.setExit,
            exitActive: style.setActiveExit,
          }}
          onReorder={({ newData }) => onReorderExercises(id, newData)}
          renderItem={(exercise, props) => (
            <li
              {...props}
              className={classnames(style.exercise, props.className)}
              data-testid="exercise-item"
            >
              <Button
                skin="icon"
                size="medium"
                className={style.exerciseDelete}
                onClick={() => onDeleteExercise(id, exercise.id)}
                data-testid="delete-exercise-button"
              >
                <DeleteIcon />
              </Button>
              <Paper
                shadow="sm"
                p="xs"
                withBorder
                className={style.exerciseBox}
                onClick={() => onOpenExercise(exercise.id)}
                data-testid="open-exercise-button"
              >
                {exercise.name}
                <br />
                {exercise.setsPreview}
              </Paper>
            </li>
          )}
        />
        <Button
          skin="primary"
          font="nunito"
          className={style.button}
          onClick={onAddExercise}
          data-testid="add-exercise-button"
        >
          Add exersise
        </Button>
      </div>
    </Layout>
  );
};
