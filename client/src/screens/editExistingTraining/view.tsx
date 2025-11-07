import React from 'react';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { Training } from '../../model/types';
import { Training as TrainingComp } from '../../components';

interface Props {
  data: Training;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onEditExercise: (exerciseId: string) => void;
}

type ControllerType = ReturnType<typeof controller>;

const PureEditExistingTraining: React.FC<Props> = (props) => {
  const {
    data,
    onChangeName,
    onAddExercise,
    onDelete,
    onSave,
    onDeleteExercise,
    onEditExercise,
  } = props;
  return (
    <TrainingComp
      id={data.id}
      name={data.name}
      exercises={data.exercises}
      onChangeName={onChangeName}
      onAddExercise={onAddExercise}
      onDelete={onDelete}
      onSave={onSave}
      onDeleteExercise={onDeleteExercise}
      onOpenExercise={onEditExercise}
    />
  );
};

export const EditExistingTraining = connect<ControllerType, Props>({
  controller,
}, ctrl => ({
  data: ctrl.getTraining(),
  onSave: ctrl.onSave,
  onDelete: ctrl.onDelete,
  onNoData: ctrl.onNoData,
  onChangeName: ctrl.onChangeName,
  onAddExercise: ctrl.onAddExercise,
  onDeleteExercise: ctrl.onDeleteExercise,
  onEditExercise: ctrl.onEditExercise,
}))(requireData<Props>(props => ({
  isData: Boolean(props.data),
  onNoData: props.onNoData,
}))(
  PureEditExistingTraining,
));
