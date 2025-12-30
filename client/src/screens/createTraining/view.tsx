import React from 'react';

import { Training } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';

interface Exercise {
  id: string;
  name: string;
  setsPreview: string;
}

interface TrainingType {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Props {
  data: TrainingType;
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDelete: () => Promise<void>;
  onSave: () => Promise<void>;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
}

interface Controller {
  getData: () => TrainingType;
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDelete: () => Promise<void>;
  onSave: () => Promise<void>;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
}

class PureCreateTraining extends React.Component<Props> {
  render() {
    const {
      data,
      onChangeName,
      onAddExercise,
      onDelete,
      onSave,
      onDeleteExercise,
      onOpenExercise,
    } = this.props;
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
      />
    );
  }
}

export const CreateTraining = connect<Controller, Props>(
  {
    controller,
  },
  (ctrl) => ({
    data: ctrl.getData(),
    onNoData: ctrl.onNoData,
    onChangeName: ctrl.onChangeName,
    onAddExercise: ctrl.onAddExercise,
    onDelete: ctrl.onDelete,
    onSave: ctrl.onSave,
    onDeleteExercise: ctrl.onDeleteExercise,
    onOpenExercise: ctrl.onOpenExercise,
  }),
)(
  requireData<Props>((props) => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(PureCreateTraining),
);
