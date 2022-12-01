import React from 'react';
import { connect, requireData } from '../../utils';
import { controller } from './controller';

import { Training } from '../../components';

class PureCreateTraining extends React.Component {
  _onDeleteExercise = (exerciseId) => {
    const trainingId = this.props.training.id;
    this.props.onDeleteExercise(trainingId, exerciseId);
  };

  render() {
    const {
      training,
      onChangeName,
      onOpenExercise,
      onAddExercise,
      onDelete,
      onSave,
    } = this.props;

    return (
      <Training
        training={training}
        onChangeName={onChangeName}
        onOpenExercise={onOpenExercise}
        onDeleteExercise={this._onDeleteExercise}
        onAddExercise={onAddExercise}
        onDelete={onDelete}
        onSave={onSave}
      />
    );
  }
}

export const CreateTraining = connect({
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
    PureCreateTraining,
  ),
);
