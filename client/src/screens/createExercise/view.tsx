import React from 'react';

import { Exercise } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import {
  Controller,
  CreateExerciseOwnProps,
  CreateExerciseStateProps,
  CreateExerciseState,
} from './types';

type Props = CreateExerciseOwnProps & CreateExerciseStateProps;

class PureCreateExercise extends React.Component<Props, CreateExerciseState> {
  _onDeleteSet = (setId: string) => {
    const exerciseId = this.props.data.id;
    this.props.onDeleteSet(exerciseId, setId);
  };

  render() {
    const {
      data,
      onChangeName,
      onChangeRepetitions,
      onChangeWeight,
      onAddSet,
      onDelete,
      onSave,
      goBack,
    } = this.props;

    return (
      <Exercise
        dataTestId="create-exercise-screen"
        data={data}
        onChangeName={onChangeName}
        onDeleteSet={this._onDeleteSet}
        onChangeRepetitions={onChangeRepetitions}
        onChangeWeight={onChangeWeight}
        onAddSet={onAddSet}
        onDelete={() => {
          onDelete();
          goBack();
        }}
        onSave={() => {
          onSave();
          goBack();
        }}
      />
    );
  }
}

export const CreateExercise = connect<
  Controller,
  CreateExerciseStateProps,
  CreateExerciseOwnProps
>(
  {
    controller,
  },
  (ctrl): CreateExerciseStateProps => ({
    data: ctrl.getData(),
    onChangeName: ctrl.onChangeName,
    onChangeWeight: ctrl.onChangeWeight,
    onChangeRepetitions: ctrl.onChangeRepetitions,
    onNoData: ctrl.onNoData,
    onAddSet: ctrl.onAddSet,
    onDeleteSet: ctrl.onDeleteSet,
    onDelete: ctrl.onDelete,
    onSave: ctrl.onSave,
  }),
)(
  requireData<Props>((props) => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(PureCreateExercise),
);
