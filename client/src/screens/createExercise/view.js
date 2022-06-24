import React from 'react';

import { Exercise } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';

class PureCreateExercise extends React.Component {
  _onDeleteSet = (setId) => {
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
    } = this.props;

    return (
      <Exercise
        data={data}
        onChangeName={onChangeName}
        onDeleteSet={this._onDeleteSet}
        onChangeRepetitions={onChangeRepetitions}
        onChangeWeight={onChangeWeight}
        onAddSet={onAddSet}
        onDelete={onDelete}
        onSave={onSave}
      />
    );
  }
}

export const CreateExercise = connect({
  controller,
}, ctrl => ({
  data: ctrl.getData(),
  onChangeName: ctrl.onChangeName,
  onChangeWeight: ctrl.onChangeWeight,
  onChangeRepetitions: ctrl.onChangeRepetitions,
  onNoData: ctrl.onNoData,
  onAddSet: ctrl.onAddSet,
  onDeleteSet: ctrl.onDeleteSet,
  onDelete: ctrl.onDelete,
  onSave: ctrl.onSave,
}))(
  requireData(props => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(
    PureCreateExercise,
  ),
);
