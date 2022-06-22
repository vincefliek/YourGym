import React from 'react';

import { Exercise } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';

class PureEditNewExercise extends React.Component {
  render() {
    const {
      data,
      onChangeName,
      onDeleteSet,
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
        onDeleteSet={onDeleteSet}
        onChangeRepetitions={onChangeRepetitions}
        onChangeWeight={onChangeWeight}
        onAddSet={onAddSet}
        onDelete={onDelete}
        onSave={onSave}
      />
    );
  }
}

export const EditNewExercise = connect({
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
    PureEditNewExercise,
  ),
);
