import React from 'react';

import { Training } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { Props, Controller } from './types';

const PureCreateTraining: React.FC<Props> = (props) => {
  const {
    data,
    onChangeName,
    onAddExercise,
    onDelete,
    onSave,
    onDeleteExercise,
    onOpenExercise,
    onReorderExercises,
  } = props;
  return (
    <Training
      dataTestId="create-training-screen"
      id={data.id}
      name={data.name}
      exercises={data.exercises}
      onChangeName={onChangeName}
      onAddExercise={onAddExercise}
      onDelete={onDelete}
      onSave={onSave}
      onDeleteExercise={onDeleteExercise}
      onOpenExercise={onOpenExercise}
      onReorderExercises={onReorderExercises}
    />
  );
};

export const CreateTraining = connect<Controller, Props>(
  {
    controller,
  },
  (ctrl) => ({
    data: ctrl.getData()!,
    onNoData: ctrl.onNoData,
    onChangeName: ctrl.onChangeName,
    onAddExercise: ctrl.onAddExercise,
    onDelete: ctrl.onDelete,
    onSave: ctrl.onSave,
    onDeleteExercise: ctrl.onDeleteExercise,
    onOpenExercise: ctrl.onOpenExercise,
    onReorderExercises: ctrl.onReorderExercises,
  }),
)(
  requireData<Props>((props) => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(PureCreateTraining),
);
