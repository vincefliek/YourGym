import React from 'react';
import classnames from 'classnames';

import { Button, Input, Layout, NavbarContainer } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

import style from './style.module.scss';

class PureCreateTraining extends React.Component {
  renderTopBar = () => {
    const { data, onChangeName } = this.props;
    return (
      <div className={style.topBar}>
        <Input
          type="text"
          value={data.name}
          onBlur={onChangeName}
        />
      </div>
    );
  };

  renderBottomBar = () => {
    const { onDelete, onSave } = this.props;
    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button
          skin="icon"
          size="large"
          onClick={onDelete}
        >
          <DeleteIcon />
        </Button>
        <Button
          skin="icon"
          size="large"
          onClick={onSave}
        >
          <DoneIcon />
        </Button>
      </NavbarContainer>
    );
  };

  renderExercises = () => {
    const { data, onDeleteExercise, onOpenExercise } = this.props;
    return (
      <ul className={style.exercises}>
        {data.exercises.map(exercise => {
          return (
            <li
              key={exercise.id}
              className={style.exercise}
            >
              <Button
                skin="icon"
                size="medium"
                className={style.exerciseDelete}
                onClick={() => onDeleteExercise(data.id, exercise.id)}
              >
                <DeleteIcon />
              </Button>
              <div 
                className={style.exerciseBox} 
                onClick={() => onOpenExercise(exercise.id)}
              >
                {exercise.name}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    const { data, onAddExercise } = this.props;

    const areExercises = Boolean(data.exercises.length);

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div className={classnames(style.screen, {
          [style.screenNoData]: !areExercises,
        })}>
          {areExercises && this.renderExercises()}
          <Button
            skin="primary"
            font="nunito"
            className={style.button}
            onClick={onAddExercise}
          >
            Add exersise
          </Button>
        </div>
      </Layout>
    );
  }
}

export const CreateTraining = connect({
  controller,
}, ctrl => ({
  data: ctrl.getData(),
  onNoData: ctrl.onNoData,
  onChangeName: ctrl.onChangeName,
  onAddExercise: ctrl.onAddExercise,
  onDelete: ctrl.onDelete,
  onSave: ctrl.onSave,
  onDeleteExercise: ctrl.onDeleteExercise,
  onOpenExercise: ctrl.onOpenExercise,
}))(
  requireData(props => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(
    PureCreateTraining,
  ),
);
