import React from 'react';

import { Exercise } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';

class PureEditExistingExercise extends React.Component {
  _onChangeName = (value) => {
    this.props.onChangeName(this.props.data.id, value);
  };

  _onChangeRepetitions = (setId, value) => {
    this.props.onChangeRepetitions(this.props.data, setId, value);
  };

  _onChangeWeight = (setId, value) => {
    this.props.onChangeWeight(this.props.data, setId, value);
  };

  render() {
    const {
      data,
      onDeleteSet,
      onAddSet,
      onDelete, 
      onSave,
    } = this.props;

    return (
      <Exercise 
        data={data}
        onChangeName={this._onChangeName}
        onDeleteSet={onDeleteSet}
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
