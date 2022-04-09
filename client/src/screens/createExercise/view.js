import React from 'react';

import {
  Button,
  Input,
  Layout,
  NavbarContainer,
} from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

import style from './style.module.scss';

class PureCreateExercise extends React.Component {
  render() {
    const {
      data,
      onChangeName,
      onAddSet,
      onDelete,
      onSave,
      onChangeRepetitions,
      onChangeWeight,
    } = this.props;

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
          <ul className={style.sets}>
            {data.sets.map((set, index) => {
              return (
                <li
                  key={set.id}
                  className={style.set}
                >
                  <Button
                    skin="icon"
                    size="medium"
                    className={style.setDelete}
                    onClick={() => onDelete(set.id)}
                  >
                    <DeleteIcon />
                  </Button>
                  <div className={style.setName}>
                      Set {index + 1}
                  </div>
                  <div className={style.setRepetitions}>
                    <Input
                      type="text"
                      value={set.repetitions}
                      onBlur={onChangeRepetitions}
                    />
                  </div>
                  <div className={style.setWeight}>
                    <Input
                      type="text"
                      value={set.weight}
                      onBlur={onChangeWeight}
                    />
                  </div>
                  <div className={style.weightUnit}>
                      kg
                  </div>
                </li>
              );
            })}
          </ul>
          <Button
            skin="primary"
            font="nunito"
            className={style.button}
            onClick={onAddSet}
          >
              Add set
          </Button>
        </div>
      </Layout>
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
