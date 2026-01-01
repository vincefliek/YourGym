import React from 'react';

import { Exercise } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { Exercise as ExerciseType } from '../../model/types';

interface Props {
  data: ExerciseType;
  onNoData: () => void;
  onChangeName: (exerciseId: string, name: string) => void;
  onChangeWeight: (
    exercise: ExerciseType,
    setId: string,
    value: string,
  ) => void;
  onChangeRepetitions: (
    exercise: ExerciseType,
    setId: string,
    value: string,
  ) => void;
  onAddSet: () => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onDelete: () => void;
  onSave: () => void;
}

class PureEditNewExercise extends React.Component<Props> {
  _onChangeName = (value: string) => {
    const exerciseId = this.props.data.id;
    this.props.onChangeName(exerciseId, value);
  };

  _onDeleteSet = (setId: string) => {
    const exerciseId = this.props.data.id;
    this.props.onDeleteSet(exerciseId, setId);
  };

  _onChangeRepetitions = (setId: string, value: string) => {
    const exercise = this.props.data as ExerciseType; // Cast to full Exercise type
    this.props.onChangeRepetitions(exercise, setId, value);
  };

  _onChangeWeight = (setId: string, value: string) => {
    const exercise = this.props.data as ExerciseType; // Cast to full Exercise type
    this.props.onChangeWeight(exercise, setId, value);
  };

  render() {
    const { data, onAddSet, onDelete, onSave } = this.props;

    return (
      <Exercise
        dataTestId="edit-new-exercise-screen"
        data={data}
        onChangeName={this._onChangeName}
        onDeleteSet={this._onDeleteSet}
        onChangeRepetitions={this._onChangeRepetitions}
        onChangeWeight={this._onChangeWeight}
        onAddSet={onAddSet}
        onDelete={onDelete}
        onSave={onSave}
      />
    );
  }
}

type Controller = ReturnType<typeof controller>;

export const EditNewExercise = connect<Controller, Props>(
  {
    controller,
  },
  (ctrl) => ({
    data: ctrl.getExercise(),
    onNoData: ctrl.onNoData,
    onChangeName: ctrl.onChangeName,
    onChangeWeight: ctrl.onChangeWeight,
    onChangeRepetitions: ctrl.onChangeRepetitions,
    onAddSet: ctrl.onAddSet,
    onDeleteSet: ctrl.onDeleteSet,
    onDelete: ctrl.onDelete,
    onSave: ctrl.onSave,
  }),
)(
  requireData<Props>((props) => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(PureEditNewExercise),
);
