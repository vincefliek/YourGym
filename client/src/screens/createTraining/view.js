import React from 'react';

import { Button, Input, Layout, NavbarContainer } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

import style from './style.module.scss';

function PureCreateTraining(props) {
  const {
    data,
    onChangeName,
    onNoData,
    onAddExercise,
    onDelete,
    onSave,
  } = props;

  React.useEffect(() => {
    if (!data) {
      onNoData();
    }
  }, [data, onNoData]);

  if (!data) {
    return null;
  }

  return (
    <Layout
      topBar={
        <div className={style.topBar}>
          <Input
            type="text"
            value={data.name}
            onBlur={onChangeName}
          />
        </div>
      }
      bottomBar={
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
      }
    >
      <div className={style.screen}>
        {!data.exercises.length && (
          <Button
            skin="primary"
            font="nunito"
            className={style.button}
            onClick={onAddExercise}
          >
            Add exersise
          </Button>
        )}
      </div>
    </Layout>
  );
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
}))(PureCreateTraining);
