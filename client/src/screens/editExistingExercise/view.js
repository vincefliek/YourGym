import React from 'react';

import { Exercise } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';

class PureEditExistingExercise extends React.Component {
  _onChangeName = (value) => {
    const exerciseId = this.props.data.id;
    this.props.onChangeName(exerciseId, value);
  };

  _onDeleteSet = (setId) => {
    const exerciseId = this.props.data.id;
    this.props.onDeleteSet(exerciseId, setId);
  };

  _onChangeRepetitions = (setId, value) => {
    const exerciseId = this.props.data.id;
    this.props.onChangeRepetitions(exerciseId, setId, value);
  };

  _onChangeWeight = (setId, value) => {
    const exerciseId = this.props.data.id;
    this.props.onChangeWeight(exerciseId, setId, value);
  };

  render() {
    const {
      data,
      onAddSet,
      onDelete,
      onSave,
    } = this.props;

    return (
      <Exercise
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

export const EditExistingExercise = connect({
  controller,
}, ctrl => ({
  data: ctrl.getExercise(),
  onNoData: ctrl.onNoData,
  onChangeName: ctrl.onChangeName,
  onChangeWeight: ctrl.onChangeWeight,
  onChangeRepetitions: ctrl.onChangeRepetitions,
  onAddSet: ctrl.onAddSet,
  onDeleteSet: ctrl.onDeleteSet,
  onDelete: ctrl.onDelete,
  onSave: ctrl.onSave,
}))(
  requireData(props => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(
    PureEditExistingExercise,
  ),
);
