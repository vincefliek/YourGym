import React from 'react';

import { connect, requireData } from '../../utils';
import { controller } from './controller';

import { Training } from '../../components';

class PureEditTraining extends React.Component {
  _onChangeName = (name) => {
    const trainingId = this.props.training.id;
    this.props.onChangeName(trainingId, name);
  };
  _onDeleteExercise = (exerciseId) => {
    const trainingId = this.props.training.id;
    this.props.onDeleteExercise(trainingId, exerciseId);
  };
  _onDelete = () => {
    const trainingId = this.props.training.id;
    this.props.onDelete(trainingId);
  };
  _onSave = () => {
    const trainingId = this.props.training.id;
    this.props.onSave(trainingId);
  };

  render() {
    const {
      training,
      onOpenExercise,
      onAddExercise,
    } = this.props;

    return (
      <Training
        training={training}
        onChangeName={this._onChangeName}
        onOpenExercise={onOpenExercise}
        onDeleteExercise={this._onDeleteExercise}
        onAddExercise={onAddExercise}
        onDelete={this._onDelete}
        onSave={this._onSave}
      />
    );
  }
}

export const EditTraining = connect({
  controller,
}, ctrl => ({
  training: ctrl.getTraining(),
  onNoData: ctrl.onNoData,
  onChangeName: ctrl.onChangeName,
  onAddExercise: ctrl.onAddExercise,
  onDelete: ctrl.onDelete,
  onSave: ctrl.onSave,
  onDeleteExercise: ctrl.onDeleteExercise,
  onOpenExercise: ctrl.onOpenExercise,
}))(
  requireData(props => ({
    isData: Boolean(props.training),
    onNoData: props.onNoData,
  }))(
    PureEditTraining,
  ),
);
