import React from 'react';

import { Button, Input, Layout, NavbarContainer } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

import style from './style.module.scss';

class PureCreateTraining extends React.Component {
  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const { data, isLoading, onChangeName, onDelete, onSave } = this.props;

    if (isLoading) {
      return (
        <Layout>
          <div className={style.screen}>
            Loading
          </div>
        </Layout>
      );
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
          <NavbarContainer>
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
            >
              Add exersise
            </Button>
          )}
        </div>
      </Layout>
    );
  }
}

export const CreateTraining = connect({
  controller,
}, ctrl => ({
  data: ctrl.getData(),
  isLoading: ctrl.isLoading(),
  onLoad: ctrl.onLoad,
  onChangeName: ctrl.onChangeName,
  onAddExercise: ctrl.onAddExercise,
  onDelete: ctrl.onDelete,
  onSave: ctrl.onSave,
}))(PureCreateTraining);
